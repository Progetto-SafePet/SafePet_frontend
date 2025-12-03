# stage 1: build
FROM node:20-alpine AS build
WORKDIR /app

COPY safepet/package*.json .
RUN npm ci

COPY safepet .
RUN npm run build

# stage 2: run
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
