#!/bin/bash

echo "🔄 Restarting Backend Server..."

# Find and kill existing server processes
echo "Stopping existing server..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No server running on port 3000"
pkill -f "nodemon.*server.js" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true

sleep 2

# Start the server
echo "Starting server..."
cd "$(dirname "$0")/server"
npm run dev > server.log 2>&1 &

echo "✅ Server should be starting..."
echo "📋 Check server.log for output"
echo ""
echo "Waiting 3 seconds..."
sleep 3

# Test if server is running
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Server is running successfully!"
    echo "✅ Health check passed!"
else
    echo "❌ Server failed to start. Check server.log"
    cat server.log
fi

