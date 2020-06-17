import { SModelRoot, SModelElement, Bounds, Point, Dimension } from 'diagram-server';

export interface ActionMessage {
    clientId: string
    action: Action
}

export interface Action {
    kind: string;
}

export interface RequestAction<Res extends ResponseAction> extends Action {
    requestId?: string
}

export function isRequestAction(object?: Action): object is RequestAction<ResponseAction> {
    return typeof((object as any)['requestId']) === 'string';
}

let nextRequestId = 1;
export function generateRequestId(): string {
    return (nextRequestId++).toString();
}

export interface ResponseAction extends Action {
    responseId: string;
}

export function isResponseAction(object?: Action): object is ResponseAction {
    return typeof((object as any)['responseId']) === 'string'
            && (object as any)['responseId'] !== '';
}

export interface RequestModelAction extends RequestAction<SetModelAction> {
    kind: typeof RequestModelAction.KIND;
    options?: { [key: string]: string | number | boolean };
}
export namespace RequestModelAction {
    export const KIND = 'requestModel';
}

export interface SetModelAction extends ResponseAction {
    kind: typeof SetModelAction.KIND;
    newRoot: SModelRoot;
}
export namespace SetModelAction {
    export const KIND = 'setModel';
}

export interface UpdateModelAction {
    kind: typeof UpdateModelAction.KIND;
    newRoot?: SModelRoot;
    matches?: Match[];
    animate?: boolean;
    cause?: Action;
}
export namespace UpdateModelAction {
    export const KIND = 'updateModel';
}

export interface Match {
    left?: SModelElement;
    right?: SModelElement;
    leftParentId?: string;
    rightParentId?: string;
}

export interface RequestPopupModelAction extends RequestAction<SetPopupModelAction> {
    kind: typeof RequestPopupModelAction.KIND;
    elementId: string;
    bounds: Bounds;
}
export namespace RequestPopupModelAction {
    export const KIND = 'requestPopupModel';
}

export interface SetPopupModelAction extends ResponseAction {
    kind: typeof SetPopupModelAction.KIND;
    newRoot: SModelRoot;
}
export namespace SetPopupModelAction {
    export const KIND = 'setPopupModel';
}

export interface RequestBoundsAction extends RequestAction<ComputedBoundsAction> {
    kind: typeof RequestBoundsAction.KIND;
    newRoot: SModelRoot;
}
export namespace RequestBoundsAction {
    export const KIND = 'requestBounds';
}

export interface ComputedBoundsAction extends ResponseAction {
    kind: typeof ComputedBoundsAction.KIND;
    bounds: ElementAndBounds[];
    revision?: number;
    alignments?: ElementAndAlignment[];
}
export namespace ComputedBoundsAction {
    export const KIND = 'computedBounds';
}

export interface ElementAndBounds {
    elementId: string
    newPosition?: Point
    newSize: Dimension
}

export interface ElementAndAlignment {
    elementId: string
    newAlignment: Point
}

export interface SelectAction {
    kind: typeof SelectAction.KIND;
    selectedElementsIDs: string[];
    deselectedElementsIDs: string[];
}
export namespace SelectAction {
    export const KIND = 'elementSelected';
}

export interface SelectAllAction {
    kind: typeof SelectAllAction.KIND;
    select: boolean;
}
export namespace SelectAllAction {
    export const KIND = 'allSelected';
}

export interface CollapseExpandAction {
    kind: typeof CollapseExpandAction.KIND;
    expandIds: string[];
    collapseIds: string[];
}
export namespace CollapseExpandAction {
    export const KIND = 'collapseExpand';
}

export interface CollapseExpandAllAction {
    kind: typeof CollapseExpandAllAction.KIND;
    expand: boolean;
}
export namespace CollapseExpandAllAction {
    export const KIND = 'collapseExpandAll';
}

export interface OpenAction {
    kind: typeof OpenAction.KIND;
    elementId: string;
}
export namespace OpenAction {
    export const KIND = 'open';
}

export interface LayoutAction {
    kind: typeof LayoutAction.KIND;
    layoutType: string;
    elementIds: string[];
}
export namespace LayoutAction {
    export const KIND = 'layout';
}
