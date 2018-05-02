FROM node:8.11.1-alpine
 
ADD . /root
WORKDIR /root
RUN npm install -g bower gulp
RUN bower install --allow-root
RUN npm install gulp gulp-connect http-proxy-middleware
 
EXPOSE 4200
 
CMD gulp
