FROM centos:latest
RUN yum -y install nodejs
RUN npm install mongoose
RUN npm install aws-sdk
RUN npm install twit
RUN npm install dotenv
RUN npm install forever -g
RUN npm install custom-env
RUN mkdir /twit-codes
RUN mkdir /data_log
COPY ./Twit-codes /twit-codes
WORKDIR /twit-codes
RUN node aws.js
CMD [ "forever", "start" ,"twit-stream.js" ]