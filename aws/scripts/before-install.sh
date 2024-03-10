#!/bin/bash
set -xe

# Delete the old  directory as needed.
if [ -d /usr/local/codedeployresources ]; then
    rm -rf /usr/local/codedeployresources/
fi

mkdir -vp /usr/local/codedeployresources

if [ -d /usr/local/client ]; then
    rm -rf /usr/local/client/
fi

mkdir -vp /usr/local/client

if [ -d /usr/local/server ]; then
    rm -rf /usr/local/server/
fi

mkdir -vp /usr/local/server