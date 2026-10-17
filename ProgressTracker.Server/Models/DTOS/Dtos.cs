namespace ProgressTracker.Server.Models.DTOS
{
    public record CreateProgressEntryRequest(DateOnly LocalDate, decimal ValueChange);
    public record UpdateProgressEntryRequest(DateOnly LocalDate, decimal ValueChange);
    public record ProgressEntryResponse(int Id, int GoalId, DateOnly LocalDate, decimal ValueChange);
    public record CalendarPeriodResponse (DateOnly Start, DateOnly End, decimal Progress, decimal GoalTarget, bool Completed);
}
