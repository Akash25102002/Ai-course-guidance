# AI Course Generator Platform

A premium, production-ready AI-powered course generator built with Next.js 15, React 19, Gemini 3.5 Flash, Clerk, Drizzle ORM, and PostgreSQL (Neon Database). Users can generate full custom curricula matching standard SaaS aesthetics (Notion, Vercel, Linear, Cursor).

---

## 🚀 Features

1. **Modern SaaS UI**: Dark/Light modes, glassmorphism containers, hover effect structures, and Framer Motion micro-animations.
2. **Dynamic Course Generator**: Generates titles, descriptions, target goals, outcomes, prerequisites, career roles, weekly modules, and lessons.
3. **AI Lesson Builder**: Generates explanations, examples, standard interviews QA, practice tasks, summaries, and interactive coding code playgrounds.
4. **AI Exam Quiz Generator**: Compiles multiple-choice questions, fill-in-the-blanks, and coding exams with immediate score correction.
5. **Capstone Projects Generator**: Designs project stacks, architecture guidelines, folder directory trees, milestones, and deployment guides.
6. **Dashboard & Streaks**: Monitors user course lists, streak calculations, completions, bookmarks, and a top-10 global leaderboard.
7. **Official Certificates**: Earn, view, and print PDF certificates of completion upon finishing 100% of any course.
8. **AI Chat Assistant**: Dynamic tutor side panel allowing you to ask questions about specific lessons or tasks.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion, Lucide Icons, React Hook Form, Zod.
- **Backend & DB**: Server Actions, Gemini API (SDK `@google/genai`), Clerk Auth, Drizzle ORM, serverless Postgres (NeonDB).

---

## 📋 Prerequisites

Before running the application, make sure you have:
- [Node.js](https://nodejs.org) (v18.x or later)
- A [Clerk Account](https://clerk.com) for authentication.
- A [Neon Console DB](https://neon.tech) account for postgres serverless.
- A [Google AI Studio Key](https://aistudio.google.com) for Gemini API accesses.

---

## 🔧 Installation & Setup

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Gemini API Key
GEMINI_API_KEY=your_google_ai_studio_api_key

# Database Link (Neon PostgreSQL)
DATABASE_URL=postgres://your_neon_db_url
```

### 3. Database Migration Sync
We use Drizzle ORM to manage schema pushes. To sync the PostgreSQL database with the defined schema, run:
```bash
# Generate schema SQL migrations
npx drizzle-kit generate

# Push migrations to Neon PostgreSQL
npx drizzle-kit push
```

### 4. Running the App Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏗️ Folder Architecture

```
/
├── app/                  # Next.js App router routes
│   ├── api/              # API endpoints
│   ├── dashboard/        # Dashboard layout, leaderboards, and admin
│   ├── course/           # Dynamic course player router
│   ├── sign-in/          # Login pages
│   ├── sign-up/          # Signup pages
│   ├── layout.tsx        # Global provider layout wrap
│   └── page.tsx          # Landing page
├── components/           # UI and layout component folders
│   ├── ui/               # Reusable buttons, inputs, badges, select, cards
│   ├── navbar.tsx        # Global header
│   └── footer.tsx        # Footer details
├── actions/              # Server Actions (courses, user syncing, AI chat)
├── db/                   # Database schemas and Drizzle config
├── lib/                  # Library connections (db setup, gemini endpoints)
├── types/                # Typescript typings interfaces
├── providers/            # Client providers (Themes, Toasts, Auth wraps)
└── utils/                # Utility helpers (Markdown parsers)
```

---

## 📄 License
This project is open-source and available under the MIT License.
