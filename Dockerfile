# =======================
# BUILDER
# =======================
FROM node:20-alpine AS builder

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Install deps
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci

COPY backend ./backend

# If you want to generate Prisma client here
# RUN cd backend && npm run prisma:generate
# or: npx prisma generate

# Install frontend deps
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci

COPY frontend ./frontend

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN cd frontend && npm run build


# =======================
# FINAL STAGE
# =======================
FROM node:20-alpine
WORKDIR /app

# Repeat DB ENV
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend ./backend

COPY --from=builder /app/frontend/dist ./frontend/dist

RUN npm install -g serve concurrently

EXPOSE 3000

CMD ["concurrently", "node backend/index.js", "serve -s frontend/dist -l 3000"]
