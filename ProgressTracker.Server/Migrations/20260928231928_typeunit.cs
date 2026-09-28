using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProgressTracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class typeunit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Goals",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Unit",
                table: "Goals",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Goals");

            migrationBuilder.DropColumn(
                name: "Unit",
                table: "Goals");
        }
    }
}
