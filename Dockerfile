
FROM node:12-slim

MAINTAINER anjana <anjanapb7@gmail.com>

WORKDIR /work
COPY ./ /work
EXPOSE 3002
RUN npm i
CMD npm run start
