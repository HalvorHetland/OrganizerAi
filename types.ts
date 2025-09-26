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

export interface NotificationSetting {
  timeValue: number;
  timeUnit: 'days' | 'hours';
}

export type ChatMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};