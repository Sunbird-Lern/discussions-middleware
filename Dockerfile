
FROM node:22.17.1-slim

MAINTAINER anjana <anjanapb7@gmail.com>

WORKDIR /work
COPY ./ /work
EXPOSE 3002
RUN npm i
CMD npm run start
