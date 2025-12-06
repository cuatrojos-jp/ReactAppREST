# Use the official .NET 8 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# The .csproj file is at the root of the build context, so we copy it directly.
COPY ["ReactAppREST.Server.csproj", "."]
RUN dotnet restore "./ReactAppREST.Server.csproj"

# Copy the rest of the source code from the project folder
COPY . .
WORKDIR "/src/."
RUN dotnet build "./ReactAppREST.Server.csproj" -c Release -o /app/build

# Publish the project
FROM build AS publish
RUN dotnet publish "./ReactAppREST.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official ASP.NET runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Render provides the port via the PORT environment variable.
EXPOSE 80

# Set the entrypoint to run the app
ENTRYPOINT ["dotnet", "ReactAppREST.Server.dll"]