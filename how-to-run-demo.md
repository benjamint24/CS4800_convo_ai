# 🚀 ConvoAI Demo Runbook (Windows & Mac)

Follow these step-by-step instructions to get the complete ConvoAI application (Database, Backend, and Frontend) running locally.

## 1️⃣ Prerequisites

Make sure you have the following installed and running on your machine:
- **Docker Desktop** (Needs to be running)
- **Node.js** (v18 or v20 recommended)

Make sure your `backend/.env` file exists and has the correct keys:
```env
PORT=5050
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

You should see an output indicating:
✅ `Server running on http://localhost:5050`

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

When you are done with the demo:
1. **Frontend:** Press `Ctrl + C` in the frontend terminal.
2. **Backend:** Press `Ctrl + C` in the backend terminal.
3. **Database:** At the project root terminal, run: 
   ```bash
   docker compose down
   ```
   *(This stops and safely removes the database container)*