import { injectable, inject } from 'inversify';
import { WidgetManager } from '@theia/core/lib/browser';
import { ActionMessage, ServerStatusAction, ExportSvgAction } from 'sprotty';
import {
    TheiaSprottyConnector, TheiaDiagramServer, TheiaFileSaver, DiagramManager, DiagramWidget
} from 'sprotty-theia';
import { DiagramClient, DiagramServerChannel } from '../common/diagram-server-channel';

@injectable()
export class DiagramServerConnector implements TheiaSprottyConnector, DiagramClient {

    private readonly servers: TheiaDiagramServer[] = [];

    @inject(TheiaFileSaver)
    protected readonly fileSaver!: TheiaFileSaver;
    @inject(WidgetManager)
    protected readonly widgetManager!: WidgetManager;
    @inject(DiagramManager)
    protected readonly diagramManager!: DiagramManager;
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
        this.diagramServerChannel.accept(message);
    }

    accept(message: ActionMessage): void {
        this.onMessageReceived(message);
    }

    onMessageReceived(message: ActionMessage): void {
        this.servers.forEach(element => {
            element.messageReceived(message);
        });
    }

    save(uri: string, action: ExportSvgAction): void {
        this.fileSaver.save(uri, action);
    }

    showStatus(clientId: string, status: ServerStatusAction): void {
        const widget = this.widgetManager
            .getWidgets(this.diagramManager.id)
            .find(w => w instanceof DiagramWidget && w.clientId === clientId);
        if (widget instanceof DiagramWidget) {
            widget.setStatus(status);
        }
    }

}
