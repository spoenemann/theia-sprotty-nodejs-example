import { SModelRoot, SGraph, SNode, SEdge, SLabel, SPort } from './model';

export class DiagramGenerator {

    generate(ctx: DiagramGenerator.Context): Promise<SModelRoot> {
        return new Promise<SModelRoot>((resolve, reject) => {
            resolve(<SGraph>{
                type: 'graph',
                id: 'root',
                children: [
                    <SNode>{
                        type: 'node',
                        id: 'node_0',
                        children: [
                            <SLabel>{
                                type: 'label',
                                id: 'node_0_label',
                                text: 'Foo'
                            },
                            <SPort>{
                                type: 'port',
                                id: 'node_0_port_0',
                                size: { width: 5, height: 5 }
                            },
                            <SPort>{
                                type: 'port',
                                id: 'node_0_port_1',
                                size: { width: 5, height: 5 }
                            },
                            <SNode>{
                                type: 'node',
                                id: 'node_1',
                                children: [
                                    <SLabel>{
                                        type: 'label',
                                        id: 'node_1_label',
                                        text: 'Bar'
                                    },
                                    <SPort>{
                                        type: 'port',
                                        id: 'node_1_port_0',
                                        size: { width: 5, height: 5 }
                                    },
                                    <SPort>{
                                        type: 'port',
                                        id: 'node_1_port_1',
                                        size: { width: 5, height: 5 }
                                    }
                                ]
                            },
                            <SEdge>{
                                type: 'edge',
                                id: 'edge_0',
                                sourceId: 'node_0_port_0',
                                targetId: 'node_1_port_0'
                            },
                            <SEdge>{
                                type: 'edge',
                                id: 'edge_1',
                                sourceId: 'node_1_port_1',
                                targetId: 'node_0_port_1'
                            }
                        ]
                    },
                    <SNode>{
                        type: 'node',
                        id: 'node_2',
                        children: [
                            <SLabel>{
                                type: 'label',
                                id: 'node_2_label',
                                text: 'Test'
                            },
                            <SPort>{
                                type: 'port',
                                id: 'node_2_port_0',
                                size: { width: 5, height: 5 }
                            },
                            <SPort>{
                                type: 'port',
                                id: 'node_2_port_1',
                                size: { width: 5, height: 5 }
                            }
                        ]
                    },
                    <SNode>{
                        type: 'node',
                        id: 'node_3',
                        children: [
                            <SLabel>{
                                type: 'label',
                                id: 'node_3_label',
                                text: 'Mock'
                            },
                            <SPort>{
                                type: 'port',
                                id: 'node_3_port_0',
                                size: { width: 5, height: 5 }
                            },
                            <SPort>{
                                type: 'port',
                                id: 'node_3_port_1',
                                size: { width: 5, height: 5 }
                            }
                        ]
                    },
                    <SEdge>{
                        type: 'edge',
                        id: 'edge_2',
                        sourceId: 'node_2_port_0',
                        targetId: 'node_0_port_0'
                    },
                    <SEdge>{
                        type: 'edge',
                        id: 'edge_3',
                        sourceId: 'node_2_port_1',
                        targetId: 'node_3_port_1'
                    },
                    <SEdge>{
                        type: 'edge',
                        id: 'edge_4',
                        sourceId: 'node_0_port_1',
                        targetId: 'node_3_port_0'
                    }
                ]
            });
        });
    }

}

export namespace DiagramGenerator {
    export interface Context {
        options: {
            sourceUri: string;
            diagramType: string;
        }
    }
}
