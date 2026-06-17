# -------- Build app --------
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


# -------- Runtime --------
FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
