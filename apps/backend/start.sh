#!/bin/sh

# Set up the module resolution for Prisma client
export NODE_PATH=/app/apps/backend/node_modules:/app/node_modules

# Create symlink for the Prisma client if it doesn't exist
# PRISMA_CLIENT_DIR=$(find /app/node_modules/.pnpm -name "@prisma" -type d | grep "client" | head -1)
# if [ -n "$PRISMA_CLIENT_DIR" ]; then
#     PRISMA_CLIENT_BASE=$(echo "$PRISMA_CLIENT_DIR" | sed 's|/@prisma$||')
#     if [ -d "$PRISMA_CLIENT_BASE/node_modules/@prisma/client" ] && [ ! -d "$PRISMA_CLIENT_BASE/node_modules/@prisma/client/.prisma" ]; then
#         ln -sf /app/apps/backend/node_modules/.prisma "$PRISMA_CLIENT_BASE/node_modules/@prisma/client/.prisma"
#     fi
# fi

# Start the application
cd /app/apps/backend
exec node dist/server.js
