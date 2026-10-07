export default function ShowCompletedToggle({
  showCompleted,
  setShowCompleted,
}: {
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
}) {
  return (
    <div className="show-completed-checkbox-container">
      <input
        id="showCompletedCheckbox"
        type="checkbox"
        className="show-completed-checkbox"
        checked={showCompleted}
        onChange={() => setShowCompleted(!showCompleted)}
      />

      <label htmlFor="showCompletedCheckbox" className="show-completed-label">
        Show Completed
      </label>
    </div>
  );
}
