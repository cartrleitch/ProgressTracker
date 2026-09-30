using ProgressTracker.Server.Models;

namespace ProgressTracker.Server.Services
{
    public static class GoalResetService
    {
        public static bool ResetIfPeriodElapsed (Goal goal, DateTime nowUtc) {
            DateTime nextResetUtc = GetNextResetUtc(goal.LastReset, goal.Period);
            if (nowUtc >= nextResetUtc)
            {
                goal.CurrentValue = 0;
                goal.LastReset = nowUtc;
                return true; // Reset occurred
            }
            return false; // No reset needed

        }

        private static DateTime GetNextResetUtc (DateTime lastReset, string period)
        {
            return period switch
            {
                "Daily" => new DateTime(lastReset.Year, lastReset.Month, lastReset.Day).AddDays(1),
                "WeeklyOnThisDay" => new DateTime(lastReset.Year, lastReset.Month, lastReset.Day).AddDays(7),
                "Weekly" => new DateTime(lastReset.Year, lastReset.Month, lastReset.Day).AddDays((7 - (int)lastReset.DayOfWeek) == 0 ? 7 : 7 - (int)lastReset.DayOfWeek),
                "MonthlyOnThisDay" => new DateTime(lastReset.Year, lastReset.Month, lastReset.Day).AddMonths(1),
                "Monthly" => new DateTime(lastReset.Year, lastReset.Month, 1).AddMonths(1),
                "Yearly" => new DateTime(lastReset.Year, 1, 1).AddYears(1),
                "YearlyOnThisDay" => new DateTime(lastReset.Year, lastReset.Month, lastReset.Day).AddYears(1),
                _ => DateTime.MaxValue, // If period is unrecognized, never reset
            };
        }
    }
}
