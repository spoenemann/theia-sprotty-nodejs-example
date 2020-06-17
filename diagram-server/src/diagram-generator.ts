import { SModelRoot, SGraph, SNode, SEdge } from './model';

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
                        size: { width: 20, height: 20 }
                    },
                    <SNode>{
                        type: 'node',
                        id: 'node_1',
                        size: { width: 20, height: 20 }
                    },
                    <SEdge>{
                        type: 'edge',
                        id: 'edge_1',
                        sourceId: 'node_0',
                        targetId: 'node_1'
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
