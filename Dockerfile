FROM node:20.5.1-bookworm-slim as build
#ENV NODE_ENV production
WORKDIR /app

COPY package.json /app
RUN yarn install --frozen-lockfile
COPY . . 
RUN yarn build



FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./default.conf /etc/nginx/conf.d

## add permissions
RUN chown -R nginx:nginx ./ && chmod -R 755 ./ && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

## switch to non-root user
USER nginx

ENTRYPOINT ["nginx", "-g", "daemon off;"]
