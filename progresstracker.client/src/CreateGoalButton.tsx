import React, { useState } from "react";
import type { Goal } from "./Types";
import { toast } from "react-toastify";
import { apiFetch } from "./services/Api";

export default function CreateGoalButton({
  onGoalCreated,
}: {
  onGoalCreated: (goal: Goal) => void;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [targetValue, setTargetValue] = useState(1);
  const [period, setPeriod] = useState("Daily");
  const [type, setType] = useState("Numeric");
  const [unit, setUnit] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newGoal = {
      name,
      targetValue: Number(targetValue),
      currentValue: 0,
      period,
      type,
      unit,
    };

    try {
      const response = await apiFetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal),
      });

      if (!response.ok) {
        throw new Error(`Failed to create goal: ${response.status}`);
        toast.error("Failed to create goal");
      }

      const created = await response.json();
      console.log("Created goal:", created);
      setIsFormOpen(false);
      setName("");
      setTargetValue(1);
      setPeriod("Daily");
      setType("Numeric");
      setUnit("");

      toast.success("Goal created successfully!");
      onGoalCreated(created);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create goal");
    }
  };

  if (!isFormOpen) {
    return (
      <button
        type="button"
        className="create-goal-button"
        onClick={() => setIsFormOpen(true)}
      >
        Set Goal
      </button>
    );
  }

  return (
    <form className="create-goal-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="create-goal-input"
        placeholder="Goal name"
        value={name}
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
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="Numeric">Numeric</option>
        <option value="Checkbox">Checkbox</option>
        <option value="Time">Time</option>
        <option value="Amount">Amount</option>
      </select>

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
        <option value="YearlyOnThisDay">Yearly On This Day</option>
      </select>
      <div className="create-goal-form-actions">
        <button type="submit" className="create-goal-save-button">
          Save
        </button>
        <button
          type="button"
          className="create-goal-cancel-button"
          onClick={() => setIsFormOpen(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
