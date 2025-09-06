#!/bin/bash

echo "🚀 Starting DeepResearchAgent Web Interface..."
echo ""
echo "This script will start both the API server and the web app."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Activate Python virtual environment
if [[ "$VIRTUAL_ENV" != *".venv"* ]]; then
    echo "Activating Python virtual environment..."
    source .venv/bin/activate
fi

# Start API server in background
echo -e "${BLUE}Starting API server...${NC}"
python simple_api_server.py &
API_PID=$!
echo "API Server PID: $API_PID"

# Wait for API to be ready
sleep 3

# Start web app
echo -e "${BLUE}Starting web application...${NC}"
cd dra-web-app
npm run web &
WEB_PID=$!
echo "Web App PID: $WEB_PID"

echo ""
echo -e "${GREEN}✅ DeepResearchAgent Web Interface is starting!${NC}"
echo ""
echo "📍 API Server: http://localhost:8000"
echo "📍 API Docs: http://localhost:8000/docs"
echo "🌐 Web App: http://localhost:8081"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Function to handle cleanup
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $API_PID 2>/dev/null
    kill $WEB_PID 2>/dev/null
    echo "Services stopped."
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup INT

# Wait for both processes
wait $API_PID $WEB_PID
