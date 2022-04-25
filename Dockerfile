FROM node:14-alpine as base

FROM base as back
EXPOSE 3001
WORKDIR /app/backend
COPY ./back-end/package*.json ./
RUN npm install
COPY ./back-end .
ENTRYPOINT ["npm", "start"]

FROM base as front
EXPOSE 3000
WORKDIR /app/frontend
COPY ./front-end/package*.json ./
RUN npm install
COPY ./front-end .
ENTRYPOINT ["npm", "start"]
