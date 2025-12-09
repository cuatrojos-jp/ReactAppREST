using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using ReactAppREST.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddDbContext<SemestrefrontContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercelApp",
        policy =>
        {
            policy.WithOrigins(
                    "https://ashy-forest-01a62a11e.3.azurestaticapps.net",
                    "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseForwardedHeaders();

// Enable Swagger for publish as well.
// Option A: always enable
app.UseSwagger();
app.UseSwaggerUI();

// Option B: conditionally enable via env var
// if (builder.Configuration.GetValue<bool>("EnableSwagger")) {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AllowVercelApp");
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
