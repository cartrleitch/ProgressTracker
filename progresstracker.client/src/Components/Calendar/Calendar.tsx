import { useState } from "react";
import { apiFetch } from "../../services/Api.ts";

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

  const fetchCalendarInfo = async () => {
    setError(null);
    const year = new Date().getFullYear();
    const from = `${year}-01-01`;
    const to = `${year}-12-31`;

    try {
      const response = await apiFetch(
        `/api/progressentries/${goalId}/calendar?from=${from}&to=${to}`,
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

  return (
    <div>
      <input
        type="number"
        value={goalId}
        onChange={(e) => setGoalId(e.target.value)}
      />
      <button onClick={fetchCalendarInfo} disabled={!goalId}>
        Load
      </button>
      {error && <p>{error}</p>}
      <pre>
        {calendarInfo
          ? JSON.stringify(calendarInfo, null, 2)
          : "No calendar info available"}
      </pre>
    </div>
  );
}
