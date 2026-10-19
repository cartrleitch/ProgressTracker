using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProgressTracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class ProgressEntry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "ProgressEntries");

            migrationBuilder.AlterColumn<decimal>(
                name: "ValueChange",
                table: "ProgressEntries",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<DateOnly>(
                name: "LocalDate",
                table: "ProgressEntries",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocalDate",
                table: "ProgressEntries");

            migrationBuilder.AlterColumn<int>(
                name: "ValueChange",
                table: "ProgressEntries",
                type: "integer",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "ProgressEntries",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
