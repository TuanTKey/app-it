# Build stage
FROM debian:bullseye as builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Flutter
RUN curl -L https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.16.0-stable.tar.xz | tar -C /opt -xJ
ENV PATH="$PATH:/opt/flutter/bin"

# Set up Flutter
RUN flutter config --no-analytics
RUN flutter doctor

WORKDIR /app

# Copy source code (toàn bộ project)
COPY . .

# Get dependencies
RUN flutter pub get

# Build web version
RUN flutter build web --release --web-renderer html

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/build/web /usr/share/nginx/html

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]