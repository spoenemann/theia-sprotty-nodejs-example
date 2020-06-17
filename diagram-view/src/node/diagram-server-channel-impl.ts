import { DiagramServerChannel, DiagramClient } from '../common/diagram-server-channel';
import { ActionMessage } from '../common/actions';

export class DiagramServerChannelImpl implements DiagramServerChannel {

    protected client: DiagramClient | undefined;

    accept(message: ActionMessage): void {
        throw new Error("Method not implemented.");
    }

    dispose(): void {
    }

    setClient(client: DiagramClient | undefined): void {
        this.client = client;
    }

}