using Microsoft.EntityFrameworkCore;
using ReactAppREST.Server.Models;
using ReactAppREST.Server.Controllers;

var builder = WebApplication.CreateBuilder(args);
//var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

//var allowedOrigins = new[]
//{
//    "http://localhost:3000",
//    "http://localhost:5173",
//    "https://localhost:62909",
//    "https://localhost:7231"
//};

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy(MyAllowSpecificOrigins,
//                          policy =>
//                          {
//                              policy.WithOrigins("https://localhost:62909")
//                                                  .AllowAnyHeader()
//                                                  .AllowAnyMethod()
//                                                  .AllowCredentials();
//                          });
//    options.AddPolicy("NuevaPolitica", app =>
//    {
//        app.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
//    });
//});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<SemestrefrontContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
