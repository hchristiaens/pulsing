# -------- Build frontend --------
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# -------- Backend runtime --------
FROM node:20-slim
WORKDIR /app

# Backend deps
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Backend source
COPY backend ./backend

# Frontend build output served by backend
COPY --from=frontend-build /app/frontend/dist ./frontend

ENV PORT=8080
EXPOSE 8080

CMD ["node", "backend/server.js"]
