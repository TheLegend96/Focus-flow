export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface FocusSession {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  durationMinutes: number;
  timeAgo: string;
  timestamp: string;
  notes: string;
  screenshots?: string[];
  isBreak?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  durationMinutes: number;
  isFocusBlock: boolean;
}
