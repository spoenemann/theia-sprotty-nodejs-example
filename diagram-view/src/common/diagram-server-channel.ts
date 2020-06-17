import { JsonRpcServer } from '@theia/core';
import { ActionMessage } from 'sprotty';

export const diagramServerPath = '/services/diagram-server';
export const DiagramServerChannel = Symbol('DiagramServerChannel');
export interface DiagramServerChannel extends JsonRpcServer<DiagramClient> {
    accept(message: ActionMessage): void;
}

export const DiagramClient = Symbol('DiagramClient');
export interface DiagramClient {
    accept(message: ActionMessage): void;
}
