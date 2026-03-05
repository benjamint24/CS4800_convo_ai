# ConvoAI Backend Setup

This backend can be run using:

1. Docker (Recommended – consistent environment)
2. Local Node (if environment is stable)

--------------------------------------------------
PREREQUISITES

- PostgreSQL installed locally (see database-setup.md)
- Node 20 LTS (for local setup)
- Docker Desktop (for Docker setup)

--------------------------------------------------
OPTION A — DOCKER (RECOMMENDED)

From project root:

docker run --rm -it \
  -p 5050:5050 \
  --env-file backend/.env \
  -v "$PWD":/app \
  -w /app/backend \
  node:20 bash

Inside container:

npm install
npx prisma generate
npm run dev

Backend runs at:
http://localhost:5050

--------------------------------------------------
OPTION B — LOCAL NODE

1. Install Node 20 LTS:

nvm install 20
nvm use 20

Verify:
node -v

2. Install dependencies:

cd backend
npm install

3. Generate Prisma client:

npx prisma generate

4. Start server:

npm run dev

Backend runs at:
http://localhost:5050

--------------------------------------------------
ENVIRONMENT VARIABLES

Create backend/.env:

PORT=5050
DATABASE_URL=postgresql://YOUR_NAME@host.docker.internal:5432/convoai
JWT_SECRET=supersecret
HUGGINGFACE_API_KEY=yourkey