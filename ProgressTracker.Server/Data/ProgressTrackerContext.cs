using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProgressTracker.Server.Models;

namespace ProgressTracker.Server.Data
{
    public class ProgressTrackerContext : IdentityDbContext<ApplicationUser>
    {

        public ProgressTrackerContext(DbContextOptions<ProgressTrackerContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Models.Goal> Goals => Set<Goal>();
        public DbSet<Models.ProgressEntry> ProgressEntries => Set<ProgressEntry>();

    }
}
