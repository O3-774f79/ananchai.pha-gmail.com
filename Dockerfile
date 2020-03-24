FROM tiangolo/node-frontend:10 as build-stage
WORKDIR /app
COPY package*.json /app/
#RUN yarn --pure-lockfile
RUN npm install
COPY ./ /app/
ARG BUILDENV
# RUN npm run $BUILDENV
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx/nginx.conf /etc/nginx/conf.d
COPY --from=build-stage /app/nginx/default.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
