namespace ProgressTracker.Server.Services
{
    public class CalendarPeriodService
    {
        // Returns first day of the period for a given date and period type
        public static DateOnly? GetPeriodStart(string period, DateOnly date, DateOnly? resetDate)
        {
            switch (period)
            {
                case "Daily":
                    return date;
                case "Weekly":
                    return date.AddDays(-(int)date.DayOfWeek);
                case "Monthly":
                    return new DateOnly(date.Year, date.Month, 1);
                case "Yearly":
                    return new DateOnly(date.Year, 1, 1);
                case "WeeklyOnSetDay" when resetDate is { } reset:
                    // Calculate the difference in days between the current date's day of the week and the reset date's day of the week, uses reset date as anchor to avoid drifting
                    var daysDifference = ((int)date.DayOfWeek - (int)reset.DayOfWeek + 7) % 7;
                    return date.AddDays(-daysDifference);
                case "MonthlyOnSetDay" when resetDate is { } reset:
                    // Calculate the number of months between the reset date and the current date
                    int monthDifference = (date.Year - reset.Year) * 12 + (date.Month - reset.Month);
                    var start = reset.AddMonths(monthDifference);
                    if (start > date)
                    {
                        start = start.AddMonths(-1);
                    }
                    return start;
                case "YearlyOnSetDay" when resetDate is { } reset:
                    // Calculate the number of years between the reset date and the current date, uses anchor to avoid drifting
                    int yearDifference = date.Year - reset.Year;
                    var startYear = reset.AddYears(yearDifference);
                    if (startYear > date)
                    {
                        startYear = startYear.AddYears(-1);
                    }
                    return startYear;
                default:
                    return null;

            }
        }

        public static DateOnly GetPeriodEnd(string period, DateOnly start, DateOnly? resetDate)
        {
            switch (period)
            {
                case "Daily":
                    return start;
                case "Weekly":
                    return start.AddDays(6);
                case "Monthly":
                    return new DateOnly(start.Year, start.Month, DateTime.DaysInMonth(start.Year, start.Month));
                case "Yearly":
                    return new DateOnly(start.Year, 12, 31);
                case "WeeklyOnSetDay" when resetDate is { } reset:
                    return start.AddDays(6);
                case "MonthlyOnSetDay" when resetDate is { } reset:
                    int monthDifference = (start.Year - reset.Year) * 12 + (start.Month - reset.Month);
                    var nextMonth = reset.AddMonths(monthDifference + 1);   
                    return nextMonth.AddDays(-1);
                case "YearlyOnSetDay" when resetDate is { } reset:
                    int yearDifference = start.Year - reset.Year;
                    var nextYear = reset.AddYears(yearDifference + 1);
                    return nextYear.AddDays(-1);
                default:
                    return start;
            }
        }

    }
}
