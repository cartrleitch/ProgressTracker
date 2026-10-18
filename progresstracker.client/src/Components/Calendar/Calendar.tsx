import { useState } from "react";
import { apiFetch } from "../../services/Api.ts";
import { toast } from "react-toastify";
import { useEffect } from "react";
import type { Goal } from "../../Types.ts";

interface CalendarPeriod {
  start: string;
  end: string;
  progress: number;
  target: number;
  completed: boolean;
}
export default function Calendar() {
  const [goalId, setGoalId] = useState("");
  const [calendarInfo, setCalendarInfo] = useState<CalendarPeriod[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  const fetchCalendarInfo = async (selectedGoalId: string) => {
    setError(null);
    const year = new Date().getFullYear();
    const from = `${year}-01-01`;
    const to = `${year}-12-31`;

    try {
      const response = await apiFetch(
        `/api/progressentries/${selectedGoalId}/calendar?from=${from}&to=${to}`,
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setCalendarInfo(await response.json());
    } catch (e) {
      setCalendarInfo(null);
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await apiFetch("/api/goals");
        if (!response.ok) {
          throw new Error(`Failed to fetch goals: ${response.status}`);
        }
        const data: Goal[] = await response.json();
        setGoals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load goals");
        toast.error("Failed to load goals");
      }
    };

    fetchGoals();
  });

  return (
      <div className="calendar-container">
          <h1>Progress Calendar</h1>
      <div className="calendar-header">
        <select
          value={goalId}
          onChange={(e) => {
            setGoalId(e.target.value);
            fetchCalendarInfo(e.target.value);
          }}
          className="calendar-select"
        >
          <option value="" disabled>
            Select a goal
          </option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p>{error}</p>}
      <pre>
        {calendarInfo
          ? JSON.stringify(calendarInfo, null, 2)
          : "No calendar info available"}
      </pre>
    </div>
  );
}
