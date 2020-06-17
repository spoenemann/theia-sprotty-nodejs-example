import { ContainerModule } from 'inversify';
import {
    FrontendApplicationContribution, OpenHandler, WidgetFactory, WebSocketConnectionProvider
} from '@theia/core/lib/browser';
import { DiagramConfiguration, DiagramManagerProvider, DiagramManager } from 'sprotty-theia';
import { DiagramServerChannel, DiagramClient, diagramServerPath } from '../common/diagram-server-channel';
import { ExampleDiagramConfiguration } from './diagram-configuration';
import { ExampleDiagramManager } from './diagram-manager';
import { DiagramServerConnector } from './diagram-server-connector';

export default new ContainerModule(bind => {
    // Theia-Sprotty binding
    bind(DiagramConfiguration).to(ExampleDiagramConfiguration).inSingletonScope();
    bind(ExampleDiagramManager).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(ExampleDiagramManager);
    bind(OpenHandler).toService(ExampleDiagramManager);
    bind(WidgetFactory).toService(ExampleDiagramManager);
    bind(DiagramManagerProvider).toProvider<DiagramManager>(context => {
        return () => Promise.resolve(context.container.get(ExampleDiagramManager));
    }).whenTargetNamed('example');

    // Diagram server channel
    bind(DiagramServerConnector).toSelf().inSingletonScope();
    bind(DiagramServerChannel).toDynamicValue(context => {
        const connection = context.container.get(WebSocketConnectionProvider);
        const client = context.container.get(DiagramServerConnector);
        return connection.createProxy<DiagramClient>(diagramServerPath, client);
    }).inSingletonScope();
});
