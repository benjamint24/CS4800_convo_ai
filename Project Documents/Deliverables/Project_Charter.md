# Project Charter

**ConvoAI - AI-Powered Spanish Language Learning Application**  
Updated May 3, 2026 - Version 1.0

---

## Project Name
ConvoAI

## Executive Sponsor
Hussain Zaidi

## Project Manager(s)
Benjamin Tran, Jonathan Dang, Gavin Lee

## Primary Stakeholder(s)
- CS4800 Course Instructor & Evaluation Panel
- Spanish Language Learners (Target User Base)
- Educational Institution / Course Program

---

## Project Description / Statement of Work

ConvoAI is an AI-powered web application designed to help Spanish learners practice real-world conversational skills in a judgment-free, interactive environment. The application leverages advanced language models (Mistral-7B via Hugging Face Inference API) to simulate authentic restaurant service scenarios, allowing users to engage in natural Spanish conversations with responsive AI characters. The platform provides multi-modal interaction through text chat and voice features (transcription and text-to-speech via ElevenLabs), supporting learners of various proficiency levels.

The project scope includes a fully functional MVP with user authentication, multi-language support (Spanish, English, Chinese, Japanese, Korean), responsive mobile design, and deployment to production-ready hosting platforms.

---

## Business Case / Statement of Need

**Why is this project important now?**

Traditional language learning applications often fail to provide authentic, low-pressure conversational practice. Learners face anxiety when speaking with native speakers and lack opportunities for realistic, mistake-tolerant practice scenarios. ConvoAI addresses this gap by:

1. **Reducing learner anxiety:** Users can practice in a judgment-free environment without fear of embarrassment
2. **Providing authentic scenarios:** Restaurant role-play creates real-world contexts for language practice
3. **Enabling flexible learning:** On-demand, asynchronous practice available 24/7 without scheduling constraints
4. **Supporting multiple learning styles:** Text and voice modalities accommodate different learner preferences
5. **Scaling accessibility:** AI-powered practice removes dependency on human tutors, making quality language learning more accessible

This project demonstrates modern full-stack development, AI integration, and practical application of software engineering principles within a 6-week compressed timeline.

---

## Customers

### Primary Users
- Spanish language learners (beginner to intermediate level)
- Students in educational institutions seeking supplemental conversational practice
- Self-directed learners interested in AI-powered language learning

### Customer Needs / Requirements

| Need | Requirement |
|------|-------------|
| Authentic Practice Environment | Users can engage in realistic restaurant conversation scenarios with AI |
| Low-Pressure Learning | Judgment-free interaction allows mistakes without social consequences |
| Multi-Modal Interaction | Both text and voice input/output options available |
| Progress Tracking | Users can maintain persistent chat history and language context |
| Language Flexibility | Support for multiple languages with automatic prompt adjustments |
| Accessibility | Mobile-responsive design and user-friendly interface |
| Security | User data protection through authentication and secure session management |
| Performance | Fast, responsive interactions with minimal latency |

---

## Project Definition

### Project Goals

1. **Develop a fully functional MVP** that demonstrates AI-powered conversational language learning
2. **Implement secure user authentication** with JWT-based session management
3. **Integrate Mistral-7B AI model** for natural Spanish conversation generation
4. **Create an intuitive chat interface** with message history and context management
5. **Implement voice integration** for transcription and text-to-speech functionality
6. **Deploy to production** with frontend (Vercel) and backend (Railway/Render) hosting
7. **Demonstrate software engineering best practices** including version control, testing, documentation, and code quality
8. **Deliver comprehensive project documentation** and a polished final demo

### Project Scope

**Included in Scope:**
- User registration and login with secure password handling (bcrypt encryption)
- JWT-based authentication and protected route authorization
- PostgreSQL database with Prisma ORM for data persistence
- Chat API endpoints for sending/receiving messages
- Hugging Face Inference API integration for Mistral-7B model
- Prompt engineering for restaurant waiter scenario (multiple language versions)
- Text chat interface with message bubbles and auto-scroll
- Voice transcription (speech-to-text) via ElevenLabs API
- Voice synthesis (text-to-speech) via ElevenLabs API
- Language selection and context reset functionality
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Mobile-responsive design
- Error handling and validation
- Comprehensive project documentation

**Out of Scope:**
- Stress and load testing / performance optimization for large-scale users
- Penetration testing and advanced security audit
- Formal usability study with large user samples
- Production monitoring and analytics implementation
- Advanced features (gamification, adaptive difficulty, social features)
- Localization beyond the 5 supported languages
- Video integration or advanced multimedia features

### Project Deliverables

| Deliverable | Description | Target Date |
|---|---|---|
| GitHub Repository | Version-controlled codebase with branching strategy | End Week 1 |
| Infrastructure Setup | PostgreSQL database, development environments configured | End Week 2 |
| Frontend Application | React/Vite UI with routing, forms, and protected routes | End Week 2 |
| Backend API | Node.js/Express server with authentication and API endpoints | End Week 2 |
| Authentication System | Secure registration, login, JWT middleware, session management | End Week 4 |
| AI Integration | Hugging Face API integration with prompt engineering | End Week 4 |
| Chat Interface | Fully functional chat UI with message history and context | End Week 5 |
| Voice Features | Voice transcription and text-to-speech integration | End Week 5 |
| Test Documentation | Test Plan, Test Case Specification, Test Results | End Week 6 |
| Deployment | Frontend (Vercel), Backend (Railway/Render), Production Database | End Week 6 |
| Final Documentation | README, user guide, setup guide, API documentation | End Week 6 |
| Demo Materials | Presentation slides and demo runbook | End Week 6 |

---

## Project Constraints / Risks

### Constraints (Restrictive Elements)

| Constraint | Impact | Mitigation |
|---|---|---|
| **Timeline** | 6-week compressed schedule for full-stack MVP | Prioritized feature list; clear scope definition; parallel workstream execution |
| **Team Size** | 3-person student team with limited availability | Role specialization; clear responsibility assignment; regular sync meetings |
| **Technology Stack** | Fixed choices (React, Node.js, PostgreSQL, Mistral-7B) | Early environment setup; shared documentation on tech decisions |
| **API Dependencies** | Reliance on external services (Hugging Face, ElevenLabs) | API key management; fallback prompts; error handling for API failures |
| **Mobile Responsiveness** | Must support smartphone/tablet devices | CSS architecture and Tailwind utility classes; responsive testing in Sprint 3 |
| **Browser Support** | Must work on Chrome, Firefox, Safari | Testing matrix; progressive enhancement approach |

### Risks (Potential Problems & Mitigation)

| Risk | Probability | Impact | Mitigation Strategy |
|---|---|---|---|
| AI model quality insufficient for conversational Spanish | Medium | High | Early model validation (Sprint 2); prompt engineering iteration; fallback scenarios |
| API rate limiting or service outages | Medium | Medium | API key monitoring; rate-limiting logic; graceful error messaging |
| Database schema changes causing migration issues | Low | High | Version control of migrations; testing migrations locally; clear rollback procedures |
| Authentication vulnerabilities exploited | Low | High | Use established JWT libraries; password hashing with bcrypt; HTTPS enforcement |
| Frontend/Backend integration delays | Medium | Medium | Early API contract definition; mock API endpoints; parallel development |
| Deployment platform credential loss or misconfiguration | Low | High | Environment variable documentation; secure .env templates; deployment runbook |
| Team member availability / illness | Low | High | Cross-training on critical areas; documentation of each role; knowledge sharing meetings |
| Performance issues with voice processing | Medium | Medium | Async handling of audio; loading states; optimization of AI service calls |

---

## Implementation Plan / Milestones

### Sprint 1: Foundation & Infrastructure (Weeks 1–2)
**Objective:** Establish project foundations, tooling, and basic application structure

| Milestone | Tasks | Target Date | Duration |
|---|---|---|---|
| **M1.1 - Project Kickoff** | Team roles defined; schedule communicated; GitHub access granted | End Week 1 | 3 days |
| **M1.2 - Infrastructure Ready** | GitHub repo created; branching strategy defined; .env templates prepared | End Week 1 | 3 days |
| **M1.3 - Development Environments** | Node.js, PostgreSQL, npm configured locally; Docker Compose working | End Week 1 | 4 days |
| **M1.4 - Frontend Initialized** | Vite project scaffolded; React Router configured; basic layout components | End Week 2 | 4 days |
| **M1.5 - Backend Initialized** | Express server running; Prisma ORM configured; database schema started | End Week 2 | 4 days |
| **M1 - Milestone Achieved** | All infrastructure complete; frontend and backend running locally | End Week 2 | — |

### Sprint 2: Core Features Development (Weeks 3–4)
**Objective:** Implement authentication and AI-powered conversation functionality

| Milestone | Tasks | Target Date | Duration |
|---|---|---|---|
| **M2.1 - Database Schema** | Users table finalized; Prisma migrations executed; schema documented | End Week 3 | 2 days |
| **M2.2 - Authentication Backend** | User registration endpoint; secure password hashing; JWT token generation; middleware | End Week 3 | 4 days |
| **M2.3 - Authentication Frontend** | Registration form; login form; client-side auth state; protected routes | End Week 4 | 4 days |
| **M2.4 - AI Integration** | Hugging Face API account; Mistral-7B model tested; service wrapper implemented | End Week 4 | 3 days |
| **M2.5 - Prompt Engineering** | Restaurant scenario prompts; multi-language support; prompt testing | End Week 4 | 3 days |
| **M2.6 - Chat API** | Message sending/receiving endpoints; context management; error handling | End Week 4 | 3 days |
| **M2 - Milestone Achieved** | Users can register, log in, and chat with AI in real-time | End Week 4 | — |

### Sprint 3: Polish, Testing & Deployment (Weeks 5–6)
**Objective:** Finalize user experience, test thoroughly, and deploy to production

| Milestone | Tasks | Target Date | Duration |
|---|---|---|---|
| **M3.1 - Chat UI Polish** | Message bubbles; input field; auto-scroll; typing indicators; loading states | End Week 5 | 3 days |
| **M3.2 - Voice Features** | ElevenLabs integration; transcription; text-to-speech; audio playback | End Week 5 | 4 days |
| **M3.3 - Testing & QA** | End-to-end testing; cross-browser validation; bug fixes; test documentation | End Week 5 | 4 days |
| **M3.4 - Deployment** | Vercel (frontend); Railway/Render (backend); production database; environment variables | End Week 6 | 2 days |
| **M3.5 - Documentation** | README; user guide; setup guide; API docs; demo presentation | End Week 6 | 3 days |
| **M3.6 - Demo Preparation** | Demo runbook; slide deck; final testing; dry run | End Week 6 | 2 days |
| **M3 - Milestone Achieved** | Fully deployed, tested, documented MVP ready for final demo | End Week 6 | — |

---

## Communication Plan

**What needs to be communicated? When? To whom? How?**

| Information | Frequency | Audience | Channel | Owner |
|---|---|---|---|---|
| Project Status & Blockers | Weekly (Tuesdays) | Full team + Sponsor | In-person/Video meeting | Project Managers |
| Sprint Planning & Backlog | Sprint start (Mon) | Full team | Kanban board + meeting | Project Managers |
| Individual Task Updates | Daily | Team members | Slack + stand-up notes | Each developer |
| Code Review & PR Feedback | As needed | Development team | GitHub PRs | Code reviewers |
| Risk & Issue Escalation | As discovered | Project Mgr + Sponsor | Email + meeting | Responsible party |
| Demo & Test Results | End of each sprint | Full team + Sponsor | Live demo + documentation | QA lead |
| Documentation Updates | As completed | Full team | GitHub repo + wiki | Documentation lead |
| Deployment Notifications | Upon deployment | Full team + Sponsor | Slack + email | DevOps lead |
| Final Demo | End of project (Week 6) | Course instructor, evaluation panel, stakeholders | In-person presentation | Project Managers |

**Key Communication Points:**
- Weekly sync meetings on Tuesdays at 2:00 PM (or mutually agreed time)
- Real-time collaboration via Slack for urgent issues
- GitHub Issues for bug tracking and feature requests
- GitHub Discussions or documentation for knowledge sharing
- Project schedule and timeline visible on shared Kanban board (e.g., GitHub Projects)

---

## Change Management / Issue Management

**How decisions will be made? How changes will be managed?**

### Decision-Making Process

1. **Routine Decisions** (low impact, single team member):
   - Developer can make autonomous decisions on implementation details
   - Document decision in commit message or code comments
   - Inform team at next sync meeting

2. **Feature/Scope Decisions** (medium impact):
   - Propose change to project managers
   - Discuss with relevant team members
   - Update project backlog and timeline if needed
   - Communicate to sponsor if timeline/scope affected

3. **Critical Decisions** (high impact, major timeline/scope change):
   - Escalate to Project Managers + Executive Sponsor
   - Document rationale and alternatives considered
   - Formal approval before implementation
   - Communicate to all stakeholders

### Change Management

| Change Type | Approval Required | Process | Timeline |
|---|---|---|---|
| **Bug Fix** | None (if critical) | Create issue → implement → test → merge | 1-2 days |
| **Minor Feature** | Project Manager | Discuss → estimate effort → add to backlog → implement | Current sprint |
| **Scope Addition** | Project Manager + Sponsor | Assess impact → negotiate trade-offs → update plan | Decision-dependent |
| **Timeline Adjustment** | Project Manager + Sponsor | Root cause analysis → recovery plan → communicate | 1 day |
| **Technology/Library Change** | Full team review | Propose change → document rationale → code review → approve | 2-3 days |
| **Deployment Issue** | All team members | Identify issue → rollback or fix → test → redeploy | ASAP |

### Issue Management

1. **Identification:** Issues discovered during development, testing, or demo
2. **Logging:** Create GitHub Issue with description, steps to reproduce, severity
3. **Triage:** Weekly issue review during team sync; assign to owner
4. **Resolution:** Fix → test → code review → merge
5. **Verification:** QA confirms issue resolved in deployment
6. **Documentation:** Update test results and project documentation

---

## Project Team Roles and Responsibilities

### Team Members & Roles

| Name | Primary Role | Secondary Role | Responsibilities |
|---|---|---|---|
| **Benjamin Tran** | Project Manager, Backend Engineer | Full-stack | Project planning, milestone tracking, backend API development, database management, deployment |
| **Jonathan Dang** | Project Manager, Frontend Engineer | Full-stack | Project coordination, sprint planning, frontend development, UI/UX, testing oversight |
| **[Team Member 3 - AI Specialist]** | AI Integration Specialist | QA / DevOps | Hugging Face integration, prompt engineering, model testing, voice API setup, documentation |

### Detailed Role Responsibilities

#### Project Manager (Benjamin Tran & Jonathan Dang)

**Responsibilities:**
- Conduct project kickoff and establish team norms
- Define sprint goals and backlog prioritization
- Maintain project schedule and track progress against milestones
- Identify and escalate risks/blockers to sponsor
- Coordinate inter-team dependencies and communication
- Prepare presentations and demo materials
- Ensure documentation completeness and quality
- Manage GitHub repository workflow and code review standards
- Track and communicate project budget (effort tracking)

**Accountability:**
- Timeline adherence
- Scope management and change control
- Team productivity and morale
- Quality of deliverables

---

#### Backend Engineer (Benjamin Tran)

**Responsibilities:**
- Design and implement Node.js/Express backend architecture
- Configure PostgreSQL database and Prisma ORM
- Design and implement user schema (Users table)
- Implement secure authentication system (bcrypt password hashing, JWT tokens)
- Create authentication middleware and protect routes
- Build chat API endpoints (send/receive messages)
- Integrate Hugging Face Inference API for AI calls
- Manage conversation context and history
- Implement error handling and input validation
- Conduct API testing and debugging
- Deploy backend to Railway/Render and manage production environment
- Document API endpoints and setup procedures

**Accountability:**
- API functionality and reliability
- Database integrity and performance
- Security of authentication system
- Backend deployment success

---

#### Frontend Engineer (Jonathan Dang)

**Responsibilities:**
- Set up React application with Vite build tool
- Design and implement responsive UI/UX using Tailwind CSS
- Create and style React components (login, registration, chat, navigation)
- Implement client-side routing with React Router
- Build authentication state management (Context API or similar)
- Implement protected route logic
- Build chat interface (message bubbles, input field, message history)
- Implement message pagination and loading states
- Create responsive design for mobile devices
- Integrate with backend API endpoints
- Conduct browser compatibility testing (Chrome, Firefox, Safari)
- Deploy frontend to Vercel and manage production environment
- Create user documentation and help guides

**Accountability:**
- UI/UX quality and responsiveness
- Frontend performance and user experience
- Browser and device compatibility
- Frontend deployment success

---

#### AI Integration Specialist

**Responsibilities:**
- Set up Hugging Face account and manage API keys
- Test and validate Mistral-7B model for Spanish conversation quality
- Design and implement AI service wrapper
- Engineer prompt templates for restaurant scenario
- Create prompt variations (multiple languages, learner levels)
- Test AI conversation flow and context maintenance
- Integrate ElevenLabs API for voice features (transcription and synthesis)
- Conduct model testing and gather feedback on conversation quality
- Document prompt design decisions and system prompt rationale
- Participate in QA testing and bug fixes
- Support production troubleshooting for AI-related issues
- Prepare technical documentation on AI integration

**Accountability:**
- Quality of AI conversations
- Reliability of voice features
- Prompt effectiveness and language accuracy
- API integration stability

---

### Cross-Functional Responsibilities

**All Team Members:**
- Adhere to git workflow and code review standards
- Participate in sprint planning and retrospectives
- Contribute to project documentation
- Support QA testing and bug verification
- Attend weekly sync meetings
- Escalate blockers and communicate status updates
- Maintain professional communication and collaboration

---

## Stakeholder Roles and Responsibilities

### Stakeholders & Roles

| Stakeholder | Role | Responsibilities |
|---|---|---|
| **Hussain Zaidi** | Executive Sponsor | Provide project oversight, approve scope changes, remove organizational blockers, review final demo |
| **CS4800 Course Instructor** | Academic Oversight | Evaluate project completion, provide feedback, assess learning outcomes, grade final submission |
| **Evaluation Panel** | Assessment | Evaluate MVP functionality, code quality, documentation, presentation at final demo |
| **Spanish Learners (End Users)** | User Community | Provide feedback on usability and learning effectiveness (if pilot testing conducted) |

### Stakeholder Engagement Plan

| Stakeholder | Engagement Level | Communication Frequency | Key Touchpoints |
|---|---|---|---|
| **Executive Sponsor** | High | Bi-weekly status updates | Kickoff, mid-project review, blockers, final demo |
| **Course Instructor** | High | Weekly class meetings + demos | Requirements review, progress check-ins, final evaluation |
| **Evaluation Panel** | Medium | Final presentation only | Final demo and code review |
| **End Users** | Low (if applicable) | Feedback at final demo | UI/UX feedback, conversation quality feedback |

---

## Project Success Criteria

The project will be considered successful upon achievement of the following criteria:

1. **Functional MVP:** All core features working as designed (authentication, chat, voice)
2. **Deployed & Accessible:** Application running on production hosting (Vercel + Railway/Render)
3. **Test Coverage:** All test cases executed; pass/fail results documented
4. **Documentation Complete:** README, API docs, setup guides, user guide all finalized
5. **Code Quality:** Clean, documented code; successful code reviews; no critical bugs
6. **Timeline:** All milestones achieved by target dates (or approved extensions with sponsor)
7. **Demo Ready:** Polished presentation; smooth demo run without blockers
8. **Team Satisfaction:** Team feels confident in deliverables; knowledge documented for future maintenance

---

## Sign-Off

**Project Sponsor:**  ___________________________________     Date: ____________  
(Name: Hussain Zaidi)

**Project Manager:**  ___________________________________     Date: ____________  
(Name: Benjamin Tran)

**Project Manager:**  ___________________________________     Date: ____________  
(Name: Jonathan Dang)

**Approved by:**  ___________________________________     Date: ____________  
(Course Instructor / Academic Oversight)
