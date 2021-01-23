export interface ParticipantRecord {
  uid: string;
  joinTime: number;
  leaveTime?: number;
  duration: number;
}
