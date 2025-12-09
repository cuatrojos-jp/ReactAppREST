using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using ReactAppREST.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure the app to trust headers from a reverse proxy like Render
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    // Clear known networks and proxies, as we're running behind Render's proxy
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// Add DbContext
builder.Services.AddDbContext<SemestrefrontContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Define and add the CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercelApp",
        policy =>
        {
            policy.WithOrigins("https://reactapprest-client-fs21qhhs6-juan-acostas-projects-6a1ced6a.vercel.app", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    options.AddPolicy("AllowAllOrigins",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// 2. Build the App
var app = builder.Build();

// 3. Configure the HTTP request pipeline (Middleware Order is Important)
app.UseForwardedHeaders();

// In production, Swagger should be disabled.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// REMOVED: UseHttpsRedirection is not needed behind Render's proxy
// app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

// UseRouting is implicitly called here in .NET 8

// CORS must be placed after UseRouting and before UseAuthorization
app.UseCors("AllowVercelApp");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

// 4. Run the App
app.Run();
