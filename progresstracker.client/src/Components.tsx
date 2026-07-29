import './App.css';
import { useState } from 'react';
export interface Goal {
    id: number;
    name: string;
    targetValue: number;
    currentValue: number;
    period: string;
}

export function GoalItem({ goal }: { goal: Goal }) {
    const percent = goal.targetValue > 0
        ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
        : 0;

    const handleEdit = () => {
        console.log(`Edit goal with ID: ${goal.id}`);
    };

    const handleDelete = () => {
        console.log(`Delete goal with ID: ${goal.id}`);
    };

    return (
        <div className="goal-item">
            <div className="goal-item-header">
                <span className="goal-name">{goal.name}</span>
                <span className="goal-period">{goal.period}</span>
            </div>

            <div className="goal-progress-bar">
                <div
                    className={goal.currentValue < 0.25 * goal.targetValue ? 'goal-progress-fill-25' : goal.currentValue < 0.5 * goal.targetValue ? 'goal-progress-fill-50' : goal.currentValue < 0.75 * goal.targetValue ? 'goal-progress-fill-75' : goal.currentValue < goal.targetValue ? 'goal-progress-fill-100' : 'goal-progress-fill-complete'}
                    style={{ width: `${percent}%` }}
                />
            </div>

            <div className="goal-progress-bottom-row">
                <div className="goal-progress-actions">
                    <button type="button" className="goal-edit-button" onClick={handleEdit}>
                        <img src="/public/edit.png" alt="Edit" className="goal-action-icon" />
                    </button>
                    <button type="button" className="goal-delete-button" onClick={handleDelete}>
                        <img src="/public/delete.png" alt="Delete" className="goal-action-icon" />
                    </button>
                </div>
                <div className="goal-progress-label-percentage">
                    {goal.currentValue} / {goal.targetValue} ({percent}%)
                </div>
            </div>
        </div>
    );
}

export function CreateGoalButton() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [name, setName] = useState('');
    const [targetValue, setTargetValue] = useState('');
    const [period, setPeriod] = useState('Daily');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newGoal = {
            name,
            targetValue: Number(targetValue),
            currentValue: 0,
            period,
        };

        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGoal),
            });

            if (!response.ok) {
                throw new Error(`Failed to create goal: ${response.status}`);
            }

            const created = await response.json();
            console.log('Created goal:', created);
            setIsFormOpen(false);
            setName('');
            setTargetValue('');
            setPeriod('Daily');
        } catch (error) {
            console.error(error);
        }
    };

    if (!isFormOpen) {
        return (
            <button type="button" className="create-goal-button" onClick={() => setIsFormOpen(true)}>
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
            <input
                type="number"
                className="create-goal-input"
                placeholder="Target value"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                required
            />
            <select
                className="create-goal-select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
            >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
            </select>
            <div className="create-goal-form-actions">
                <button type="submit" className="create-goal-save-button">Save</button>
                <button type="button" className="create-goal-cancel-button" onClick={() => setIsFormOpen(false)}>
                    Cancel
                </button>
            </div>
        </form>
    );
}
