# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copying package files first for better caching
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build for production
RUN npm run build

# Stage 2: Serve static files with non-root nginx (slim alpine base)
FROM nginxinc/nginx-unprivileged:1.27-alpine-slim

# Copy built artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]