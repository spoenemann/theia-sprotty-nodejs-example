import { ContainerModule } from 'inversify';
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core/lib/common/messaging';
import { DiagramServerChannelImpl } from './diagram-server-channel-impl';
import { DiagramServerChannel, diagramServerPath, DiagramClient } from '../common/diagram-server-channel';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
    bind(DiagramServerChannelImpl).toSelf().inSingletonScope();
    bind(DiagramServerChannel).toService(DiagramServerChannelImpl);
    bind(ConnectionHandler).toDynamicValue(context =>
        new JsonRpcConnectionHandler(diagramServerPath, (proxy) => {
            const service = context.container.get<DiagramServerChannel>(DiagramServerChannel);
            service.setClient(proxy as DiagramClient);
            return service;
        })
    ).inSingletonScope();
});
