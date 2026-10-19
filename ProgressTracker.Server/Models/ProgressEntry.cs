namespace ProgressTracker.Server.Models
{
    // Tracks updates to a goal's progress. Each entry represents a single update to the goal's current value.
    public class ProgressEntry
    {
        public int Id { get; set; }
        public Goal LinkedGoal { get; set; } = null!;
        public DateOnly LocalDate { get; set; } // The date of the progress entry in the user's local time zone.
        public decimal ValueChange { get; set; } // The amount by which the goal's current value changed (can be positive or negative). For boolean goals, this will be 1 or -1.

    }
}
