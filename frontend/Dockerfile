# Build stage
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --configuration=production

# Serve stage
FROM nginx:alpine
# Copy the built Angular app to Nginx's web root
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Replace default Nginx configuration to support Angular HTML5 routing and port 4200
RUN echo 'server { \
    listen 4200; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
