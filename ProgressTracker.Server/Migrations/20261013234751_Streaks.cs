using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProgressTracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class Streaks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Streak",
                table: "Goals",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Streak",
                table: "Goals");
        }
    }
}
