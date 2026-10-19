using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProgressTracker.Server.Models;
using ProgressTracker.Server.Data;
using ProgressTracker.Server.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[Authorize]
[Route("api/[controller]")]
[ApiController]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public class GoalsController : ControllerBase
{
    private readonly ProgressTrackerContext _context;
    public GoalsController(ProgressTrackerContext context)
    {
        _context = context;
    }

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    // GET: api/Goal
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Goal>>> GetGoal()
    {
        var goals = await _context.Goals.Where(g => g.UserId == UserId).ToListAsync();
        var nowUtc = DateTime.UtcNow;
        foreach (var goal in goals)
        {
            GoalResetService.ResetIfPeriodElapsed(goal, nowUtc);
        }
        await _context.SaveChangesAsync();
        return goals;
    }

    // GET: api/Goal/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Goal>> GetGoal(int id)
    {
        var goal = await _context.Goals.Where(g => g.UserId == UserId && g.Id == id).FirstOrDefaultAsync();

        if (goal == null)
        {
            return NotFound();
        }

        var nowUtc = DateTime.UtcNow;
        GoalResetService.ResetIfPeriodElapsed(goal, nowUtc);
        await _context.SaveChangesAsync();

        return goal;
    }

    // PUT: api/Goal/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutGoal(int? id, Goal goal)
    {
        if (id != goal.Id)
        {
            return BadRequest();
        }

        var existingGoal = await _context.Goals.Where(g => g.UserId == UserId && g.Id == id).FirstOrDefaultAsync();
        
        if (existingGoal == null)
        {
            return NotFound();
        }

        existingGoal.Name = goal.Name;
        existingGoal.TargetValue = goal.TargetValue;
        existingGoal.CurrentValue = goal.CurrentValue;
        existingGoal.Period = goal.Period;
        existingGoal.Type = goal.Type;
        existingGoal.Unit = goal.Unit;
        existingGoal.UpdatedAt = DateTime.UtcNow;
        existingGoal.ResetDate = goal.ResetDate;
        existingGoal.TimeZoneId = goal.TimeZoneId;

        try
        {
            Console.WriteLine($"<----- Updating Goal - UserId: {existingGoal.UserId}, Name: {existingGoal.Name}, CreatedAt: {existingGoal.CreatedAt}, UpdatedAt: {existingGoal.UpdatedAt}, Period: {existingGoal.Period}, Type: {existingGoal.Type}, Unit: {existingGoal.Unit}, ResetDate: {existingGoal.ResetDate}");

            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Goals.AnyAsync(g => g.UserId == UserId && g.Id == id))
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

    // POST: api/Goal
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Goal>> PostGoal(Goal goal)
    {   
        goal.UserId = UserId;
        goal.CreatedAt = DateTime.UtcNow;
        goal.UpdatedAt = DateTime.UtcNow;
        goal.LastReset = DateTime.UtcNow;

        Console.WriteLine($"<----- Creating Goal - UserId: {goal.UserId}, Name: {goal.Name}, CreatedAt: {goal.CreatedAt}, UpdatedAt: {goal.UpdatedAt}, Period: {goal.Period}, Type: {goal.Type}, Unit: {goal.Unit}, ResetDate: {goal.ResetDate}");

        _context.Goals.Add(goal);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetGoal", new { id = goal.Id }, goal);
    }

    // DELETE: api/Goal/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGoal(int? id)
    {
        var goal = await _context.Goals.Where(g => g.UserId == UserId && g.Id == id).FirstOrDefaultAsync();
        var progressEntries = await _context.ProgressEntries.Where(pe => pe.LinkedGoal.Id == id).ToListAsync();
        if (goal == null)
        {
            return NotFound();
        }

        _context.Goals.Remove(goal);
        _context.ProgressEntries.RemoveRange(progressEntries);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
