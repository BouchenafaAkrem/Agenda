export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  status: 'done' | 'in-progress' | 'not-done';
  notifications: boolean;
}

export interface DayStats {
  completed: number;
  inProgress: number;
  notDone: number;
}