#!/bin/bash
set -xe

# Start Tomcat, the application server.
cd /usr/local/client
# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing Node.js version 20..."
    # Install nvm if not already installed
    if ! command -v nvm &> /dev/null; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
        # You might need to restart your terminal session after installing nvm
        source ~/.bashrc  # or source ~/.bash_profile or source ~/.zshrc depending on your shell
    fi
    # Install Node.js version 20 using nvm
    nvm install 16
    if ! command -v node &> /dev/null; then
        echo "node install failed"
        exit 255
    else
        echo "Node.js version 16 installed successfully."
    fi
else
    echo "Node.js is already installed."
fi
npm i
npm start 2&> a.out &

cd /usr/local/server
npm i
npm start 2&> a.out &
