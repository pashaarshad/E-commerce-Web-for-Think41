#!/bin/bash

echo "Starting Think41 E-Commerce Application..."
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting server on http://localhost:3000"
echo "You can view the website at: http://localhost:3000"
echo "Or open index.html directly in your browser"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
node server.js
