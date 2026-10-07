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
}
