# CS4800_convo_ai

ConvoAI is an AI-powered language learning web application designed to help Spanish learners practice real-world conversations in a judgment-free environment.

## Project Build & Deployment Instructions

### Prerequisites

- Node.js 20 LTS
- npm
- PostgreSQL
- Optional: Docker Desktop for container-based setup

### Local Build and Run

#### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs with `nodemon` from `src/server.js`.

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend Vite app starts on `http://localhost:5173/`.

#### Frontend Production Build

```bash
cd frontend
npm run build
```

This creates the optimized production bundle for the React frontend.

### Docker Compose Run

The repository includes a `docker-compose.yml` file that starts the full stack:

- PostgreSQL database on port `5432`
- Backend API on port `5050`
- Frontend on port `5173`

To start the stack:

```bash
docker compose up --build
```

This is the recommended way to run the app when you want the frontend, backend, and database together in one environment.

### Deployment Notes

- Frontend deployment target: Vercel or any static host that supports Vite builds
- Backend deployment target: Railway or Render
- Database deployment target: hosted PostgreSQL instance
- Make sure production environment variables are set before deployment, especially `DATABASE_URL`, `JWT_SECRET`, and any AI or voice API keys

### Environment Notes

- Keep `.env` files out of version control
- Use the provided local setup documents when configuring Node.js and PostgreSQL for development
- Run database migrations before starting the backend against a fresh database

## Git Branching Strategy

- `main`: stable, production-ready code  
- `develop`: active development branch  
- `feature/*`: task-specific branches  

## Workflow

1. Create feature branches from `develop`
2. Open pull requests into `develop`
3. Merge `develop` into `main` only at milestones
4. Direct pushes to `main` are discouraged

## Workflow Example

### 1. Starting a New Task

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<task-name>
```

Example:

```bash
git checkout -b feature/login-backend
```

### 2. Working on the Feature

```bash
git add .
git commit -m "Add login endpoint"
git push -u origin feature/login-backend
```

### 3. Feature → Develop (Pull Request)

- Open a pull request  
  - From: `feature/login-backend`  
  - Into: `develop`  
- Teammate reviews  
- Merge when approved  

### 4. Develop → Main (Release Pull Request)

This happens less often:
- End of a sprint
- Before deployment
- Before a demo
