#!/bin/bash
set -xe

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
    nvm install 20
    if ! command -v node &> /dev/null; then
        echo "node install failed"
        exit 255
    else
        echo "Node.js version 20 installed successfully."
    fi
else
    echo "Node.js is already installed."
fi

# Copy client code from S3 bucket to local client folder
#need to change because this may cause issues if filenames change or files are deleted
#should delete folder in s3 before copying in github action
aws s3 cp s3://codedeploystack-webappdeploymentbucket-cw2pxs7iavlx/client /usr/local/client --recursive
# cd /usr/local/server
aws s3 cp s3://codedeploystack-webappdeploymentbucket-cw2pxs7iavlx/server /usr/local/server --recursive
aws s3 cp s3://codedeploystack-webappdeploymentbucket-cw2pxs7iavlx/.env /usr/local/server 

# Ensure the ownership permissions are correct.
# chown -R tomcat:tomcat /usr/local/tomcat9/webapps