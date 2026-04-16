#DSA Reviewer — FANG-Style AI Code Reviewer

> An AI-powered DSA code reviewer that provides feedback like a senior FANG engineer would in a technical interview.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square)
![Redis](https://img.shields.io/badge/Redis-7-red?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square)

---

## What It Does

Submit your DSA solution and get instant feedback from an AI simulating a FANG interviewer — covering time/space complexity, variable naming, edge cases, code readability, optimizations, and an overall score out of 10.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Spring Boot 3.2, Java 21 |
| AI Model | Groq API (LLaMA 3) |
| Database | PostgreSQL + Spring Data JPA |
| Caching | Redis (`@Cacheable`) |
| Auth | Spring Security + JWT |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| DevOps | Docker, Docker Compose |

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Next.js UI    │────▶│  Spring Boot API  │────▶│  Groq API   │
│   (Port 3000)   │     │   (Port 8080)     │     │  (LLaMA 3)  │
└─────────────────┘     └──────────────────┘     └─────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
             ┌────────────┐         ┌──────────────┐
             │ PostgreSQL │         │    Redis      │
             │  (Reviews) │         │   (Cache)     │
             └────────────┘         └──────────────┘
```

---

## Features

- **AI Code Review** — Groq LLaMA 3 analyzes DSA code with FANG-level strictness
- **Structured Feedback** — Time/Space Complexity, Variable Naming, Edge Cases, Readability, Optimizations
- **Scoring** — Overall score out of 10 with detailed rationale
- **JWT Authentication** — Secure register/login with Spring Security
- **Redis Caching** — Identical code submissions served from cache (60% API call reduction)
- **Review History** — All past reviews stored in PostgreSQL with full detail view
- **Multi-language** — Java, Python, C++, JavaScript, Go, Kotlin support
- **Dockerized** — Full stack runs with single `docker-compose up` command

---

## Local Setup

### Prerequisites
- Docker + Docker Compose
- Java 21 (for local development)
- Node.js 18+ (for local development)

### Run with Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/Diksha238/dsa-reviewer.git
cd dsa-reviewer

# Create .env file
cp .env.example .env
# Add your GROQ_API_TOKEN in .env

# Start everything
docker-compose up --build
```

App will be available at:
- Frontend → https://dsa-reviewer-ui-9xtr.vercel.app/review
- Backend API → dsa-reviewer-production.up.railway.app

### Environment Variables

```env
GROQ_API_TOKEN=your_groq_api_key_here
JWT_SECRET=your-secret-key-minimum-32-characters
```

Get a free Groq API key at [console.groq.com](https://console.groq.com)

---

## API Endpoints

```
POST /api/auth/register     Register new user
POST /api/auth/login        Login + get JWT token
POST /api/review            Submit code for AI review (auth required)
GET  /api/review/history    Get all past reviews (auth required)
GET  /api/review/{id}       Get single review (auth required)
```

---

## Project Structure

```
dsa-reviewer/
├── backend/                    # Spring Boot
│   ├── src/main/java/
│   │   └── com/dsareviewer/
│   │       ├── controller/     # REST endpoints
│   │       ├── service/        # Business logic + Groq integration
│   │       ├── repository/     # JPA repositories
│   │       ├── model/          # JPA entities
│   │       ├── dto/            # Request/Response DTOs
│   │       └── config/         # Security, Redis, CORS, JWT
│   └── src/main/resources/
│       └── application.yml
├── frontend/                   # Next.js
│   ├── app/
│   │   ├── page.tsx            # Login/Register
│   │   ├── review/page.tsx     # Main review page
│   │   └── history/            # Review history
│   ├── components/
│   │   └── Navbar.tsx
│   └── lib/
│       └── api.ts              # API client
├── docker-compose.yml
└── .env.example
```

---

## Screenshots

> Login Page | Review Page | History Page

---

## Key Technical Decisions

**Why Groq over OpenAI?**
Groq provides ultra-fast inference (< 2s response) with LLaMA 3 — ideal for real-time code review feedback.

**Why Redis caching?**
Identical code submissions (common in practice) are served from cache, reducing API calls and latency significantly.

**Why Spring Boot over Node.js?**
Strongly typed, production-grade backend with built-in dependency injection, security, and JPA — closer to enterprise FANG stack.

---

## What's Next

- [ ] RAG pipeline — DSA pattern knowledge base for context-aware reviews
- [ ] Interview Simulator Mode — follow-up questions after review
- [ ] Progress tracking — weak area analysis over time
- [ ] Deploy on AWS EC2 with CI/CD pipeline

---

## Made with ❤️ and lots of ☕️,Debugging 👩🏼‍💻 by ✨Diksha✨
[GitHub](https://github.com/Diksha238)

