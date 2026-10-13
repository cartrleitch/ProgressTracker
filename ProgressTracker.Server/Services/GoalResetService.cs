using ProgressTracker.Server.Models;

namespace ProgressTracker.Server.Services
{
    public static class GoalResetService
    {
        public static bool ResetIfPeriodElapsed (Goal goal, DateTime nowUtc) {
            DateTime nextResetUtc = GetNextResetUtc(goal.LastReset, goal.Period, goal.ResetDate);
            Console.WriteLine($"<--- Checking if goal '{goal.Name}' needs reset. Current time: {nowUtc} UTC, Last reset: {goal.LastReset} UTC, Next reset: {nextResetUtc} UTC.");
            if (nowUtc >= nextResetUtc)
            {
                goal.CurrentValue = 0;
                goal.LastReset = nowUtc;
                Console.WriteLine($"<----- Goal '{goal.Name}' reset at {nowUtc} UTC. Next reset scheduled for {GetNextResetUtc(goal.LastReset, goal.Period, goal.ResetDate)} UTC.");
                return true; // Reset occurred
            }
            Console.WriteLine($"<----- Goal '{goal.Name}' does not need reset. Next reset scheduled for {nextResetUtc} UTC.");
            return false; // No reset needed

        }

        private static DateTime GetNextResetUtc (DateTime lastReset, string period, DateTime? resetDate)
        {
            return period switch
            {
                "Daily" => new DateTime(lastReset.Year, lastReset.Month, lastReset.Day).AddDays(1),
                "WeeklyOnThisDay" => new DateTime(lastReset.Year, lastReset.Month, lastReset.Day).AddDays(7),
                "WeeklyOnSetDay" => new DateTime(resetDate.Value.Year, resetDate.Value.Month, resetDate.Value.Day).AddDays(7),
                "Weekly" => new DateTime(lastReset.Year, lastReset.Month, lastReset.Day).AddDays((7 - (int)lastReset.DayOfWeek) == 0 ? 7 : 7 - (int)lastReset.DayOfWeek),
                "MonthlyOnThisDay" => new DateTime(lastReset.Year, lastReset.Month, lastReset.Day).AddMonths(1),
                "MonthlyOnSetDay" => new DateTime(resetDate.Value.Year, resetDate.Value.Month, resetDate.Value.Day).AddMonths(1),
                "Monthly" => new DateTime(lastReset.Year, lastReset.Month, 1).AddMonths(1),
                "YearlyOnThisDay" => new DateTime(lastReset.Year, lastReset.Month, lastReset.Day).AddYears(1),
                "YearlyOnSetDay" => new DateTime(resetDate.Value.Year, resetDate.Value.Month, resetDate.Value.Day).AddYears(1),
                "Yearly" => new DateTime(lastReset.Year, 1, 1).AddYears(1),
                _ => DateTime.MaxValue, // If period is unrecognized, never reset
            };
        }
    }
}
