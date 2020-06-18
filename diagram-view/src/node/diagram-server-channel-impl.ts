import { injectable, inject } from 'inversify';
import { DiagramServerChannel, DiagramClient } from '../common/diagram-server-channel';
import { ActionMessage } from '../common/actions';
import { DiagramServerImpl, DiagramServices } from './diagram-server-impl';
import { LayoutEngine } from './layout-engine';

@injectable()
export class DiagramServerChannelImpl implements DiagramServerChannel {

    @inject(LayoutEngine)
    protected readonly layoutEngine!: LayoutEngine;

    protected readonly servers = new Map<string, DiagramServerImpl>();

    protected client: DiagramClient | undefined;

    onMessageReceived(message: ActionMessage): void {
        this.getServer(message.clientId).accept(message);
    }

    protected getServer(clientId: string): DiagramServerImpl {
        if (this.servers.has(clientId)) {
            return this.servers.get(clientId)!;
        } else {
            const services: DiagramServices = { layoutEngine: this.layoutEngine };
            const server = new DiagramServerImpl(clientId, message => this.client?.onMessageReceived(message), services);
            this.servers.set(clientId, server);
            return server;
        }
    }

    dispose(): void {
        this.servers.clear();
    }

    setClient(client: DiagramClient | undefined): void {
        this.client = client;
    }

}