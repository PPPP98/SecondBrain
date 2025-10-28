#!/usr/bin/env sh

# Load NVM environment
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi

# Fallback: Add common Node.js paths
export PATH="$NVM_DIR/versions/node/v22.21.0/bin:$PATH"
export PATH="/usr/local/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"

# Enable debug mode (optional)
# set -x
