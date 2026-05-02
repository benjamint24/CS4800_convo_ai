FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY src ./src
COPY index.js prisma.config.ts ./

EXPOSE 5050

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run dev"]