# Use the official .NET 8 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR/src

# Copy csproj and restore dependencies
COPY ["ReactAppREST.Server.csproj", "."]
RUN dotnet restore "./ReactAppREST.Server.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/."
RUN dotnet build "./ReactAppREST.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "./ReactAppREST.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

#Use the official ASP.NET runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port 80 and 443
    EXPOSE 80
    EXPOSE 443
    
    # Set the entrypoint to run the app
    ENTRYPOINT ["dotnet", "ReactAppREST.Server.dll"]