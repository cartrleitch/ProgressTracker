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

        try
        {
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

        _context.Goals.Add(goal);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetGoal", new { id = goal.Id }, goal);
    }

    // DELETE: api/Goal/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGoal(int? id)
    {
        var goal = await _context.Goals.Where(g => g.UserId == UserId && g.Id == id).FirstOrDefaultAsync();
        if (goal == null)
        {
            return NotFound();
        }

        _context.Goals.Remove(goal);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
