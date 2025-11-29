#!/bin/bash

echo "🌿 Starting Greengate Development Environment"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "✅ Dependencies installed"
echo ""
echo "🚀 Starting services..."
echo ""

# Find available port for backend (default 3001)
BACKEND_PORT=3001
echo "Backend will run on: http://localhost:${BACKEND_PORT}"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start backend and frontend concurrently with explicit PORT
(trap 'kill 0' SIGINT; PORT=${BACKEND_PORT} npm run dev & cd frontend && npm run dev)
