#!/bin/bash
set -x

# System control will return either "active" or "inactive".
# Check if port 8080 is being listened to
if sudo lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null; then
    # If a program is listening on port 8080, kill it
    sudo lsof -Pi :8080 -sTCP:LISTEN -t | xargs kill -9
    echo "Program listening on port 8080 has been killed."
else
    echo "No program is listening on port 8080."
fi

if sudo lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null; then
    # If a program is listening on port 8080, kill it
    sudo lsof -Pi :30001 -sTCP:LISTEN -t | xargs kill -9
    echo "Program listening on port 3001 has been killed."
else
    echo "No program is listening on port 3001."
fi