FROM node:14.18.2-alpine
RUN mkdir /app
RUN mkdir /app/data_log
COPY ./apps /app
WORKDIR /app
EXPOSE 3001
CMD [ "node", "twit-userprofile.js" ]
