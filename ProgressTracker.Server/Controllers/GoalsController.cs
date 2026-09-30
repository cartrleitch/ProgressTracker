using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProgressTracker.Server.Models;
using ProgressTracker.Server.Data;

[Route("api/[controller]")]
[ApiController]
public class GoalsController : ControllerBase
{
    private readonly ProgressTrackerContext _context;
    public GoalsController(ProgressTrackerContext context)
    {
        _context = context;
    }

    // GET: api/Goal
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Goal>>> GetGoal()
    {
        return await _context.Goals.ToListAsync();
    }

    // GET: api/Goal/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Goal>> GetGoal(int id)
    {
        var goal = await _context.Goals.FindAsync(id);

        if (goal == null)
        {
            return NotFound();
        }

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

        var existingGoal = await _context.Goals.FindAsync(id);
        
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
            if (!GoalExists(id))
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
        var goal = await _context.Goals.FindAsync(id);
        if (goal == null)
        {
            return NotFound();
        }

        _context.Goals.Remove(goal);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool GoalExists(int? id)
    {
        return _context.Goals.Any(e => e.Id == id);
    }
}
