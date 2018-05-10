FROM node:alpine
 
ADD . /root

WORKDIR /root

RUN apk update && \
    apk add git && \
    yarn global add gulp && \
    yarn

EXPOSE 4200
 
CMD gulp
