import { ContainerModule } from 'inversify';
import {
    FrontendApplicationContribution, OpenHandler, WidgetFactory, WebSocketConnectionProvider
} from '@theia/core/lib/browser';
import { DiagramConfiguration, DiagramManagerProvider, DiagramManager } from 'sprotty-theia';
import { DiagramServerChannel, diagramServerPath, DiagramClientProvider, DiagramClient,  } from '../common/diagram-server-channel';
import { ActionMessage } from '../common/actions';
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
    bind(DiagramClientProvider).toProvider(context => {
        return () => Promise.resolve(context.container.get<DiagramClient>(DiagramServerConnector));
    });
    bind(DiagramServerChannel).toDynamicValue(context => {
        const connection = context.container.get(WebSocketConnectionProvider);
        const client = context.container.get<DiagramClientProvider>(DiagramClientProvider);
        return connection.createProxy<DiagramServerChannel>(diagramServerPath, {
            onMessageReceived: (message: ActionMessage) => client().then(c => c.onMessageReceived(message))
        });
    }).inSingletonScope();
});
