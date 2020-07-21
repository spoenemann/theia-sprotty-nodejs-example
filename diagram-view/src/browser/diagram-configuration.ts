import { injectable, inject, Container } from 'inversify';
import { TYPES, overrideViewerOptions, KeyTool } from 'sprotty';
import { DiagramConfiguration, TheiaKeyTool } from 'sprotty-theia';
import { diagramContainer } from 'diagram-impl';
import { DiagramServerProxy } from './diagram-server-proxy';
import { DiagramServerConnector } from './diagram-server-connector';

import 'sprotty-theia/css/theia-sprotty.css';

@injectable()
export class ExampleDiagramConfiguration implements DiagramConfiguration {

    readonly diagramType: string = 'example';

    @inject(DiagramServerConnector)
    protected readonly diagramServerConnector!: DiagramServerConnector;

    createContainer(widgetId: string): Container {
        const container = diagramContainer();
        container.rebind(KeyTool).to(TheiaKeyTool).inSingletonScope();
        container.bind(DiagramServerProxy).toSelf().inSingletonScope();
        container.bind(TYPES.ModelSource).toDynamicValue(context => {
            const server = context.container.get(DiagramServerProxy);
            this.diagramServerConnector.connect(server);
            return server;
        }).inSingletonScope();
        overrideViewerOptions(container, {
            baseDiv: widgetId
        });
        return container;
    }

}