import type { MessageType } from '~/components/CallProvider/useCallChat/useCallChat';

export interface TaskType {
  uid: string;
  isDone: boolean;
  name: string;
  order: number; // integer used for sorting
}

export interface TaskSectionType {
  [id: string]: TaskType;
}

export interface ChatChannelType {
  [id: string]: MessageType;
}
