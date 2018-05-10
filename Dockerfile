FROM node:alpine
 
ADD . /root

WORKDIR /root

RUN yarn global add gulp && \
    yarn

EXPOSE 4200
 
CMD gulp
