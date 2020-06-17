import { Deferred } from '@theia/core/lib/common/promise-util';
import {
    Action, ActionMessage, isResponseAction, ResponseAction, RequestModelAction, RequestPopupModelAction,
    ComputedBoundsAction, SelectAction, SelectAllAction, CollapseExpandAction, CollapseExpandAllAction,
    OpenAction, LayoutAction, RequestBoundsAction, RequestAction, generateRequestId, SetModelAction, UpdateModelAction
} from '../common/actions';
import { SModelRoot, DiagramGenerator } from 'diagram-server';
import { LayoutEngine } from './layout-engine';

export class DiagramServerImpl {

    protected readonly generator = new DiagramGenerator();

    protected readonly requests = new Map<string, Deferred<ResponseAction>>();
    protected options: DiagramOptions | undefined;
    protected currentRoot: SModelRoot;

    private revision = 0;
    private lastSubmittedModelType?: string;

    constructor(readonly clientId: string,
                readonly remoteEndpoint: (message: ActionMessage) => void,
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

    accept(message: ActionMessage): void {
        if (message.clientId !== this.clientId) {
            return;
        }
        const action = message.action;
        if (isResponseAction(action)) {
            const id = action.responseId;
            if (id) {
                const future = this.requests.get(id);
                if (future) {
                    this.requests.delete(id);
                    future.resolve(action);
                    return;
                }
                console.info('No matching request for response:', action);
            }
        }
        this.handleAction(action);
    }

    dispatch<A extends Action>(action: A): void {
        this.remoteEndpoint({ clientId: this.clientId, action });
    }
    
    request<Res extends ResponseAction>(action: RequestAction<Res>): Promise<Res> {
        if (!action.requestId) {
            action.requestId = 'server_' + generateRequestId();
        }
        const future = new Deferred<Res>();
        this.requests.set(action.requestId, future as any);
        this.dispatch(action);
        return future.promise;
    }

    protected handleAction(action: Action): void {
        switch (action.kind) {
            case RequestModelAction.KIND:
                this.handleRequestModel(action as RequestModelAction);
                break;
            case RequestPopupModelAction.KIND:
                this.handleRequestPopupModel(action as RequestPopupModelAction);
                break;
            case ComputedBoundsAction.KIND:
                this.handleComputedBounds(action as ComputedBoundsAction);
                break;
            case SelectAction.KIND:
                this.handleSelect(action as SelectAction);
                break;
            case SelectAllAction.KIND:
                this.handleSelectAll(action as SelectAllAction);
                break;
            case CollapseExpandAction.KIND:
                this.handleCollapseExpand(action as CollapseExpandAction);
                break;
            case CollapseExpandAllAction.KIND:
                this.handleCollapseExpandAll(action as CollapseExpandAllAction);
                break;
            case OpenAction.KIND:
                this.handleOpen(action as OpenAction);
                break;
            case LayoutAction.KIND:
                this.handleLayout(action as LayoutAction);
                break;
        }
    }
    
    protected handleRequestModel(action: RequestModelAction): void {
        this.options = action.options;
        this.generator.generate({
            options: this.options as any
        }).then(newRoot => {
            this.currentRoot = newRoot;
            this.submitModel(this.currentRoot, false, action);
        }, err => {
            console.error('Failed to generate diagram:', err);
        });
    }

    protected async submitModel(newRoot: SModelRoot, update: boolean, cause?: Action): Promise<void> {
        if (this.needsClientLayout) {
            if (!this.needsServerLayout) {
                // In this case the client won't send us the computed bounds
                this.dispatch({ kind: RequestBoundsAction.KIND, newRoot });
            } else {
                try {
                    const request = { kind: RequestBoundsAction.KIND, newRoot };
                    const response = await this.request(request as RequestAction<ComputedBoundsAction>);
                    const model = this.handleComputedBounds(response);
                    if (model) {
                        this.doSubmitModel(model, update, cause);
                    }
                } catch (err) {
                    console.error('RequestBoundsAction failed with an exception.', err);
                }
            }
        } else {
            this.doSubmitModel(newRoot, update, cause);
        }
    }
    
    private doSubmitModel(newRoot: SModelRoot, update: boolean, cause?: Action): void {
        if (this.needsServerLayout) {
            this.services.layoutEngine.layout(newRoot, cause);
        }
        if (newRoot.revision === this.revision) {
            const modelType = newRoot.type;
            if (cause && cause.kind === RequestModelAction.KIND && (cause as RequestModelAction).requestId) {
                const response = { kind: SetModelAction.KIND, newRoot, responseId: (cause as RequestModelAction).requestId };
                this.dispatch(response);
            } else if (update && modelType === this.lastSubmittedModelType) {
                this.dispatch({ kind: UpdateModelAction.KIND, newRoot, cause });
            } else {
                this.dispatch({ kind: SetModelAction.KIND, newRoot });
            }
            this.lastSubmittedModelType = modelType;
        }
    }

    protected handleComputedBounds(action: ComputedBoundsAction): SModelRoot | undefined {
        if (action.revision === this.currentRoot.revision) {
            console.error('Method not implemented.');
            return this.currentRoot;
        }
    }
    
    protected handleRequestPopupModel(action: RequestPopupModelAction): void {
        console.error('Method not implemented.');
    }

    protected handleSelect(action: SelectAction): void {
        console.error('Method not implemented.');
    }

    protected handleSelectAll(action: SelectAllAction): void {
        console.error('Method not implemented.');
    }

    protected handleCollapseExpand(action: CollapseExpandAction): void {
        console.error('Method not implemented.');
    }

    protected handleCollapseExpandAll(action: CollapseExpandAllAction): void {
        console.error('Method not implemented.');
    }

    protected handleOpen(action: OpenAction): void {
        console.error('Method not implemented.');
    }

    protected handleLayout(action: LayoutAction): void {
        console.error('Method not implemented.');
    }

}

export type DiagramOptions = { [key: string]: string | number | boolean };

export interface DiagramServices {
    readonly layoutEngine: LayoutEngine;
}
