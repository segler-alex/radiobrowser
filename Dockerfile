FROM node:alpine
 
ADD . /root
WORKDIR /root
RUN apk update
RUN apk add git
RUN npm config set unsafe-perm true
RUN npm install -g bower gulp
RUN bower install --allow-root
RUN npm install gulp gulp-connect http-proxy-middleware
 
EXPOSE 4200
 
CMD gulp
