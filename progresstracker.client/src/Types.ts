export interface Goal {
  id: number;
  name: string;
  targetValue: number;
  currentValue: number;
  period: string;
  type: string;
  unit: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastReset?: Date;
  resetDate?: string | null;
  streak?: number;
}
export interface CalendarPeriod {
  start: string;
  end: string;
  progress: number;
  target: number;
  completed: boolean;
}
export interface ProgressEntryData {
  localDate: string;
  valueChange: number;
}
