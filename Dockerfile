# Use Node.js 22 (required by TanStack Start)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_SONARQUBE_URL
ARG VITE_SONARQUBE_TOKEN
ARG VITE_SONARQUBE_ORGANIZATION
ARG VITE_USE_REAL_SONARQUBE

# Set environment variables from build args
ENV VITE_SONARQUBE_URL=${VITE_SONARQUBE_URL}
ENV VITE_SONARQUBE_TOKEN=${VITE_SONARQUBE_TOKEN}
ENV VITE_SONARQUBE_ORGANIZATION=${VITE_SONARQUBE_ORGANIZATION}
ENV VITE_USE_REAL_SONARQUBE=${VITE_USE_REAL_SONARQUBE}

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]