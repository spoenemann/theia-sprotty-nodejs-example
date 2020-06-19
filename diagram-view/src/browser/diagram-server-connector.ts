import { injectable, inject, named } from 'inversify';
import { WidgetManager } from '@theia/core/lib/browser';
import { ActionMessage, ServerStatusAction, ExportSvgAction } from 'sprotty';
import {
    TheiaSprottyConnector, TheiaDiagramServer, TheiaFileSaver, DiagramManagerProvider, DiagramWidget
} from 'sprotty-theia';
import { DiagramClientChannel, DiagramServerChannel } from '../common/diagram-server-channel';

@injectable()
export class DiagramServerConnector implements TheiaSprottyConnector, DiagramClientChannel {

    private readonly servers: TheiaDiagramServer[] = [];

    @inject(TheiaFileSaver)
    protected readonly fileSaver!: TheiaFileSaver;
    @inject(WidgetManager)
    protected readonly widgetManager!: WidgetManager;
    @inject(DiagramManagerProvider)@named('example')
    protected readonly diagramManager!: DiagramManagerProvider;
    @inject(DiagramServerChannel)
    protected readonly diagramServerChannel!: DiagramServerChannel;

    connect(diagramServer: TheiaDiagramServer): void {
        this.servers.push(diagramServer);
        diagramServer.connect(this);
    }

    disconnect(diagramServer: TheiaDiagramServer): void {
        const index = this.servers.indexOf(diagramServer);
        if (index >= 0) {
            this.servers.splice(index, 1);
        }
        diagramServer.disconnect();
    }

    sendMessage(message: ActionMessage): void {
        this.diagramServerChannel.onMessageReceived(message);
    }

    onMessageReceived(message: ActionMessage): void {
        this.servers.forEach(element => {
            element.messageReceived(message);
        });
    }

    save(uri: string, action: ExportSvgAction): void {
        this.fileSaver.save(uri, action);
    }

    async showStatus(clientId: string, status: ServerStatusAction): Promise<void> {
        const diagramManager = await this.diagramManager();
        const widget = this.widgetManager
            .getWidgets(diagramManager.id)
            .find(w => w instanceof DiagramWidget && w.clientId === clientId);
        if (widget instanceof DiagramWidget) {
            widget.setStatus(status);
        }
    }

}
