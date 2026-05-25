# -------- Build frontend --------
FROM node:20 AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build


# -------- Backend runtime --------
FROM node:20-slim

WORKDIR /app

# install backend deps
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# copy backend source
COPY backend ./backend

# copy frontend build output
COPY --from=frontend-build /app/frontend/dist ./frontend

# install tiny static server dependency (optional but clean)
RUN npm install express

ENV PORT=8080

EXPOSE 8080

# run backend (which also serves frontend)
CMD ["node", "backend/server.js"]
