import { SModelIndex } from 'sprotty/lib/base/model/smodel';
import { SModelElement, SModelRoot, Point, Dimension } from 'diagram-server';
import { ComputedBoundsAction } from '../common/actions';

export function cloneModel<T extends SModelElement>(model: T): T {
    return JSON.parse(JSON.stringify(model));
}

export function applyBounds(root: SModelRoot, action: ComputedBoundsAction) {
    const index = new SModelIndex();
    index.add(root);
    for (const b of action.bounds) {
        const element = index.getById(b.elementId);
        if (element) {
            const bae = element as SModelElement & BoundsAware;
            if (b.newPosition) {
                bae.position = { x: b.newPosition.x, y: b.newPosition.y };
            }
            if (b.newSize) {
                bae.size = { width: b.newSize.width, height: b.newSize.height };
            }
        }
    }
    if (action.alignments) {
        for (const a of action.alignments) {
            const element = index.getById(a.elementId);
            if (element) {
                const alignable = element as SModelElement & Alignable;
                alignable.alignment = { x: a.newAlignment.x, y: a.newAlignment.y };
            }
        }
    }
}

export interface BoundsAware {
    position: Point;
    size: Dimension;
}

export interface Alignable {
    alignment: Point;
}
