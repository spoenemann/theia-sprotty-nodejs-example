import { JsonRpcServer } from '@theia/core';
import { ActionMessage } from 'sprotty';

export const diagramServerPath = '/services/diagram-server';
export const DiagramServerChannel = Symbol('DiagramServerChannel');
export interface DiagramServerChannel extends JsonRpcServer<DiagramClientChannel> {
    onMessageReceived(message: ActionMessage): void;
}

export const DiagramClientChannel = Symbol('DiagramClientChannel');
export interface DiagramClientChannel {
    onMessageReceived(message: ActionMessage): void;
}

export const DiagramClientProvider = Symbol('DiagramClientProvider');
export type DiagramClientProvider = () => Promise<DiagramClientChannel>;
