FROM node:alpine
 
ADD . /root

WORKDIR /root

RUN apk update && \
    apk add git && \
    npm config set unsafe-perm true && \
    npm i && \
    npm install -g gulp && \
    npm install gulp gulp-connect http-proxy-middleware

EXPOSE 4200
 
CMD gulp
