import { useMemo, useState } from "react";
import { getCalendarInfo, getGoals } from "../../services/Api.ts";
import { toast } from "react-toastify";
import { useEffect } from "react";
import type { Goal, CalendarPeriod } from "../../Types.ts";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pad = (n: number) => n.toString().padStart(2, "0");
const toIso = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

function getDayInfo(
  isoDate: string,
  todayIso: string,
  periods: CalendarPeriod[],
  createdDateIso?: string,
) {
  if (createdDateIso && isoDate < createdDateIso) {
    return { status: "none", period: undefined };
  }

  const period = periods.find((p) => isoDate >= p.start && isoDate <= p.end);
  let status = "missed";
  const isActive =
    !!period && todayIso >= period.start && todayIso <= period.end;

  if (period?.completed) {
    status = "complete";
  } else if (period && period.progress > 0) {
    status = "partial";
  } else if (isoDate > todayIso) {
    status = "future";
  }

  return { status, period, isActive };
}

export default function Calendar() {
  const [goalId, setGoalId] = useState("");
  const [calendarInfo, setCalendarInfo] = useState<CalendarPeriod[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const year = month.getFullYear();
  const todayIso = toIso(new Date());

  // Fetch goals on component mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setGoals(await getGoals());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load goals");
        toast.error("Failed to load goals");
      }
    };
    fetchGoals();
  }, []);

  // Fetch calendar info when goalId or year changes
  useEffect(() => {
    if (!goalId) {
      return;
    }
    let cancelled = false;
    getCalendarInfo(goalId, `${year}-01-01`, `${year}-12-31`)
      .then((data) => {
        if (!cancelled) {
          setCalendarInfo(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load calendar info",
          );
          toast.error("Failed to load calendar info");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [goalId, year]);

  // Get 6 weeks of seven days for the current month
  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const gridStart = new Date(first);
    gridStart.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });
  }, [month]);

  const shiftMonth = (delta: number) => {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  };

  const selectedGoal = goals.find((g) => g.id === Number(goalId));
  const createdIso = selectedGoal?.createdAt
    ? toIso(new Date(selectedGoal.createdAt))
    : undefined;

  return (
    <div>
      <h1>Progress Calendar</h1>
      <br />
      <div className="calendar-container">
        <div className="calendar-header">
          <select
            value={goalId}
            onChange={(e) => {
              setGoalId(e.target.value);
              setCalendarInfo(null);
              setError(null);
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
        <div className="calendar">
          <div className="calendar-nav">
            <button onClick={() => shiftMonth(-1)} aria-label="Previous month">
              &lt;
            </button>
            <span>
              {month.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button onClick={() => shiftMonth(1)} aria-label="Next month">
              &gt;
            </button>
          </div>
          <div className="calendar-grid">
            {WEEKDAYS.map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
            {cells.map((date) => {
              const isoDate = toIso(date);
              const isCurrentMonth = date.getMonth() === month.getMonth();
              const { status, period, isActive } =
                goalId && calendarInfo
                  ? getDayInfo(isoDate, todayIso, calendarInfo, createdIso)
                  : { status: "none", period: undefined, isActive: false };
              return (
                <div
                  key={isoDate}
                  className={[
                    "calendar-day",
                    `day-${status}`,
                    isActive ? "inprogress" : "",
                    isCurrentMonth ? "current-month" : "other-month",
                    isoDate === todayIso ? "today" : "",
                  ].join(" ")}
                  title={period ? `${period.start} - ${period.end}` : undefined}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
          <div className="calendar-legend">
            <span className="legend-item day-complete">Completed</span>
            <span className="legend-item day-partial">Partial</span>
            <span className="legend-item day-missed">Missed</span>
            <span className="legend-item inprogress day-none">In progress</span>
            <span className="legend-item day-none">No data</span>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
}
