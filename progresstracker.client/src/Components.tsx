import './App.css';

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
                    className={goal.currentValue < 0.25 * goal.targetValue ? 'goal-progress-fill-25' : goal.currentValue < 0.5 * goal.targetValue ? 'goal-progress-fill-50' : goal.currentValue < 0.75 * goal.targetValue ? 'goal-progress-fill-75' : goal.currentValue < goal.targetValue   ? 'goal-progress-fill-100' : 'goal-progress-fill-complete'}
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
    const handleCreateGoal = () => {
        // TODO: Replace with actual goal creation logic (open a form/modal or call the API)
        console.log('Set Goal clicked');
    };

    return (
        <button type="button" className="create-goal-button" onClick={handleCreateGoal}>
            Set Goal
        </button>
    );
}
