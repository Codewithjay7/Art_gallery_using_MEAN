#!/bin/bash

echo "🔄 Restarting Backend Server..."

# Find and kill existing server processes
echo "Stopping existing server on port 3000..."
# Only free the port (do not pkill every node server.js on the machine)
if lsof -ti:3000 >/dev/null 2>&1; then
  lsof -ti:3000 | xargs kill -9
  echo "Stopped process(es) listening on port 3000."
else
  echo "No process was listening on port 3000."
fi

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

