using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProgressTracker.Server.Models;
using ProgressTracker.Server.Data;

[Route("api/[controller]")]
[ApiController]
public class ProgressEntriesController : ControllerBase
{
    private readonly ProgressTrackerContext _context;
    public ProgressEntriesController(ProgressTrackerContext context)
    {
        _context = context;
    }

    // GET: api/ProgressEntry
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProgressEntry>>> GetProgressEntry()
    {
        return await _context.ProgressEntries.ToListAsync();
    }

    // GET: api/ProgressEntry/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProgressEntry>> GetProgressEntry(int id)
    {
        var progressentry = await _context.ProgressEntries.FindAsync(id);

        if (progressentry == null)
        {
            return NotFound();
        }

        return progressentry;
    }

    // PUT: api/ProgressEntry/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutProgressEntry(int? id, ProgressEntry progressentry)
    {
        if (id != progressentry.Id)
        {
            return BadRequest();
        }

        _context.Entry(progressentry).State = EntityState.Modified;

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
    public async Task<ActionResult<ProgressEntry>> PostProgressEntry(ProgressEntry progressentry)
    {
        _context.ProgressEntries.Add(progressentry);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetProgressEntry", new { id = progressentry.Id }, progressentry);
    }

    // DELETE: api/ProgressEntry/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProgressEntry(int? id)
    {
        var progressentry = await _context.ProgressEntries.FindAsync(id);
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
