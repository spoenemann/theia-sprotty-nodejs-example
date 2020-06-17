import { injectable } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { WidgetOpenerOptions } from '@theia/core/lib/browser';
import { DiagramManager } from 'sprotty-theia';

@injectable()
export class ExampleDiagramManager extends DiagramManager {
    
    readonly diagramType: string = 'example';
    readonly iconClass: string = 'fa fa-cubes';

    canHandle(uri: URI, options?: WidgetOpenerOptions | undefined): number {
        if (uri.path.ext === '.conf')
            return 10;
        else
            return 0;
    }

}