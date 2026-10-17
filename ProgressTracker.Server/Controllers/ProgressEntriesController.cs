using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProgressTracker.Server.Data;
using ProgressTracker.Server.Models;
using ProgressTracker.Server.Models.DTOS;
using System.Security.Claims;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ProgressEntriesController : ControllerBase
{
    private readonly ProgressTrackerContext _context;
    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public ProgressEntriesController(ProgressTrackerContext context)
    {
        _context = context;
    }

    // GET: api/ProgressEntry
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProgressEntry>>> GetProgressEntry()
    {

        return await _context.ProgressEntries.Where(pe => pe.LinkedGoal.UserId == UserId).ToListAsync();
    }

    // GET: api/ProgressEntry/5
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

    // GET: api/ProgressEntry/goal/5
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

    // PUT: api/ProgressEntry/5
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

    // POST: api/ProgressEntry
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

    // DELETE: api/ProgressEntry/5
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
