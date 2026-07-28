using Microsoft.EntityFrameworkCore;
using ProgressTracker.Server.Models;

namespace ProgressTracker.Server.Data
{
    public class ProgressTrackerContext : DbContext
    {

        public ProgressTrackerContext(DbContextOptions<ProgressTrackerContext> options) : base(options)
        {
        }
        public DbSet<Models.Goal> Goals => Set<Goal>();
        public DbSet<Models.ProgressEntry> ProgressEntries => Set<ProgressEntry>();
    }
}
