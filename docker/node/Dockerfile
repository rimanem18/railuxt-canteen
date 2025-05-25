FROM node:22.15

WORKDIR /home/node/app

COPY ./frontend/package*.json ./
RUN npm install

COPY ./frontend .

EXPOSE 3000

USER node
