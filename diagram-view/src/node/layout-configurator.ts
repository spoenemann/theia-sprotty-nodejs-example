import { injectable } from 'inversify';
import { LayoutOptions } from 'elkjs';
import { SModelIndex } from 'sprotty/lib/base/model/smodel';
import { getBasicType } from 'sprotty/lib/base/model/smodel-utils';
import { DefaultLayoutConfigurator } from 'sprotty-elk';
import { SGraph, SModelElement, SNode } from 'diagram-server';

/**
 * https://www.eclipse.org/elk/reference.html
 */
@injectable()
export class LayoutConfigurator extends DefaultLayoutConfigurator {

    protected graphOptions(sgraph: SGraph, index: SModelIndex<SModelElement>): LayoutOptions {
        return {
            'org.eclipse.elk.algorithm': 'org.eclipse.elk.layered',
            'org.eclipse.elk.direction': 'RIGHT',
            'org.eclipse.elk.edgeRouting': 'ORTHOGONAL',
            'org.eclipse.elk.spacing.edgeNode': '20.0'
        };
    }

    protected nodeOptions(snode: SNode, index: SModelIndex<SModelElement>): LayoutOptions {
        const options: LayoutOptions = {
            'org.eclipse.elk.nodeSize.constraints': 'PORTS,PORT_LABELS,NODE_LABELS,MINIMUM_SIZE',
            'org.eclipse.elk.nodeSize.minimum': '(30,30)',
            'org.eclipse.elk.padding': '(20,20,20,20)'
        };
        if (snode.children && snode.children.find(c => getBasicType(c) === 'node')) {
            options['org.eclipse.elk.algorithm'] = 'org.eclipse.elk.layered';
            options['org.eclipse.elk.direction'] = 'RIGHT';
            options['org.eclipse.elk.edgeRouting'] = 'ORTHOGONAL';
            options['org.eclipse.elk.spacing.edgeNode'] = '15.0';
        }
        if (snode.children && snode.children.find(c => getBasicType(c) === 'port')) {
            options['org.eclipse.elk.portConstraints'] = 'FREE';
        }
        if (snode.children && snode.children.find(c => getBasicType(c) === 'label')) {
            options['org.eclipse.elk.nodeLabels.placement'] = 'INSIDE,H_CENTER,V_TOP';
        }
        return options;
    }

}
