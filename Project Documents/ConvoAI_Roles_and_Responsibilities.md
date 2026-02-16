ConvoAI Project Roles & Responsibilities

Based on the task list provided in the Kanban board (Sprints 1-3), the project workload has been divided into four key roles.

1. Frontend Engineer

Focus: User Interface, Client-Side Logic, and Visual Design.
Primary Tech Stack: React, Vite, CSS, React Router.

Responsibilities:

Initialization: Setting up the React application using Vite and establishing the folder structure (Task 1.3.1).

Styling: Implementing the basic CSS architecture and ensuring responsive design for mobile devices (Tasks 1.3.2, 3.1.6, 3.2.3).

Navigation: Configuring React Router and creating layout components (Tasks 1.4.1, 1.4.2).

Authentication UI: Building the Registration and Login forms and managing client-side auth state (Tasks 2.3.1 - 2.3.4).

Chat Interface: Designing and building the core chat UI, including message bubbles, input fields, and auto-scroll functionality (Tasks 3.1.1 - 3.1.4).

Integration: Connecting the frontend UI to the Backend API and AI endpoints (Task 3.1.5).

2. Backend & Database Engineer

Focus: Server-side Logic, API Architecture, and Data Management.
Primary Tech Stack: Node.js, Express, PostgreSQL, Prisma ORM, JWT.

Responsibilities:

Server Setup: Initializing the Node.js/Express project and configuring the PostgreSQL database locally (Tasks 1.3.3, 1.3.4).

Database Schema: Configuring Prisma ORM, designing the Users table schema, and running migrations (Tasks 1.3.5, 2.1.1, 2.1.2).

Authentication API: Implementing secure endpoints for registration (bcrypt) and login (JWT generation), and creating verification middleware (Tasks 2.2.1 - 2.2.4).

Conversation API: Creating the endpoints responsible for sending and receiving messages between the client and the AI service (Task 2.4.5).

Deployment: Setting up the backend hosting on Railway/Render and running production migrations (Tasks 3.3.2, 3.3.4).

3. AI & Logic Integration Specialist

Focus: LLM Integration, Prompt Engineering, and Model Testing.
Primary Tech Stack: Hugging Face API, Mistral-7B Model.

Responsibilities:

API Management: Creating Hugging Face accounts and managing API tokens (Task 2.4.1).

Model Validation: Testing the Mistral-7B model specifically for Spanish conversation quality to ensure it meets project requirements (Task 2.4.2).

Service Layer: Writing the AI service wrapper to handle API calls cleanly within the codebase (Task 2.4.3).

Prompt Engineering: Designing the specific system prompts for the "Restaurant Scenario" and generating the scenario content (Tasks 2.1.3, 2.4.4).

Flow Testing: Testing the basic AI conversation flow to ensure context is maintained (Task 2.4.6).

4. Product Lead & DevOps

Focus: Project Management, QA, Infrastructure, and Documentation.
Primary Tech Stack: Git/GitHub, Vercel, Documentation Tools.

Responsibilities:

Project Management: Conducting the kickoff, defining the schedule/milestones, and defining roles (Tasks 1.1.1 - 1.1.3).

Infrastructure & Workflow: Setting up the GitHub repository, branching strategy, and local environment templates (.env) (Tasks 1.2.1 - 1.2.4).

Quality Assurance (QA): executing end-to-end user flow tests, browser compatibility testing (Chrome, Firefox, Safari), and managing bug fixes (Tasks 3.2.1, 3.2.2, 3.2.4).

Frontend Deployment: Configuring Vercel for frontend deployment and managing production environment variables (Tasks 3.3.1, 3.3.3, 3.3.5).

Documentation & Deliverables: Writing the README, creating the user guide, gathering external feedback, and preparing the final demo slides (Tasks 3.4.1 - 3.4.4).
