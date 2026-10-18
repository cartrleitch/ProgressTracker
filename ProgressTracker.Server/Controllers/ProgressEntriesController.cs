using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProgressTracker.Server.Data;
using ProgressTracker.Server.Models;
using ProgressTracker.Server.Models.DTOS;
using System.Security.Claims;
using ProgressTracker.Server.Services;

[Authorize]
[Route("api/[controller]")]
[ApiController]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public class ProgressEntriesController : ControllerBase
{
    private readonly ProgressTrackerContext _context;
    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public ProgressEntriesController(ProgressTrackerContext context)
    {
        _context = context;
    }

    // GET: api/progressentries
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProgressEntry>>> GetProgressEntry()
    {

        return await _context.ProgressEntries.Where(pe => pe.LinkedGoal.UserId == UserId).ToListAsync();
    }

    // GET: api/progressentries/5/calendar?from=2026-01-01&to=2026-12-31
    [HttpGet("{goalId}/calendar")]
    public async Task<ActionResult<IEnumerable<CalendarPeriodResponse>>> GetCalendar(int goalId, DateOnly from, DateOnly to)
    {
        // Get goal for given ProgressEntry and check if it belongs to the current user
        var goal = await _context.Goals.Where(g => g.UserId == UserId && g.Id == goalId).FirstOrDefaultAsync();
        if (goal == null)
        {
            return NotFound();
        }
        // Get all ProgressEntries for the given goal and date range
        var entries = await _context.ProgressEntries.Where(pe => pe.LinkedGoal.UserId == UserId && pe.LinkedGoal.Id == goalId && pe.LocalDate >= from && pe.LocalDate <= to).ToListAsync();

        var target = (decimal)goal.TargetValue;

        // Group entries by period start date and calculate progress for each period
        var periods = entries.Select(e => new
        {
            start = CalendarPeriodService.GetPeriodStart(goal.Period, e.LocalDate, goal.ResetDate),
            e.ValueChange
        })
            .Where(p => p.start != null)
            .GroupBy(p => p.start!.Value)
            .Select(g =>
            {
                var progress = g.Sum(p => p.ValueChange);
                return new CalendarPeriodResponse(
                  g.Key,
                  CalendarPeriodService.GetPeriodEnd(goal.Period, g.Key, goal.ResetDate),
                  progress,
                  target,
                  progress >= target
                 );
            })
            .OrderBy(p => p.Start)
            .ToList();

        return Ok(periods);
    }

    // GET: api/progressentries/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProgressEntry>> GetProgressEntry(int id)
    {
        var progressentry = await _context.ProgressEntries.Where(pe => pe.LinkedGoal.UserId == UserId && pe.Id == id).FirstOrDefaultAsync();

        if (progressentry == null)
        {
            return NotFound();
        }

        return progressentry;
    }

    // GET: api/progressentries/goal/5
    [HttpGet("goal/{goalId}")]
    public async Task<ActionResult<IEnumerable<ProgressEntry>>> GetProgressEntriesByGoal(int goalId)
    {
        var goalExists = await _context.Goals.Where(g => g.UserId == UserId && g.Id == goalId).FirstOrDefaultAsync();
        if (goalExists == null)
        {
            return NotFound();
        }
        var progressEntries = await _context.ProgressEntries.Where(pe => pe.LinkedGoal.UserId == UserId && pe.LinkedGoal.Id == goalId).ToListAsync();

        if (progressEntries == null)
        {
            return NotFound();
        }
        else if (progressEntries.Count == 0)
        {
            return NoContent();
        }

        return progressEntries;
    }

    // PUT: api/progressentries/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutProgressEntry(int? id, UpdateProgressEntryRequest progressentry)
    {
        var existing = await _context.ProgressEntries.Where(pe => pe.LinkedGoal.UserId == UserId && pe.Id == id).FirstOrDefaultAsync();
        if (existing == null)
        {
            return NotFound();
        }

        existing.LocalDate = progressentry.LocalDate;
        existing.ValueChange = progressentry.ValueChange;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProgressEntryExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/progressentries
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<ProgressEntry>> PostProgressEntry(CreateProgressEntryRequest progressentry, int goalId)
    {
        var goal = await _context.Goals.Where(g => g.UserId == UserId && g.Id == goalId).FirstOrDefaultAsync();
        if (goal == null)
        {
            return NotFound();
        }
        var entry = new ProgressEntry
        {
            LocalDate = progressentry.LocalDate,
            ValueChange = progressentry.ValueChange,
            LinkedGoal = goal
        };

        _context.ProgressEntries.Add(entry);
        await _context.SaveChangesAsync();

        var response = new ProgressEntryResponse(entry.Id, goal.Id, entry.LocalDate, entry.ValueChange);

        return CreatedAtAction("GetProgressEntry", new { id = entry.Id }, response);
    }

    // DELETE: api/progressentries/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProgressEntry(int? id)
    {
        var progressentry = await _context.ProgressEntries.Where(pe => pe.LinkedGoal.UserId == UserId && pe.Id == id).FirstOrDefaultAsync();
        if (progressentry == null)
        {
            return NotFound();
        }

        _context.ProgressEntries.Remove(progressentry);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ProgressEntryExists(int? id)
    {
        return _context.ProgressEntries.Any(e => e.Id == id);
    }
}
