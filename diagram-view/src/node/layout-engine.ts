import { injectable } from 'inversify';
import { SModelRoot } from 'diagram-server';
import { Action } from '../common/actions';

@injectable()
export class LayoutEngine {

    layout(model: SModelRoot, cause?: Action): void {
        console.error("Method not implemented.");
    }

}
