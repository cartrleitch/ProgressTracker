using ProgressTracker.Server.Models;

namespace ProgressTracker.Server.Services
{
    public static class GoalResetService
    {
        public static bool ResetIfPeriodElapsed (Goal goal, DateTime nowUtc) {

            var timeZone = ResolveTimeZone(goal.TimeZoneId);
            var lastResetUtc = DateTime.SpecifyKind(goal.LastReset, DateTimeKind.Utc);
            var lastLocal = TimeZoneInfo.ConvertTimeFromUtc(lastResetUtc, timeZone);
            var createdAtLocal = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.SpecifyKind(goal.CreatedAt, DateTimeKind.Utc), timeZone));

            var nextResetLocal = GetNextResetLocal(lastLocal, goal.Period, goal.ResetDate, createdAtLocal);
            Console.WriteLine($"<--- Checking if goal '{goal.Name}' needs reset. Current time: {nowUtc} UTC, Last reset: {goal.LastReset} UTC, Next reset: {nextResetLocal} {timeZone.Id}.");
            if (nextResetLocal == null) return false; // No reset needed

            var nextResetUtc = ConvertToUtc(nextResetLocal.Value, timeZone);
            if (nowUtc < nextResetUtc) return false; // No reset needed

            // Check if the a period has passed since the next reset time, indicating a missed period for the streak
            var secondResetBoundCheck = GetNextResetLocal(nextResetLocal.Value, goal.Period, goal.ResetDate, createdAtLocal);
            bool missedPeriod = secondResetBoundCheck != null && nowUtc >= ConvertToUtc(secondResetBoundCheck.Value, timeZone);

            if (!missedPeriod && goal.CurrentValue >= goal.TargetValue)
            {
                goal.Streak++;
                Console.WriteLine($"<----- Goal '{goal.Name}' streak incremented to {goal.Streak}.");
            }
            else
            {
                goal.Streak = 0;
                Console.WriteLine($"<----- Goal '{goal.Name}' streak reset to 0.");
            }
            goal.CurrentValue = 0;
            goal.LastReset = nowUtc;
            Console.WriteLine($"<----- Goal '{goal.Name}' reset at {nowUtc} UTC. Streak: {goal.Streak}. Next reset scheduled for {GetNextResetLocal(goal.LastReset, goal.Period, goal.ResetDate, createdAtLocal)} {timeZone.Id}.");
            return true; // Reset occurred
        }

        private static DateTime? GetNextResetLocal (DateTime lastLocal, string period, DateOnly? resetDate, DateOnly createdAt)
        {
            var last = DateOnly.FromDateTime(lastLocal);
            DateOnly? next = period switch
            {
                "Daily" => last.AddDays(1),
                "WeeklyOnThisDay" => NextAfter(createdAt, last, (d, k) => d.AddDays(7 * k)),
                "Weekly" => last.AddDays(7 - (int)last.DayOfWeek),   // next Sunday
                "MonthlyOnThisDay" => NextAfter(createdAt, last, (d, k) => d.AddMonths(k)),
                "Monthly" => new DateOnly(last.Year, last.Month, 1).AddMonths(1),
                "YearlyOnThisDay" => NextAfter(createdAt, last, (d, k) => d.AddYears(k)),
                "Yearly" => new DateOnly(last.Year, 1, 1).AddYears(1),

                "WeeklyOnSetDay" when resetDate is { } a => NextAfter(a, last, (d, k) => d.AddDays(7 * k)),
                "MonthlyOnSetDay" when resetDate is { } a => NextAfter(a, last, (d, k) => d.AddMonths(k)),
                "YearlyOnSetDay" when resetDate is { } a => NextAfter(a, last, (d, k) => d.AddYears(k)),
                _ => null
            };
            return next?.ToDateTime(TimeOnly.MinValue);

        }

        private static DateOnly NextAfter (DateOnly anchor, DateOnly after, Func<DateOnly, int, DateOnly> step)
        {
            int k = 0;
            DateOnly d;
            do { d = step(anchor, k++); } while (d <= after);
            return d;
        }

        private static DateTime ConvertToUtc(DateTime localTime, TimeZoneInfo timeZone)
        {
            localTime = DateTime.SpecifyKind(localTime, DateTimeKind.Unspecified);
            if (timeZone.IsInvalidTime(localTime))
            {
                Console.WriteLine($"<----- The local time '{localTime}' is invalid in the time zone '{timeZone.Id}'. Adjusting to the next valid time.");
                localTime = localTime.AddHours(1); // Adjust to the next hour
            }
            return TimeZoneInfo.ConvertTimeToUtc(localTime, timeZone);
        }

        private static TimeZoneInfo ResolveTimeZone(string timeZoneId)
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            }
            catch (TimeZoneNotFoundException)
            {
                Console.WriteLine($"<----- Time zone '{timeZoneId}' not found. Defaulting to UTC.");
                return TimeZoneInfo.Utc;
            }
            catch (InvalidTimeZoneException)
            {
                Console.WriteLine($"<----- Time zone '{timeZoneId}' is invalid. Defaulting to UTC.");
                return TimeZoneInfo.Utc;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"<----- An error occurred while resolving time zone '{timeZoneId}': {ex.Message}. Defaulting to UTC.");
                return TimeZoneInfo.Utc;
            }
        }
    }
}
