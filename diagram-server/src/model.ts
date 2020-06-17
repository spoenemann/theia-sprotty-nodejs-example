import { Bounds, Point, Dimension } from './geometry';

export interface SModelElement {
    type: string;
    id: string;
    children?: SModelElement[];
    cssClasses?: string[];
}

export interface SModelRoot extends SModelElement {
    canvasBounds?: Bounds;
    revision?: number;
}

export interface SGraph extends SModelRoot {
    children: SModelElement[];
    bounds?: Bounds;
    scroll?: Point;
    zoom?: number;
    layoutOptions?: ModelLayoutOptions;
}

export type ModelLayoutOptions = { [key: string]: string | number | boolean };

export interface SShapeElement extends SModelElement {
    position?: Point;
    size?: Dimension;
    layoutOptions?: ModelLayoutOptions;
}

export interface SNode extends SShapeElement {
    layout?: string;
    selected?: boolean;
    hoverFeedback?: boolean;
    opacity?: number;
    anchorKind?: string;
}

export interface SPort extends SShapeElement {
    selected?: boolean;
    hoverFeedback?: boolean;
    opacity?: number;
    anchorKind?: string;
}

export interface SEdge extends SModelElement {
    sourceId: string;
    targetId: string;
    routerKind?: string;
    routingPoints?: Point[];
    selected?: boolean;
    hoverFeedback?: boolean;
    opacity?: number;
}

export interface SLabel extends SShapeElement {
    text: string;
    selected?: boolean;
}

export interface SCompartment extends SShapeElement {
    layout?: string;
}
