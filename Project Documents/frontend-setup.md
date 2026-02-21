📄 Frontend Setup Guide
ConvoAI – CS4800

--------------------------------------------------

OVERVIEW

This document explains how to initialize and run the React frontend
for ConvoAI using Vite.

The project requires:
- Node.js 20.19+ OR
- Node.js 22.12+

Team members may use either:

Option A (Recommended): Local Node using nvm
Option B (Fallback): Docker-based Node 20 environment

--------------------------------------------------

OPTION A — LOCAL NODE (RECOMMENDED)

This is the preferred method if your Node version works correctly.

1. Install Node 20 using nvm:

nvm install 20
nvm use 20

Verify:

node -v

You must see v20.19+ (or 22.12+).

2. Initialize the frontend (from project root):

rm -rf frontend
npm create vite@latest frontend

Select:
- Framework: React
- Variant: JavaScript
- Use Vite beta: No
- Install dependencies: Yes

3. Start the development server:

cd frontend
npm run dev

The server should start at:

http://localhost:5173/

--------------------------------------------------

OPTION B — DOCKER (IF NODE VERSION CONFLICTS OCCUR)

If you encounter Node version or engine errors locally, use Docker.

Prerequisite:
Docker Desktop installed and running.

--------------------------------------------------

INITIAL SETUP (First Time Only)

1. Remove any existing frontend folder:

rm -rf frontend

2. Start a clean Node 20 container WITH port mapping:

docker run --rm -it -p 5173:5173 -v "$PWD":/app -w /app node:20 bash

3. Inside the container:

npm create vite@latest frontend

Select:
- Framework: React
- Variant: JavaScript
- Use Vite beta: No
- Install dependencies: Yes

4. Start the development server inside Docker:

cd frontend
npm run dev -- --host

5. Open in your browser:

http://localhost:5173

6. When finished:

CTRL + C
exit

--------------------------------------------------

RUNNING THE FRONTEND AFTER INITIAL SETUP

Local Node (Recommended if working properly):

cd frontend
npm run dev

Then open:
http://localhost:5173

--------------------------------------------------

Docker (If Node conflicts occur):

docker run --rm -it -p 5173:5173 -v "$PWD":/app -w /app node:20 bash

Inside container:

cd frontend
npm run dev -- --host

Then open:
http://localhost:5173

--------------------------------------------------

PROJECT STRUCTURE

After setup, the project should look like:

CS4800_convo_ai/
│
├── backend/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── project documents/
├── .gitignore
├── .nvmrc

--------------------------------------------------

NOTES

- Node 20 LTS is recommended for consistency.
- The .nvmrc file ensures team-wide version alignment.
- node_modules must never be committed (handled by .gitignore).
- Docker is only required if local Node conflicts occur.
- When using Docker, always include:
  -p 5173:5173
  and
  npm run dev -- --host
  or the site will not be accessible from your browser.

--------------------------------------------------

TASK COMPLETION

Task 1.3.1 – Initialize React application with Vite

Status: Complete

Frontend initialized using Vite with support for both local Node
and Docker-based development environments.
