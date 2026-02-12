#!/bin/bash

# Deployment script for Maithilvivah Backend
# This script will be run on the server

set -e

echo "🚀 Starting Maithilvivah Backend Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo "✅ Docker and Docker Compose are installed"

# Stop existing containers if any
if [ "$(docker ps -q -f name=maithilvivah)" ]; then
    echo "🛑 Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down
fi

# Build and start containers
echo "🏗️  Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check container status
echo "📊 Container Status:"
docker-compose -f docker-compose.prod.yml ps

# Show backend logs
echo "📝 Backend Logs (last 50 lines):"
docker-compose -f docker-compose.prod.yml logs --tail=50 backend

echo "✅ Deployment complete!"
echo "🌐 Backend is running at: http://82.25.104.197:5001"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker-compose -f docker-compose.prod.yml logs -f backend"
echo "  - Restart: docker-compose -f docker-compose.prod.yml restart backend"
echo "  - Stop: docker-compose -f docker-compose.prod.yml down"
echo "  - View all containers: docker-compose -f docker-compose.prod.yml ps"
