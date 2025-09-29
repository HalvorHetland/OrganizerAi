export interface Message {
  role: 'user' | 'model' | 'tool';
  text: string;
}

export interface Member {
  id: number;
  name: string;
  email?: string;
  profilePictureUrl?: string;
}

export interface Assignment {
  id: number;
  name: string;
  dueDate: string;
  isCompleted: boolean;
  assignees: number[]; // Array of member IDs
}

export interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  attendees: number[]; // Array of member IDs
}

export interface NotificationTime {
  timeValue: number;
  timeUnit: 'days' | 'hours' | 'minutes';
}

export interface NotificationSettings {
  assignments: NotificationTime;
  schedule: NotificationTime;
}


export type ChatMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};