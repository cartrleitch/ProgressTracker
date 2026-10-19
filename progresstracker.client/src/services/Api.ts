import type { CalendarPeriod, Goal, ProgressEntryData } from "../Types.ts";

export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export async function apiFetch(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  if (response.status === 401) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
  return response;
}

export async function getGoals(): Promise<Goal[]> {
  const response = await apiFetch("/api/goals");
  if (!response.ok) {
    throw new Error(`Failed to fetch goals: ${response.status}`);
  }
  return response.json();
}

export async function createGoal(
  goal: Omit<Goal, "id" | "currentValue">,
): Promise<Goal> {
  const response = await apiFetch("/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal),
  });
  if (!response.ok) {
    throw new Error(`Failed to create goal: ${response.status}`);
  }
  return response.json();
}

export async function updateGoal(
  goalToUpdateId: number,
  newGoalData: Goal,
): Promise<void> {
  const response = await apiFetch(`/api/goals/${goalToUpdateId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newGoalData),
  });
  if (!response.ok) {
    throw new Error(`Failed to update goal: ${response.status}`);
  }
}

export async function deleteGoal(goalId: number): Promise<void> {
  const response = await apiFetch(`/api/goals/${goalId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete goal: ${response.status}`);
  }
}

export async function getProgressEntries(
  goalId: number,
): Promise<ProgressEntryData[]> {
  const response = await apiFetch(`/api/progressentries/${goalId}`);
  if (response.status === 204) {
    return [];
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch progress entries: ${response.status}`);
  }
  return response.json();
}

export async function createProgressEntry(
  goalId: number,
  entry: ProgressEntryData,
): Promise<ProgressEntryData> {
  const response = await apiFetch(`/api/progressentries?goalId=${goalId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!response.ok) {
    throw new Error(`Failed to create progress entry: ${response.status}`);
  }
  return response.json();
}

export async function getCalendarInfo(
  goalId: string,
  from: string,
  to: string,
): Promise<CalendarPeriod[]> {
  const response = await apiFetch(
    `/api/progressentries/${goalId}/calendar?from=${from}&to=${to}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch calendar info: ${response.status}`);
  }
  return response.json();
}
