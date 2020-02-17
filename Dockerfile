FROM node:10
LABEL MAINAINER="KeisukeYamashita<19yamashita15@gmail.com>"

WORKDIR /usr/src/app
COPY package.json .
RUN yarn

COPY . .
RUN yarn build

CMD [ "yarn", "start" ]
