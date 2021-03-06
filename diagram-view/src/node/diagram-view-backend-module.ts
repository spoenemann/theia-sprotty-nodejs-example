import { ContainerModule } from 'inversify';
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core/lib/common/messaging';
import { elkLayoutModule, ElkFactory, ILayoutConfigurator } from 'sprotty-elk';
import ElkConstructor from 'elkjs/lib/elk.bundled';
import { DiagramServerChannelImpl } from './diagram-server-channel-impl';
import { DiagramServerChannel, diagramServerPath, DiagramClientChannel } from '../common/diagram-server-channel';
import { LayoutConfigurator } from './layout-configurator';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
    bind(DiagramServerChannelImpl).toSelf();
    bind(DiagramServerChannel).toService(DiagramServerChannelImpl);
    bind(ConnectionHandler).toDynamicValue(context =>
        new JsonRpcConnectionHandler(diagramServerPath, proxy => {
            const service = context.container.get<DiagramServerChannel>(DiagramServerChannel);
            service.setClient(proxy as DiagramClientChannel);
            return service;
        })
    ).inSingletonScope();
    elkLayoutModule.registry(bind, unbind, isBound, rebind);
    bind(ElkFactory).toConstantValue(() => new ElkConstructor({
        algorithms: ['layered']
    }));
    rebind(ILayoutConfigurator).to(LayoutConfigurator);
});
