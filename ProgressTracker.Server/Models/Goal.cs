namespace ProgressTracker.Server.Models
{
    // This class represents a goal that a user wants to track progress towards. Fundamental object for this application.
    public class Goal
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int TargetValue { get; set; }
        public int CurrentValue { get; set; } = 0;
        public string Period { get; set; } = "Daily";
    }
}
