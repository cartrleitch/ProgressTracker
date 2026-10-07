using ProgressTracker.Server.Data;

namespace ProgressTracker.Server.Models
{
    // This class represents a goal that a user wants to track progress towards. Fundamental object for this application.
    public class Goal
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public float TargetValue { get; set; }
        public float CurrentValue { get; set; } = 0;
        public string Period { get; set; } = "Daily";
        public string Type { get; set; } = "Numeric";
        public string Unit { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastReset { get; set; } = DateTime.UtcNow;
        public string UserId { get; set; } = default!;
        public ApplicationUser? User { get; set; }
    }
}
