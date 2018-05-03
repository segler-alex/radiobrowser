FROM node:alpine
 
ADD . /root

WORKDIR /root

RUN apk update && \
    apk add git && \
    npm config set unsafe-perm true && \
    npm install -g bower gulp && \
    bower install --allow-root && \
    npm install gulp gulp-connect http-proxy-middleware

EXPOSE 4200
 
CMD gulp
