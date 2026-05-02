# 🚀 ConvoAI Demo Runbook (Windows & Mac)

Follow these step-by-step instructions to get the complete ConvoAI application (Database, Backend, and Frontend) running locally.

<<<<<<< Updated upstream
## 1️⃣ Prerequisites

Make sure you have the following installed and running on your machine:
- **Docker Desktop** (Needs to be running)
- **Node.js** (v18 or v20 recommended)
=======
- Docker Desktop is installed and running
- PostgreSQL is available locally, or the app is pointed at a reachable database host
- backend/.env contains:
>>>>>>> Stashed changes

Make sure your `backend/.env` file exists and has the correct keys:
```env
PORT=5050
<<<<<<< Updated upstream
DATABASE_URL="postgresql://convoai_user:password123@localhost:5432/convoai_dev"

# Make sure you have your secrets here
JWT_SECRET="<your-secret>"
HUGGINGFACE_API_KEY="<your-hf-key>"
ELEVENLABS_API_KEY="<your-elevenlabs-key>"
```

---

## 2️⃣ Start Database (Docker)

We have a `docker-compose.yml` file that handles standing up the PostgreSQL database with the exact correct user and database names.

Open a terminal at the **root** of the project:
```bash
docker compose up -d
```

*This starts PostgreSQL in the background. You can verify it is running inside the Docker Desktop app.*

---

## 3️⃣ Start Backend Server

Open a new terminal and navigate to the `backend` folder:
```bash
cd backend
```

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Sync the Database Schema:**
   *(This tells Prisma to create the required tables in our new Postgres database)*
   ```bash
   npx prisma db push
   ```
   *Note: If you run into issues, you may also need to run `npx prisma generate` to generate the Prisma client.*

3. **Start the Server:**
   ```bash
   npm run dev
   ```
=======
DATABASE_URL=postgresql://YOUR_USERNAME@host.docker.internal:5432/convoai
JWT_SECRET=supersecret
HUGGINGFACE_API_KEY=your_real_key_here

If you are using Docker Desktop on Windows, make sure file sharing is enabled for the workspace drive.

2️⃣ Database

If PostgreSQL is already running locally, confirm it is reachable from Docker at host.docker.internal:5432.

If not, start it with your usual local setup before launching the app containers.

3️⃣ Start Everything with Docker Compose

From the project root in PowerShell:

docker compose up --build

This starts:

- PostgreSQL on port 5432
- Backend on http://localhost:5050
- Frontend on http://localhost:5173
>>>>>>> Stashed changes

You should see an output indicating:
✅ `Server running on http://localhost:5050`

<<<<<<< Updated upstream
*(Leave this terminal window running)*

---

## 4️⃣ Start Frontend Server

Open another new terminal and navigate to the `frontend` folder from the project root:
```bash
cd frontend
```

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the React/Vite Application:**
   ```bash
   npm run dev
   ```
=======
To stop everything:

docker compose down

4️⃣ Open the App
>>>>>>> Stashed changes

You should see an output with the local frontend URL, typically:
✅ `http://localhost:5173`

*(Leave this terminal window running)*

---

## 5️⃣ Live Demo Flow

Now that all three pieces (DB, Backend, Frontend) are running, you can walk through the demo flow!

### Step A: Register
1. Open your browser to `http://localhost:5173/register`
2. Create an account:
   - Email: `demo@test.com`
   - Password: `password123`

### Step B: Login
1. It should automatically log you in, or go to the Login page.
2. Login with the credentials you just created.

### Step C: Test the AI Voice Chat
1. Navigate to the chat interface.
2. Type or speak a prompt in Spanish (e.g., "Hola, quiero pedir comida.").
3. The AI should respond back with a generated response in Spanish, complete with the ElevenLabs generated audio!

---

## 🛑 How to Stop Everything

<<<<<<< Updated upstream
When you are done with the demo:
1. **Frontend:** Press `Ctrl + C` in the frontend terminal.
2. **Backend:** Press `Ctrl + C` in the backend terminal.
3. **Database:** At the project root terminal, run: 
   ```bash
   docker compose down
   ```
   *(This stops and safely removes the database container)*
=======
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

10️⃣ Quick Docker Check

If Docker is not recognized, install Docker Desktop from https://www.docker.com/products/docker-desktop/ and reopen the terminal.

You can verify the setup with:

docker --version
docker ps
>>>>>>> Stashed changes
