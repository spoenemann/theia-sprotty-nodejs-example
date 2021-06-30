import { injectable, inject } from 'inversify';
import { TYPES } from 'sprotty/lib/base/types';
import { IModelLayoutEngine } from 'sprotty/lib/model-source/local-model-source';
import { DiagramServerChannel, DiagramClientChannel } from '../common/diagram-server-channel';
import { ActionMessage } from '../common/actions';
import { DiagramServerImpl, DiagramServices } from './diagram-server-impl';

@injectable()
export class DiagramServerChannelImpl implements DiagramServerChannel {

    @inject(TYPES.IModelLayoutEngine)
    protected readonly layoutEngine!: IModelLayoutEngine;

    protected readonly servers = new Map<string, DiagramServerImpl>();

    protected client: DiagramClientChannel | undefined;

    onMessageReceived(message: ActionMessage): void {
        this.getServer(message.clientId).accept(message.action);
    }

    protected getServer(clientId: string): DiagramServerImpl {
        if (this.servers.has(clientId)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.servers.get(clientId)!;
        } else {
            const services: DiagramServices = { layoutEngine: this.layoutEngine };
            const server = new DiagramServerImpl(async action => this.client?.onMessageReceived({ clientId, action }), services);
            this.servers.set(clientId, server);
            return server;
        }
    }

    dispose(): void {
        this.servers.clear();
    }

    setClient(client: DiagramClientChannel | undefined): void {
        this.client = client;
    }

}