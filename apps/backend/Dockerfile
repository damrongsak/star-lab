# Stage 1: Build dependencies
FROM node:22-alpine AS build

# Install pnpm
RUN npm install -g pnpm

# Set the working directory to the root of the monorepo
WORKDIR /app

# Copy workspace configuration and lock file
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copy package.json files for dependency resolution
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared

# Copy Prisma directory
COPY apps/backend/prisma ./apps/backend/prisma

# Generate Prisma client
RUN pnpm --filter starlab-backend exec prisma generate

# Build the backend application
RUN pnpm --filter starlab-backend build

# Stage 2: Production image
FROM node:22-alpine AS production

# Set the working directory
WORKDIR /app

# Install pnpm for production use
RUN npm install -g pnpm

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copy package.json files
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Install only production dependencies
RUN pnpm install --frozen-lockfile

# Copy built application
COPY --from=build /app/apps/backend/dist ./apps/backend/dist

# Copy Prisma directory 
COPY --from=build /app/apps/backend/prisma ./apps/backend/prisma

# Copy shared package
COPY --from=build /app/packages/shared ./packages/shared

# Copy the generated Prisma client
COPY --from=build /app/apps/backend/node_modules/.prisma ./apps/backend/node_modules/.prisma

# Copy startup script and make it executable
COPY apps/backend/start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose the application port
EXPOSE 5001

# Start the application using the startup script
CMD ["./start.sh"]