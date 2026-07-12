using Microsoft.EntityFrameworkCore;
using SWD392_LMS.Application.Interfaces;
using SWD392_LMS.Application.Services;
using SWD392_LMS.Infrastructure;
using SWD392_LMS.Infrastructure.Data;
using SWD392_LMS.Presentation.Components;

var builder = WebApplication.CreateBuilder(args);

// Add Infrastructure layer (DbContext, Identity)
builder.Services.AddInfrastructure(builder.Configuration);

// Add Application services
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<IQuizService, QuizService>();
builder.Services.AddScoped<IUserService, UserService>();

// Add Blazor
builder.Services.AddRazorPages();
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents()
    .AddHubOptions(options =>
    {
        options.MaximumReceiveMessageSize = 512 * 1024; // 512 KB
    });

// Add authentication
builder.Services.AddCascadingAuthenticationState();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorPages();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

// Seed database
using (var scope = app.Services.CreateScope())
{
    try
    {
        await SeedData.InitializeAsync(scope.ServiceProvider);
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();
