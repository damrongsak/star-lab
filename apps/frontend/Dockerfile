FROM node:22-alpine AS build-env
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:22-alpine
COPY package*.json ./
COPY --from=build-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app

EXPOSE 3001

CMD ["npm", "run", "start"]
