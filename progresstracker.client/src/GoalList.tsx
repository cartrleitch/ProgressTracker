import { useEffect, useState } from "react";
import type { Goal } from "./Types";
import { toast } from "react-toastify";
import GoalItem from "./GoalItem.tsx";

export default function GoalList({
  refresh,
  filter,
  showCompleted,
}: {
  refresh: number;
  filter: string[];

  showCompleted: boolean;
}) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const goalOrder: Record<string, number> = {
    Daily: 0,
    Weekly: 1,
    WeeklyOnThisDay: 2,
    Monthly: 3,
    MonthlyOnThisDay: 4,
    Yearly: 5,
    YearlyOnThisDay: 6,
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("/api/goals");
        if (!response.ok) {
          throw new Error(`Failed to fetch goals: ${response.status}`);
        }
        const data: Goal[] = await response.json();
        setGoals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load goals");
        toast.error("Failed to load goals");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [refresh]);

  if (isLoading) {
    return <p>Loading goals...</p>;
  }

  if (error) {
    return <p className="goal-list-error">{error}</p>;
  }

  if (goals.length === 0) {
    return <p>No goals yet. Create one to get started!</p>;
  }

  const handleGoalDeleted = (id: number) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  };

  const handleEdit = (updatedGoal: Goal) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === updatedGoal.id ? updatedGoal : goal,
      ),
    );
  };

  const sortedGoals = [...goals].sort(
    (a, b) => (goalOrder[a.period] ?? 99) - (goalOrder[b.period] ?? 99),
  );
  console.log("Sorted goals:", sortedGoals);

  return (
    <div className="goal-list">
      {sortedGoals
        .filter((goal) => {
          const periodMatchFilter =
            filter.includes("All") || filter.includes(goal.period);
          const completedMatchFilter =
            showCompleted || goal.currentValue < goal.targetValue;

          return periodMatchFilter && completedMatchFilter;
        })
        .map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            onDelete={handleGoalDeleted}
            onEdit={handleEdit}
          />
        ))}
    </div>
  );
}
