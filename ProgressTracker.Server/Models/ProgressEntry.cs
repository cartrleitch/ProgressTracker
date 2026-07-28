namespace ProgressTracker.Server.Models
{
    // Tracks updates to a goal's progress. Each entry represents a single update to the goal's current value.
    public class ProgressEntry
    {
        public int Id { get; set; }
        public Goal LinkedGoal { get; set; } = null!;
        public DateTime Date { get; set; }
        public int ValueChange { get; set; }

    }
}
