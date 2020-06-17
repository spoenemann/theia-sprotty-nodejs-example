import { Container, ContainerModule } from 'inversify';
import {
    loadDefaultModules, TYPES, ConsoleLogger, LogLevel, configureModelElement, SGraph, SGraphView,
    SNode, CircularNodeView, SEdge, PolylineEdgeView, SLabel, SLabelView, SPort, RectangularNodeView,
    SCompartment, SCompartmentView
} from 'sprotty';

const diagramContainer: () => Container = () => {
    require('sprotty/css/sprotty.css');
    require('../css/diagram.css');

    const diagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
        rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
        rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);

        const context = { bind, unbind, isBound, rebind };
        configureModelElement(context, 'graph', SGraph, SGraphView);
        configureModelElement(context, 'node', SNode, CircularNodeView);
        configureModelElement(context, 'port', SPort, RectangularNodeView);
        configureModelElement(context, 'edge', SEdge, PolylineEdgeView);
        configureModelElement(context, 'label', SLabel, SLabelView);
        configureModelElement(context, 'compartment', SCompartment, SCompartmentView);
    });

    const container = new Container();
    loadDefaultModules(container);
    container.load(diagramModule);
    return container;
};

export default diagramContainer;
