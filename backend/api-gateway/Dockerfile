# Use Node.js as the base image
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code (if using TypeScript)
RUN npm run build

# Use a smaller image for production
FROM node:22-slim

# Set the working directory
WORKDIR /app

# Copy the built files
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install production dependencies
RUN npm install --production

# Expose port 80
EXPOSE 80

# Start the application
CMD ["node", "dist/index.js"]