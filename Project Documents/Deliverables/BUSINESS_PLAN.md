# BUSINESS PLAN: ConvoAI
## AI Language Conversation Partner
### 6-Week MVP Development Project
**Status:** Academic Project  
**Last Updated:** May 2026  

---

## 1. Executive Summary

**ConvoAI** is an AI-powered language learning web application that enables learners to practice real-world conversations in multiple languages through scenario-based, judgment-free dialogue. The MVP leverages completely free AI models via Hugging Face to deliver affordable, accessible conversation practice across five languages (English, Spanish, Chinese, Korean, Japanese) with optional voice integration.

### 1.1. Business Concept

Language learners face a critical gap: vocabulary apps teach isolated words, while human tutoring ($30–60/hour) remains prohibitively expensive. ConvoAI bridges this gap by offering:

- **Multi-language conversation practice** in realistic scenarios (restaurant ordering, travel directions, casual conversation)
- **AI-powered real-time feedback** tailored to learner level
- **Voice integration** (optional) for immersive speech practice  
- **Zero-cost technology stack** using free AI models and open-source tools
- **Web-first experience** accessible across devices

Unlike Duolingo (gamified vocab drills) or Babbel (structured lessons), ConvoAI specializes in **free-form conversational practice**—the exact skill traditional apps struggle to teach effectively.

### 1.2. Target Market

Initial focus: **Language learners with basic proficiency** (≥1 semester equivalent) seeking conversational practice.

**Primary Segments:**
- **College Students (18–24)**: 50% of initial user base. Tech-comfortable, budget-conscious, motivated by grades/study abroad. Spanish departments as partnership channels.
- **Young Professionals (25–35)**: 35% of initial user base. Career advancement, travel prep, personal enrichment. Value time efficiency and real-world application.
- **Travelers & Hobbyists (25–50)**: 15% of initial user base. Practical conversation for imminent travel or hobby learning.

**Geographic Focus:** United States, launching within university community for beta testing.

### 1.3. Proposed Solution

**Technical Stack (100% Free):**
- **AI Model**: Meta-Llama-3-8B-Instruct (via Hugging Face free Inference API)
- **Languages**: English, Spanish, Chinese, Korean, Japanese (language-specific prompt strategies)
- **Scenarios**: Restaurant/Café, Travel & Directions, Small Talk
- **Voice**: ElevenLabs integration (speech synthesis) + Web Audio API (speech input)
- **Backend**: Node.js/Express + PostgreSQL + Prisma ORM
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Authentication**: JWT-based with bcrypt password hashing
- **Hosting**: Free tiers (Vercel frontend, Railway/Render backend)

**Competitive Advantage:**
- Multi-language from day one (not retrofitted)
- Optional voice integration for immersive learning
- Configurable learner level & tone
- Zero API costs (free Hugging Face model)
- Scenario-based prompts optimized for language learning

### 1.4. Team

Three-person computer science team with full-stack JavaScript expertise:

- **Backend Developer**: Node.js/Express, PostgreSQL, Prisma ORM, JWT auth, AI prompt engineering
- **Frontend Developer**: React/Vite, UI/UX, state management, voice integration
- **Full-Stack/Content Developer**: Scenario design, testing/QA, deployment (Vercel/Railway)

**Collaboration**: Git/GitHub, bi-weekly standups, Trello task board, sprint reviews.

---

## 2. Product Overview

### 2.1. Core Features

#### 1. Multi-Language Conversation Scenarios
Users practice realistic dialogue in five languages:
- **Restaurant/Café** (Spanish, English, Chinese, Korean, Japanese): Order food/drinks, ask about menu items, request the check
- **Travel & Directions** (Spanish, English, Chinese, Korean, Japanese): Ask for directions, navigate cities, discover landmarks
- **Small Talk** (Spanish, English, Chinese, Korean, Japanese): Casual everyday conversation with natural flow

**Language-Specific Implementation:**
- Separate system prompts per language, optimized for cultural context and educational outcomes
- Romanization support for non-Latin scripts (Chinese, Korean, Japanese)
- Translation helpers for non-English practice (e.g., Spanish learner gets English translation of AI responses)

#### 2. AI Conversation Engine
- **Model**: Meta-Llama-3-8B-Instruct (free via Hugging Face)
- **Capabilities**:
  - Natural conversational responses in selected language
  - In-character role-play (friendly waiter, local guide, conversation partner)
  - Context awareness across conversation history (up to 10 messages)
  - Error handling and clarification requests
  - Configurable tone & learner level (beginner-friendly language, pacing)
- **Prompt Strategy Pattern**: Language-specific strategy classes (`EnglishStrategy`, `SpanishStrategy`, `ChineseStrategy`, `KoreanStrategy`, `JapaneseStrategy`) extend `BaseLanguageStrategy` for easy addition of new languages
- **Zero API Costs**: Free Hugging Face Inference API (no rate limits for academic use)

#### 3. Voice Integration (Optional)
- **Speech Input**: Web Audio API + browser speech recognition
- **Speech Output**: ElevenLabs Text-to-Speech (configurable by language)
- **Voice UI**: VoiceOrb visual feedback component for recording/playback
- **Use Case**: Learners can speak their practice messages and hear native-like AI responses

#### 4. User Authentication & Management
- Email/password registration
- JWT-based stateless authentication
- bcrypt password hashing
- Protected API routes
- Conversation history per user

#### 5. Conversation Tracking & History
- Users start new conversations per scenario/language
- Conversation history persisted in PostgreSQL
- Clean, intuitive chat interface with message context
- Manual and transcript review

### 2.2. Technology Stack

#### Frontend
- **React 18**: Component-based UI with hooks
- **Vite**: Fast module bundler for development & production
- **Tailwind CSS**: Utility-first responsive styling
- **React Router**: Client-side navigation
- **Axios**: HTTP client for API requests
- **Web Audio API**: Speech input (no extra library)

#### Backend
- **Node.js + Express**: REST API framework
- **PostgreSQL**: Relational database (users, conversations, messages)
- **Prisma ORM**: Type-safe database queries, schema migrations
- **JWT**: Stateless authentication (jsonwebtoken package)
- **bcrypt**: Secure password hashing
- **dotenv**: Environment variable management
- **node-fetch**: HTTP client for Hugging Face API calls

#### AI & Voice
- **Hugging Face Inference API** (FREE): Chat completions endpoint
  - Model: `meta-llama/Meta-Llama-3-8B-Instruct` (configurable via `AI_MODEL_ID` env)
  - Base URL: `https://router.huggingface.co/v1/chat/completions`
  - No API costs; completely free for academic/commercial use
- **ElevenLabs API** (Optional): Text-to-speech for voice responses
- **Browser APIs**: Fetch, Web Audio, SpeechRecognition

#### DevOps & Hosting
- **Git & GitHub**: Version control, CI/CD triggers
- **Vercel**: Frontend hosting (automatic deploys from GitHub)
- **Railway/Render**: Backend + PostgreSQL hosting (free tier)
- **Environment Variables**: Secure API keys (`HUGGINGFACE_API_KEY`, `ELEVENLABS_API_KEY`, JWT secret, DB URL)

#### Monitoring & Logging
- Console logging for development
- Error tracking middleware in Express
- Custom error classes for AI service failures (`AIValidationError`, `AIProviderError`, `AITimeoutError`, `AIQuotaError`, `AIConfigurationError`)

---

## 3. Market Analysis

### 3.1. Industry Overview

**Market Size & Growth:**
- Global digital language learning: $14.7B (2023) → $70.6B (2032) projected, **19.2% CAGR**
- US market: 35% of global, **$5.1B (2023)** with strong AI adoption
- Multi-language learners: Spanish (8M K–12), plus adult learners across all five target languages
- Mobile app market trend: +23% YoY growth in language learning apps

**Key Market Drivers:**
- Cost-effectiveness: AI tutoring costs 60–80% less than human tutors ($30–60/hour)
- Flexibility: Learn anytime, anywhere—critical for busy students/professionals
- AI advancement: Open-source models enable conversational practice at zero cost
- Conversation gap: 70% of language apps focus on vocabulary/grammar; <20% provide quality conversational practice
- Multilingual demand: Global workforce increasingly requires multiple language proficiency

**ConvoAI Opportunity:** Clear gap between expensive human tutoring and vocabulary-focused apps. AI-powered conversation at zero cost fills this void for cost-conscious learners.

### 3.2. Competitive Landscape

| Feature | ConvoAI | Duolingo | Babbel | Italki | Human Tutor |
|---------|---------|----------|--------|--------|-------------|
| **AI Conversation** | ✓ | ✗ | Limited | ✗ | ✓ |
| **Multiple Languages** | ✓ (5) | ✓ (30+) | ✓ (14+) | ✓ (varies) | ✓ |
| **Voice Practice** | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Free** | ✓ (MVP) | Freemium | Freemium | ✗ ($10–50/hr) | ✗ ($30–60/hr) |
| **Real-time Feedback** | ✓ | Limited | ✓ | ✓ | ✓ |
| **Zero Setup** | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Scenario-Based** | ✓ | ✗ | ✓ | ✓ | ✓ |

---

## 4. Marketing & Sales Strategy

### 4.1. Marketing Channels (MVP Phase)

**Zero-Cost Launch Strategy:**
- **University Partnerships**: Spanish/Language departments for beta user recruitment (10–15 volunteers)
- **Social Media**: Subreddit posts, university Discord, language learning communities
- **Word-of-Mouth**: Instructor referrals, student forums
- **Content**: Blog post on language learning AI (LinkedIn, Medium)

**MVP Marketing Budget: $0** (student project, organic channels only)

### 4.2. Customer Acquisition & Success Metrics

**Free Access Strategy:**
- **Weeks 1–4**: Development & internal testing
- **Weeks 5–6**: Open beta to 10–15 test users from university community
- **Goal**: 10–15 active users, 75%+ complete first conversation, 4+/5 satisfaction rating

**Success Metrics (MVP):**
- ✓ User activation: ≥75% complete first conversation
- ✓ User satisfaction: ≥4/5 stars from feedback surveys
- ✓ Technical stability: Zero unhandled crashes in user testing
- ✓ Feature completeness: All core scenarios functional in ≥3 languages
- ✓ Deployment: Fully deployed, accessible via public URL

### 4.3. Development Timeline & Costs

**6-Week Sprint:**
- **Week 1–2**: Backend setup (Express, PostgreSQL, Prisma schema, auth)
- **Week 3–4**: AI integration (Hugging Face chat API, language strategies, scenario prompts)
- **Week 5–6**: Frontend (React UI, voice integration), testing, deployment, user feedback

**MVP Cost Breakdown:**
- AI API: **$0** (free Hugging Face Inference API)
- Hosting: **$0** (free tiers: Vercel, Railway)
- Domain: **$0–12/year** (optional)
- Voice API: **$0–50** (optional ElevenLabs trial for demo)
- **Total: $0–62 for full 6-week MVP**

---

## 5. Risk Analysis & Mitigation

### 5.1. Risk Matrix

| Risk | Impact | Likelihood | Priority | Mitigation |
|------|--------|------------|----------|-----------|
| **R1: AI Response Quality** | High | Medium | 🔴 High | Extensive Llama-3 testing; detailed prompt engineering; response validation |
| **R2: Time Management** | High | Medium | 🔴 High | Realistic sprint planning; bi-weekly standups; clear task ownership |
| **R3: Database Schema Issues** | High | Low | 🟡 Medium | Design complete schema Week 1; peer review; Prisma migrations |
| **R4: Deployment Challenges** | Medium | Medium | 🟡 Medium | Deploy early with minimal features; allocate time in Week 6 |
| **R5: User Adoption** | Medium | Medium | 🟡 Medium | Partner with instructors; structured feedback survey; simple onboarding |
| **R6: Voice Integration Bugs** | Low | Medium | 🟡 Medium | Optional feature; stub with text-only if needed; test with real devices |
| **R7: API Rate Limits** | Medium | Low | 🟢 Low | Free tier has generous limits; monitor usage; cache responses if needed |

### 5.2. Key Risks & Mitigation Strategies

**R1: AI Model Response Quality**
- *Description*: Free Llama-3 model may produce inconsistent Spanish or lower-quality responses.
- *Mitigation*:
  - Extensive testing of Llama-3 across all 5 languages before full rollout
  - Detailed system prompts with strict character/tone constraints
  - Response validation (check length, language match, profanity filter)
  - Focus on narrow scenarios (restaurant, travel, small talk) for consistent quality
  - A/B test prompt variations

**R2: Time Management**
- *Description*: Team members balancing coursework may fall behind schedule.
- *Mitigation*:
  - Realistic sprint planning with 20% buffer time
  - Bi-weekly standups to catch blockers early
  - Clear task ownership in Trello (no ambiguity)
  - Focused scope: core scenarios only, voice optional (MVP can ship text-only)

**R3: Database Schema Issues**
- *Description*: Poor initial Prisma schema could require mid-project migration.
- *Mitigation*:
  - Design complete schema in Week 1 before backend coding
  - Schema review with all team members
  - Use Prisma migrations for reversible schema updates
  - Document schema rationale in code comments

**R4: Deployment Challenges**
- *Description*: First-time full-stack deployment may encounter platform-specific issues.
- *Mitigation*:
  - Deploy early (Week 4) with minimal features to test CI/CD pipeline
  - Use Vercel/Railway documentation + community forums
  - Allocate sufficient time in Week 6 for troubleshooting
  - Have fallback: Railway + Render both supported

**R5: User Adoption**
- *Description*: Test users may not engage or provide actionable feedback.
- *Mitigation*:
  - Partner with Spanish department instructors for recruitment & incentives
  - Create structured feedback survey (5 questions, <5 min)
  - Make onboarding extremely simple (3-click registration)
  - Offer test users a small incentive (course credit, certificate)

**R6: Voice Integration Bugs**
- *Description*: ElevenLabs/Web Audio issues may break voice UX.
- *Mitigation*:
  - Voice is optional; text-only mode fully functional
  - Test on real devices early (not just desktop Chrome)
  - Have fallback: stub voice responses with text if API fails
  - Clearly communicate voice as "beta" feature

**R7: API Rate Limits**
- *Description*: Hugging Face or ElevenLabs might rate-limit requests.
- *Mitigation*:
  - Hugging Face free tier has generous limits (~1000 req/day)
  - ElevenLabs free trial has ~10k characters/month
  - Monitor usage daily; alert if approaching limits
  - Implement response caching for common scenarios

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Weeks 1–2)
- ✓ PostgreSQL + Prisma schema (users, conversations, messages, scenarios)
- ✓ Express backend with JWT auth, password hashing
- ✓ React frontend scaffolding + routing
- ✓ Basic UI: login, registration, home

### Phase 2: AI Core (Weeks 3–4)
- ✓ Hugging Face API integration (chat completions)
- ✓ Language strategy pattern (5 language implementations)
- ✓ Scenario prompt design (restaurant, travel, small talk)
- ✓ Chat interface (message sending/receiving, history)
- ✓ Error handling & retry logic

### Phase 3: Polish & Voice (Week 5)
- ✓ Voice integration (optional; Web Audio + ElevenLabs)
- ✓ UI polish (VoiceOrb, responsive design, dark mode)
- ✓ Conversation transcripts & replay
- ✓ End-to-end testing

### Phase 4: Deployment & Feedback (Week 6)
- ✓ Frontend deployment (Vercel)
- ✓ Backend deployment (Railway)
- ✓ Beta user onboarding & feedback collection
- ✓ Bug fixes & final polish
- ✓ Documentation & presentation

---

## 7. Success Criteria (Academic Project)

**Definition of Done (MVP):**
1. **Technical Delivery**: Fully deployed, functional application accessible via public URL
2. **Feature Completeness**: Core conversation in ≥3 languages, ≥2 scenarios, with optional voice
3. **User Testing**: 10–15 beta users complete ≥1 full conversation
4. **User Feedback**: Average satisfaction ≥4/5 stars; qualitative feedback collected
5. **Zero-Cost Operation**: No commercial API charges; all services free tier or open-source
6. **Code Quality**: Clean, documented code; GitHub with clear README; CI/CD pipeline functional
7. **Presentation**: Polished demo, technical documentation, team reflections on lessons learned

**Post-MVP Roadmap** (future phases):
- [ ] User profiles & learner analytics (progress tracking)
- [ ] More scenarios (job interviews, dating, business meetings)
- [ ] Gamification (streaks, points, leaderboards)
- [ ] Community (share scenarios, peer feedback)
- [ ] Mobile app (React Native)
- [ ] Paid tier (premium scenarios, unlimited voice, premium AI models)

---

## 8. Conclusion

**ConvoAI solves a real problem**: affordable, accessible conversation practice in multiple languages. By leveraging free open-source AI, the team delivers genuine learning value without commercial API costs—making the business model sustainable from day one.

The 6-week MVP is deliberately scoped for feasibility while demonstrating core value:
- **Multiple languages** (5 from launch, easy to add more)
- **Realistic scenarios** (restaurant, travel, casual conversation)
- **Zero-cost technology** (free Hugging Face + Vercel/Railway)
- **Optional voice** for immersive learning
- **Real user feedback** to validate concept

This balance—**ambitious enough to impress, achievable with academic constraints**—positions ConvoAI as a strong portfolio project and foundation for future commercial development.

---

## Contact & Links

- **GitHub Repository**: [/Users/Jonny/CS4800_convo_ai](https://github.com/convoai/project)
- **Live Demo** (post-deployment): [URL will be added after Vercel deploy]
- **Team Contact**: team@convoai.com

---

**Last Updated**: May 2026  
**Status**: MVP Development (6-week sprint)  
**Confidentiality**: Academic Project
