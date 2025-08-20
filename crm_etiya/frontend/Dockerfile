# Multi-stage build for React Vite app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first (for dependency caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add non-root user for security
RUN adduser -D -s /bin/sh www-data
RUN chown -R www-data:www-data /usr/share/nginx/html
RUN chown -R www-data:www-data /var/cache/nginx

# Expose port
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

