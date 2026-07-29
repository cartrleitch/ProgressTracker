import './App.css';
import { useState, useEffect } from 'react';
export interface Goal {
    id: number;
    name: string;
    targetValue: number;
    currentValue: number;
    period: string;
}

export function GoalItem({ goal, onDelete }: { goal: Goal, onDelete: (id: number) => void }) {
    const percent = goal.targetValue > 0
        ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
        : 0;

    const handleEdit = () => {
        console.log(`Edit goal with ID: ${goal.id}`);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the goal "${goal.name}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/goals/${goal.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete goal: ${response.status}`);
            }

            onDelete(goal.id);
            console.log('Deleted goal:', goal.id);
        } catch (error) {
            console.error(error);
        }
        
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
                        <img src="/edit.png" alt="Edit" className="goal-action-icon" />
                    </button>
                    <button type="button" className="goal-delete-button" onClick={handleDelete}>
                        <img src="/delete.png" alt="Delete" className="goal-action-icon" />
                    </button>
                </div>
                <div className="goal-progress-label-percentage">
                    {goal.currentValue} / {goal.targetValue} ({percent}%)
                </div>
            </div>
        </div>
    );
}

export function GoalList({ refresh }: {refresh: number}) {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await fetch('/api/goals');
                if (!response.ok) {
                    throw new Error(`Failed to fetch goals: ${response.status}`);
                }
                const data: Goal[] = await response.json();
                setGoals(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load goals');
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

    return (
        <div className="goal-list">
            {goals.map((goal) => (
                <GoalItem key={goal.id} goal={goal} onDelete={handleGoalDeleted} />
            ))}
        </div>
    );
}

export function CreateGoalButton({ onGoalCreated }: { onGoalCreated: (goal: Goal) => void }) {
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
            onGoalCreated(created);
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
                <option value="Yearly">Yearly</option>
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
