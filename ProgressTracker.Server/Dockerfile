# syntax=docker/dockerfile:1

# ---- Build client ----
FROM node:22-alpine AS client-build
WORKDIR /progresstracker.client
COPY progresstracker.client/package*.json ./
RUN npm ci
COPY progresstracker.client/ ./
RUN npm run build

# ---- Build server ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS server-build
WORKDIR .
COPY ProgressTracker.Server/ProgressTracker.Server.csproj ProgressTracker.Server/
RUN dotnet restore ProgressTracker.Server/ProgressTracker.Server.csproj
COPY ProgressTracker.Server/ ProgressTracker.Server/
WORKDIR /ProgressTracker.Server
RUN dotnet publish -c Release -o /app/publish --no-restore /p:UseSpaProxy=false

# ---- Final runtime image ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=server-build /app/publish .
COPY --from=client-build /progresstracker.client/dist ./wwwroot

EXPOSE 8080

ENTRYPOINT ["dotnet", "ProgressTracker.Server.dll"]