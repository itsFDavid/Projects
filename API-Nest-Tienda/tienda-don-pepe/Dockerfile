FROM node:22-alpine3.20 AS builder

WORKDIR /app

# No hace falta instalar yarn, ya está en la imagen base

# Copiar archivos de dependencias
COPY package.json yarn.lock ./

# Instalar dependencias con yarn
RUN yarn install

# Copiar todo el código
COPY . .

# Construir la app
RUN yarn build

# Etapa de producción
FROM node:22-alpine3.20 AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]
