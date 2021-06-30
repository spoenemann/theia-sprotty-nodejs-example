import { Deferred } from '@theia/core/lib/common/promise-util';
import { IModelLayoutEngine } from 'sprotty/lib/model-source/local-model-source';
import {
    Action, isResponseAction, ResponseAction, RequestModelAction, ComputedBoundsAction, LayoutAction, RequestBoundsAction,
    RequestAction, generateRequestId, SetModelAction, UpdateModelAction, RejectAction, isRequestAction
} from '../common/actions';
import { SModelRoot, DiagramGenerator } from 'diagram-server';
import { applyBounds, cloneModel } from './model-util';

export class DiagramServerImpl {

    protected readonly generator = new DiagramGenerator();

    protected readonly requests = new Map<string, Deferred<ResponseAction>>();
    protected options: DiagramOptions | undefined;
    protected currentRoot: SModelRoot;

    private revision = 0;
    private lastSubmittedModelType?: string;

    constructor(readonly dispatch: <A extends Action>(action: A) => Promise<void>,
                readonly services: DiagramServices) {
        this.currentRoot = {
            type: 'NONE',
            id: 'ROOT'
        };
    }

    setModel(newRoot: SModelRoot): Promise<void> {
        newRoot.revision = ++this.revision;
        this.currentRoot = newRoot;
        return this.submitModel(newRoot, false);
    }
    
    updateModel(newRoot: SModelRoot): Promise<void> {
        newRoot.revision = ++this.revision;
        this.currentRoot = newRoot;
        return this.submitModel(newRoot, true);
    }

    get needsClientLayout(): boolean {
        if (this.options) {
            return !!this.options.needsClientLayout;
        }
        return true;
    }
    
    get needsServerLayout(): boolean {
        if (this.options) {
            return !!this.options.needsServerLayout;
        }
        return false;
    }

    accept(action: Action): Promise<void> {
        if (isResponseAction(action)) {
            const id = action.responseId;
            const future = this.requests.get(id);
            if (future) {
                this.requests.delete(id);
                if (action.kind === RejectAction.KIND) {
                    const rejectAction: RejectAction = action as any;
                    future.reject(new Error(rejectAction.message));
                    console.warn(`Request with id ${action.responseId} failed: ${rejectAction.message}`, rejectAction.detail);
                } else {
                    future.resolve(action);
                }
                return Promise.resolve();
            }
            console.info('No matching request for response:', action);
        }
        return this.handleAction(action);
    }
    
    request<Res extends ResponseAction>(action: RequestAction<Res>): Promise<Res> {
        if (!action.requestId) {
            action.requestId = 'server_' + generateRequestId();
        }
        const future = new Deferred<Res>();
        this.requests.set(action.requestId, future as any);
        this.dispatch(action).catch(err => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.requests.delete(action.requestId!);
            future.reject(err);
        });
        return future.promise;
    }

    protected rejectRemoteRequest(action: Action | undefined, error: Error): void {
        if (action && isRequestAction(action)) {
            this.dispatch({
                kind: RejectAction.KIND,
                responseId: action.requestId,
                message: error.message,
                detail: error.stack
            });
        }
    }

    protected handleAction(action: Action): Promise<void> {
        switch (action.kind) {
            case RequestModelAction.KIND:
                return this.handleRequestModel(action as RequestModelAction);
            case ComputedBoundsAction.KIND:
                return this.handleComputedBounds(action as ComputedBoundsAction);
            case LayoutAction.KIND:
                return this.handleLayout(action as LayoutAction);
            default:
                console.warn(`Unhandled action from client: ${action.kind}`);
        }
        return Promise.resolve();
    }

    protected async handleRequestModel(action: RequestModelAction): Promise<void> {
        this.options = action.options;
        try {
            const newRoot = await this.generator.generate({
                options: this.options as any
            });
            newRoot.revision = ++this.revision;
            this.currentRoot = newRoot;
            this.submitModel(this.currentRoot, false, action);
        } catch (err) {
            this.rejectRemoteRequest(action, err);
            console.error('Failed to generate diagram:', err);
        }
    }

    protected async submitModel(newRoot: SModelRoot, update: boolean, cause?: Action): Promise<void> {
        if (this.needsClientLayout) {
            if (!this.needsServerLayout) {
                // In this case the client won't send us the computed bounds
                this.dispatch({ kind: RequestBoundsAction.KIND, newRoot });
            } else {
                const request = { kind: RequestBoundsAction.KIND, newRoot };
                const response = await this.request(request as RequestAction<ComputedBoundsAction>);
                if (response.revision === this.currentRoot.revision) {
                    applyBounds(this.currentRoot, response);
                    await this.doSubmitModel(this.currentRoot, update, cause);
                } else {
                    this.rejectRemoteRequest(cause, new Error(`Model revision does not match: ${response.revision}`));
                }
            }
        } else {
            await this.doSubmitModel(newRoot, update, cause);
        }
    }
    
    private async doSubmitModel(newRoot: SModelRoot, update: boolean, cause?: Action): Promise<void> {
        if (newRoot.revision !== this.revision) {
            return;
        }
        if (this.needsServerLayout) {
            newRoot = await this.services.layoutEngine.layout(newRoot);
        }
        const modelType = newRoot.type;
        if (cause && cause.kind === RequestModelAction.KIND) {
            const requestId = (cause as RequestModelAction).requestId;
            const response = { kind: SetModelAction.KIND, newRoot, responseId: requestId };
            await this.dispatch(response);
        } else if (update && modelType === this.lastSubmittedModelType) {
            await this.dispatch({ kind: UpdateModelAction.KIND, newRoot, cause });
        } else {
            await this.dispatch({ kind: SetModelAction.KIND, newRoot });
        }
        this.lastSubmittedModelType = modelType;
    }

    protected handleComputedBounds(action: ComputedBoundsAction): Promise<void> {
        if (action.revision !== this.currentRoot.revision) {
            return Promise.reject();
        }
        applyBounds(this.currentRoot, action);
        return Promise.resolve();
    }

    protected handleLayout(action: LayoutAction): Promise<void> {
        if (!this.needsServerLayout) {
            return Promise.resolve();
        }
        const newRoot = cloneModel(this.currentRoot);
        newRoot.revision = ++this.revision;
        this.currentRoot = newRoot;
        return this.doSubmitModel(newRoot, true, action);
    }

}

export type DiagramOptions = { [key: string]: string | number | boolean };

export interface DiagramServices {
    readonly layoutEngine: IModelLayoutEngine;
}
