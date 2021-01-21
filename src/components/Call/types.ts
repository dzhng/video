export interface TaskType {
  uid: string;
  isDone: boolean;
  name: string;
  order: number; // integer used for sorting
}

export interface TaskSectionType {
  [id: string]: TaskType;
}

export type MessageTypes = 'text' | 'image' | 'file';
export interface MessageType {
  uid: string;
  type: MessageTypes;
  data: string; // raw text, image id, or file id
  createdAt: number; // need to be integer since rtdb don't support dates
}

export interface ChatChannelType {
  [id: string]: MessageType;
}
