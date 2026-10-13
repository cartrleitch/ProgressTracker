using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ProgressTracker.Server.Data;
using Microsoft.AspNetCore.DataProtection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ProgressTrackerContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("ProgressTrackerContext")));
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<ApplicationUser>(options => 
{ 
    options.Password.RequireNonAlphanumeric = true; 
    options.Password.RequireUppercase = true; 
    options.Password.RequireLowercase = true; 
    options.Password.RequireDigit = true; 
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<ProgressTrackerContext>();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor | Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto;
    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "ProgressTracker.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.LoginPath = "/api/Identity/Account/Login";
    options.LogoutPath = "/api/Identity/Account/Logout";
    options.AccessDeniedPath = "/api/Identity/Account/AccessDenied";
    options.SlidingExpiration = true;
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

var keyPath = builder.Configuration["DataProtection:KeysPath"] 
    ?? Path.Combine(builder.Environment.ContentRootPath, ".keys");

builder.Services.AddDataProtection()
    .SetApplicationName("ProgressTracker")
    .PersistKeysToFileSystem(new DirectoryInfo(keyPath));

var app = builder.Build();

app.UseForwardedHeaders();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ProgressTrackerContext>();
    db.Database.Migrate();
}

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{

    app.UseHttpsRedirection();

}

app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("/api/auth")
    .MapIdentityApi<ApplicationUser>();
app.MapPost("/api/auth/logout", async (SignInManager<ApplicationUser> signInManager) =>
{
   await signInManager.SignOutAsync();
    return Results.Ok(new { message = "Logged out successfully" });
}).RequireAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
