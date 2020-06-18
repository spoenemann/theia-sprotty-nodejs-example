import { JsonRpcServer } from '@theia/core';
import { ActionMessage } from 'sprotty';

export const diagramServerPath = '/services/diagram-server';
export const DiagramServerChannel = Symbol('DiagramServerChannel');
export interface DiagramServerChannel extends JsonRpcServer<DiagramClient> {
    onMessageReceived(message: ActionMessage): void;
}

export const DiagramClient = Symbol('DiagramClient');
export interface DiagramClient {
    onMessageReceived(message: ActionMessage): void;
}

export const DiagramClientProvider = Symbol('DiagramClientProvider');
export type DiagramClientProvider = () => Promise<DiagramClient>;
