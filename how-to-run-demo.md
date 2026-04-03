🚀 ConvoAI Sprint 2 Demo Runbook
1️⃣ Prerequisites (Before Class)

Make sure:

Docker Desktop is running

PostgreSQL is running locally

backend/.env contains:

PORT=5050
DATABASE_URL=postgresql://YOUR_USERNAME@host.docker.internal:5432/convoai
JWT_SECRET=supersecret
HUGGINGFACE_API_KEY=your_real_key_here
2️⃣ Start PostgreSQL (Local)

In terminal:

brew services start postgresql

Verify:

psql -d convoai
\q

If that works → database is ready.

3️⃣ Start Backend (Docker)

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

You should see:

Server running on http://localhost:5050

Leave this terminal running.

4️⃣ Start Frontend (Docker)

Open a new terminal window.

From project root:

docker run --rm -it \
  -p 5173:5173 \
  -v "$PWD":/app \
  -w /app/frontend \
  node:20 bash

Inside container:

npm install
npm run dev -- --host

Open browser:

http://localhost:5173
5️⃣ Live Demo Flow (In Browser)
A. Register (optional if user exists)

Go to:

http://localhost:5173/register

Create new account:

Email: demo@test.com
Password: 123456
B. Login

Go to login page.

Use:

Email: demo@test.com
Password: 123456

You should be redirected.

C. Verify JWT Stored

Open DevTools:

Application → Local Storage

Confirm:

convoai_token = eyJhbGciOiJIUzI1NiIsInR5cCI6...
D. Go to Chat

Navigate to:

http://localhost:5173/chat

Type:

Hola, quiero pedir comida.

Click Send.

Expected result:

Spanish AI response appears.

6️⃣ Security Demo (Optional but Strong)
Show Protected Route

Open DevTools

Delete convoai_token

Refresh /chat

Expected:

Redirect to login.

7️⃣ Network Tab Demo (Impressive)

Open DevTools → Network

Send message again.

Click POST /api/chat

Show:

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

Explain:

JWT verified in middleware

Request forwarded to AI service wrapper

Router API used

Response normalized and returned

8️⃣ Optional Backend Verification (If Needed)

In a new terminal:

curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","password":"123456"}'

Copy token.

Then:

curl -X POST http://localhost:5050/api/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hola, quiero pedir comida."}'

Shows backend works independently of UI.

9️⃣ How to Stop Everything

Stop frontend container:

Ctrl + C
exit

Stop backend container:

Ctrl + C
exit