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
        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<DateTime>().HaveConversion<UtcDateTimeConverter>();
        }

        public DbSet<Models.Goal> Goals => Set<Goal>();
        public DbSet<Models.ProgressEntry> ProgressEntries => Set<ProgressEntry>();
    }

    public class UtcDateTimeConverter : Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>
    {
        public UtcDateTimeConverter() : base(
            v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc))
        {
        }
    }
}
