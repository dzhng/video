import EventEmitter from 'events';

export const CallEmitter = new EventEmitter();
export type CallEmitterType = typeof CallEmitter;

export enum CallEvents {
  NEW_MESSAGE = 'new-message',
  MESSAGE_NOTI_CLICKED = 'message-noti-clicked',
  NEW_REACTION = 'new-reaction',
}
