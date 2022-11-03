FROM node:latest
WORKDIR /app/frontend

COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm install
COPY . ./
EXPOSE 3000