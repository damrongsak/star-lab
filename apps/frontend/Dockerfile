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
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY apps/frontend ./apps/frontend
COPY packages/shared ./packages/shared

# Build the frontend application
RUN pnpm --filter starlab-frontend build

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
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install only production dependencies
# RUN pnpm install --frozen-lockfile --prod
RUN pnpm install --frozen-lockfile

# Copy built application from build stage
COPY --from=build /app/apps/frontend/.next ./apps/frontend/.next

# Copy static files
COPY --from=build /app/apps/frontend/public ./apps/frontend/public

# Copy shared package
COPY --from=build /app/packages/shared ./packages/shared

# Copy Next.js configuration
COPY apps/frontend/next.config.* ./apps/frontend/

# Expose the application port
EXPOSE 3000

# Set working directory to frontend app
WORKDIR /app/apps/frontend

# Start the application
CMD ["pnpm", "start"]
