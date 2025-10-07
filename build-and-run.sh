#!/bin/bash

echo "🚀 Building and starting Programming Exam App..."

# Build images
echo "📦 Building Docker images..."
docker-compose build

# Start services
echo "🐳 Starting containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check services status
echo "🔍 Checking services status..."
docker-compose ps

echo "✅ Deployment completed!"
echo ""
echo "🌐 Frontend: http://localhost"
echo "🔗 Backend API: http://localhost:3001/api/health"
echo "📊 MongoDB: localhost:27017"
echo ""
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"