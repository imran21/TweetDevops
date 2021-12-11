FROM node:alpine
RUN mkdir /app
RUN mkdir /app/data_log
COPY ./apps /app
WORKDIR /app
CMD [ "node", "twit-stream.js" ]
