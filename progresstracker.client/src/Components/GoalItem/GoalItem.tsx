import React, { useState } from "react";
import { toast } from "react-toastify";
import type { Goal } from "../../Types.ts";
import { apiFetch } from "../../services/Api.ts";

export default function GoalItem({
  goal,
  onDelete,
  onEdit,
}: {
  goal: Goal;
  onDelete: (id: number) => void;
  onEdit: (goal: Goal) => void;
}) {
  // state variables
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(goal.name);
  const [targetValue, setTargetValue] = useState(goal.targetValue);
  const [period, setPeriod] = useState(goal.period);
  const [currentValue, setCurrentValue] = useState(goal.currentValue);
  const [type] = useState(goal.type);
  const [unit, setUnit] = useState(goal.unit);
  const [isSaved, setIsSaved] = useState(true);
  const [valueToAdd, setValueToAdd] = useState(0);
  const [savedCurrentValue, setSavedCurrentValue] = useState(goal.currentValue);
  const [createdAt] = useState(
    goal.createdAt ? new Date(goal.createdAt) : null,
  );
  const [updatedAt] = useState(
    goal.updatedAt ? new Date(goal.updatedAt) : null,
  );

  console.log("GoalItem createdAt:", createdAt);
  console.log("GoalItem updatedAt:", updatedAt);

  const percent =
    goal.targetValue > 0
      ? Math.min(100, Math.round((currentValue / goal.targetValue) * 100))
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal = {
      id: goal.id,
      name,
      targetValue: Number(targetValue),
      currentValue,
      period,
      type,
      unit,
    };

    try {
      const response = await apiFetch(`/api/goals/${goal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal),
      });

      if (!response.ok) {
        throw new Error(`Failed to update goal: ${response.status}`);
      }

      console.log("Updated goal:", newGoal);
      toast.success("Goal updated successfully!");
      setIsEditing(false);
      onEdit(newGoal);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async () => {
    setIsEditing(true);

    console.log(`Edit goal with ID: ${goal.id}`);
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete the goal "${goal.name}"?`,
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(`/api/goals/${goal.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete goal: ${response.status}`);
      }

      onDelete(goal.id);
      toast.success("Goal deleted successfully!");
      console.log("Deleted goal:", goal.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecrement = () => {
    const newCurrentValue = Math.max(0, currentValue - 1);
    setCurrentValue(newCurrentValue);

    if (newCurrentValue !== savedCurrentValue) {
      setIsSaved(false);
    } else {
      setIsSaved(true);
    }
  };

  const handleIncrement = () => {
    const newCurrentValue = currentValue + 1;
    setCurrentValue(newCurrentValue);
    setIsSaved(false);
    if (newCurrentValue !== savedCurrentValue) {
      setIsSaved(false);
    } else {
      setIsSaved(true);
    }
  };

  const handleCheckboxChange = () => {
    const newCurrentValue = currentValue === 0 ? 1 : 0;

    setCurrentValue(newCurrentValue);

    if (newCurrentValue !== savedCurrentValue) {
      setIsSaved(false);
    } else {
      setIsSaved(true);
    }
  };

  const handleSaveProgress = async (value?: number) => {
    try {
      const response = await apiFetch(`/api/goals/${goal.id}`, {
        method: "PUT",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ ...goal, currentValue: value ?? currentValue }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update goal progress: ${response.status}`);
      }

      console.log("Updated goal progress:", {
        ...goal,
        currentValue: value ?? currentValue,
      });
      setIsSaved(true);
      setSavedCurrentValue(value ?? currentValue);
      onEdit({ ...goal, currentValue: value ?? currentValue });
      toast.success("Progress saved successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const getDateSuffix = (date: number) => {
    if (date >= 11 && date <= 13) {
      return "th";
    }
    switch (date % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  if (isEditing) {
    return (
      <form className="create-goal-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="create-goal-input"
          placeholder="Goal name"
          value={name}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {(type == "Amount" || type == "Time") && (
          <input
            type="number"
            className="create-goal-input-target"
            placeholder="Target value"
            value={targetValue}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              setTargetValue(parseFloat(Number(e.target.value).toFixed(2)))
            }
            required
          />
        )}

        {type == "Numeric" && (
          <input
            type="number"
            className="create-goal-input-target"
            placeholder="Target value"
            value={targetValue}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setTargetValue(Math.floor(Number(e.target.value)))}
            onKeyDown={(e) => {
              if (
                e.key === "e" ||
                e.key === "E" ||
                e.key === "." ||
                e.key === "-"
              ) {
                e.preventDefault();
              }
            }}
            required
          />
        )}

        {(type == "Amount" || type == "Time") && (
          <input
            type="text"
            className="create-goal-input-unit"
            placeholder="Unit"
            value={unit}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        )}
        <select
          className="standard-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="WeeklyOnThisDay">Weekly On This Day</option>
          <option value="Monthly">Monthly</option>
          <option value="MonthlyOnThisDay">Monthly On This Day</option>
          <option value="Yearly">Yearly</option>
        </select>
        <div className="create-goal-form-actions">
          <button type="submit" className="create-goal-save-button">
            Save
          </button>
          <button
            type="button"
            className="create-goal-cancel-button"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="goal-item">
      <div className="goal-item-header">
        <span className="goal-name">{goal.name}</span>
        {goal.period == "WeeklyOnThisDay" ? (
          <span className="goal-period">
            Weekly on{" "}
            {createdAt?.toLocaleDateString("en-US", { weekday: "long" })}
          </span>
        ) : goal.period == "MonthlyOnThisDay" ? (
          <span className="goal-period">
            Monthly on {createdAt?.getDate()}
            {getDateSuffix(createdAt?.getDate() ?? 0)}
          </span>
        ) : goal.period == "YearlyOnThisDay" ? (
          <span className="goal-period">
            Yearly on {createdAt?.getDate()}
            {getDateSuffix(createdAt?.getDate() ?? 0)} of{" "}
            {createdAt?.toLocaleDateString("en-US", { month: "long" })}
          </span>
        ) : (
          <span className="goal-period">{goal.period}</span>
        )}
      </div>

      <div className="goal-progress-bar">
        <div
          className={
            currentValue < 0.25 * goal.targetValue
              ? "goal-progress-fill-25"
              : currentValue < 0.5 * goal.targetValue
                ? "goal-progress-fill-50"
                : currentValue < 0.75 * goal.targetValue
                  ? "goal-progress-fill-75"
                  : currentValue < goal.targetValue
                    ? "goal-progress-fill-100"
                    : "goal-progress-fill-complete"
          }
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="goal-progress-bottom-row">
        <div className="goal-progress-actions">
          <button
            type="button"
            className="goal-edit-button"
            onClick={handleEdit}
          >
            <img src="/edit.png" alt="Edit" className="goal-action-icon" />
          </button>
          <button
            type="button"
            className="goal-delete-button"
            onClick={handleDelete}
          >
            <img src="/delete.png" alt="Delete" className="goal-action-icon" />
          </button>
        </div>
        <div>
          {!isSaved && (
            <button
              type="button"
              className="goal-progress-save-button"
              onClick={() => handleSaveProgress(currentValue)}
            >
              Save Progress
            </button>
          )}
        </div>

        {type === "Numeric" && (
          <div className="goal-progress-elements">
            <button
              type="button"
              className="goal-progress-decrement-button"
              onClick={handleDecrement}
            >
              -
            </button>
            <div className="goal-progress-label-percentage">
              {currentValue} / {goal.targetValue} {unit} ({percent}%)
            </div>
            <button
              type="button"
              className="goal-progress-increment-button"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
        )}
        {(type === "Time" || type === "Amount") && (
          <div className="goal-progress-add-elements">
            <input
              type="number"
              className="goal-item-input"
              placeholder="Add value"
              value={valueToAdd}
              onChange={(e) => {
                setValueToAdd(parseFloat(Number(e.target.value).toFixed(2)));
              }}
              onFocus={(e) => e.target.select()}
              required
            />

            <button
              type="button"
              className="goal-progress-add-button"
              onClick={() => {
                const newValue = currentValue + valueToAdd;
                setCurrentValue(newValue);
                handleSaveProgress(newValue);
              }}
            >
              Add
            </button>
          </div>
        )}

        {(type === "Time" || type === "Amount") && (
          <div className="goal-progress-label-fixed">
            {parseFloat(currentValue.toFixed(2))} /{" "}
            {parseFloat(goal.targetValue.toFixed(2))} {unit} ({percent}%)
          </div>
        )}
        {type == "Checkbox" && (
          <div className="goal-progress-checkbox-container">
            <input
              type="checkbox"
              className="goal-progress-checkbox"
              checked={currentValue > 0}
              onChange={handleCheckboxChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
