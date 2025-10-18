# 📁 MindTherapy - Visual Project Structure

## 🎯 Quick Overview

This document provides a **visual map** of the entire codebase to help you navigate the project.

---

## 🌳 **Complete File Tree**

```
mindtherapy-landing-main/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript config
│   ├── tailwind.config.ts          # Tailwind CSS config
│   ├── next.config.ts              # Next.js config
│   ├── .eslintrc.json              # ESLint rules
│   └── .env.local                  # Environment variables
│
├── 📚 Documentation
│   ├── README.md                   # Project overview
│   ├── ARCHITECTURE.md             # Architecture guide
│   ├── REFACTORING_GUIDE.md        # How to refactor
│   ├── MIGRATION_CHECKLIST.md      # Step-by-step migration
│   ├── REFACTORING_SUMMARY.md      # What was done
│   └── PROJECT_STRUCTURE.md        # This file
│
├── 📂 src/                          # Source code
│   │
│   ├── 📂 app/                      # Next.js App Router
│   │   │
│   │   ├── 🌐 (marketing)/         # PUBLIC PAGES (Route Group)
│   │   │   ├── page.tsx            # Landing page
│   │   │   └── layout.tsx          # Marketing layout
│   │   │
│   │   ├── 🔐 (auth)/              # AUTH PAGES (Route Group)
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Login page
│   │   │   ├── signup/
│   │   │   │   └── page.tsx        # Signup page
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx        # Password reset
│   │   │   ├── onboarding/
│   │   │   │   └── page.tsx        # Onboarding flow
│   │   │   └── layout.tsx          # Auth layout (with AuthHeader)
│   │   │
│   │   ├── 📊 (dashboard)/         # PROTECTED PAGES (Route Group)
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx        # ✅ Server Component (FIXED!)
│   │   │   │   ├── loading.tsx     # Loading skeleton
│   │   │   │   └── patient/
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx # Patient detail page
│   │   │   ├── aac/
│   │   │   │   └── page.tsx        # AAC Communicator
│   │   │   ├── settings/
│   │   │   │   └── page.tsx        # Settings page
│   │   │   └── layout.tsx          # Dashboard layout (auth check)
│   │   │
│   │   ├── 🔧 actions/             # SERVER ACTIONS (API Layer)
│   │   │   ├── auth.ts             # signUp, signIn, signOut, etc.
│   │   │   ├── patients.ts         # CRUD for patients
│   │   │   ├── aac.ts              # AAC board operations
│   │   │   └── profiles.ts         # Profile management
│   │   │
│   │   ├── 🔌 api/                 # API Routes (if needed)
│   │   │   └── route.ts
│   │   │
│   │   ├── providers.tsx           # Root providers wrapper
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   └── middleware.ts           # Next.js middleware (session)
│   │
│   ├── 📂 components/              # REACT COMPONENTS
│   │   │
│   │   ├── 📊 dashboard/           # Dashboard Feature
│   │   │   ├── dashboard-client.tsx     # Main client wrapper
│   │   │   ├── dashboard-stats.tsx      # Stats cards
│   │   │   ├── dashboard-header.tsx     # Header with search
│   │   │   ├── dashboard-sidebar.tsx    # Navigation sidebar
│   │   │   ├── patients-list.tsx        # Patient grid
│   │   │   ├── patient-card.tsx         # Individual card
│   │   │   ├── add-patient-modal.tsx    # Add patient modal
│   │   │   └── edit-patient-modal.tsx   # Edit patient modal
│   │   │
│   │   ├── 🗣️ aac/                # AAC Feature
│   │   │   └── (existing AAC components)
│   │   │
│   │   ├── 🔄 shared/              # Shared Components
│   │   │   ├── app-header.tsx           # App header (dashboard)
│   │   │   ├── auth-header.tsx          # Auth header (login/signup)
│   │   │   └── custom-select.tsx        # Custom select dropdown
│   │   │
│   │   └── 🎨 ui/                  # UI Primitives (shadcn/Radix)
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── toast.tsx
│   │       └── ... (40+ components)
│   │
│   ├── 📂 lib/                      # UTILITIES & CONFIG
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   ├── server.ts           # Server Supabase client
│   │   │   ├── middleware.ts       # Session refresh logic
│   │   │   └── profiles-client.ts  # Profile helpers
│   │   ├── utils.ts                # Utility functions (cn, etc.)
│   │   └── constants.ts            # Constants
│   │
│   ├── 📂 providers/               # CONTEXT PROVIDERS
│   │   ├── notification-provider.tsx
│   │   └── (future providers)
│   │
│   ├── 📂 hooks/                    # CUSTOM HOOKS
│   │   ├── use-notifications.ts
│   │   └── (other hooks)
│   │
│   ├── 📂 types/                    # TYPESCRIPT TYPES
│   │   ├── database.types.ts       # DB & Profile types
│   │   ├── patient.types.ts        # Patient types
│   │   ├── aac.types.ts            # AAC types
│   │   └── document.types.ts       # Document types
│   │
│   └── middleware.ts               # Next.js middleware (root)
│
├── 📂 public/                       # STATIC ASSETS
│   ├── logos/                      # Brand logos
│   ├── images/                     # Images
│   ├── videos/                     # Demo videos
│   ├── partners/                   # Partner photos
│   └── flags/                      # Country flags
│
├── 📂 supabase/                     # SUPABASE CONFIG
│   └── migrations/                 # Database migrations
│       ├── 00_cleanup.sql
│       ├── 01_master.sql           # Main schema
│       ├── 02_ADD_CHILD_MODE_PIN.sql
│       ├── 03_ADD_GLOBAL_PIN.sql
│       ├── 04_ADD_MISSING_ENUM_VALUES.sql
│       ├── 05_ADD_PHONE_COUNTRY_CODE.sql
│       └── 06_CREATE_AAC_TABLES.sql
│
└── 📂 OLD FILES (to remove after migration)
    ├── src/app/dashboard/page.tsx.backup
    ├── src/app/dashboard/_page_server.tsx
    └── src/app/partners.txt
```

---

## 🗺️ **Route Map**

### **Public Routes** (No auth required)

```
URL: /
├── File: src/app/(marketing)/page.tsx
└── Layout: src/app/(marketing)/layout.tsx
```

### **Auth Routes**

```
URL: /login
├── File: src/app/(auth)/login/page.tsx
└── Layout: src/app/(auth)/layout.tsx (with AuthHeader)

URL: /signup
├── File: src/app/(auth)/signup/page.tsx
└── Layout: src/app/(auth)/layout.tsx

URL: /forgot-password
├── File: src/app/(auth)/forgot-password/page.tsx
└── Layout: src/app/(auth)/layout.tsx

URL: /onboarding
├── File: src/app/(auth)/onboarding/page.tsx
└── Layout: src/app/(auth)/layout.tsx
```

### **Protected Routes** (Auth required)

```
URL: /dashboard
├── File: src/app/(dashboard)/dashboard/page.tsx (Server Component ✅)
└── Layout: src/app/(dashboard)/layout.tsx (Auth check + AppHeader)

URL: /dashboard/patient/[id]
├── File: src/app/(dashboard)/dashboard/patient/[id]/page.tsx
└── Layout: src/app/(dashboard)/layout.tsx

URL: /aac
├── File: src/app/(dashboard)/aac/page.tsx
└── Layout: src/app/(dashboard)/layout.tsx

URL: /settings
├── File: src/app/(dashboard)/settings/page.tsx
└── Layout: src/app/(dashboard)/layout.tsx
```

---

## 🎨 **Component Map**

### **Dashboard Page Breakdown**

```
📄 src/app/(dashboard)/dashboard/page.tsx (Server Component)
    ↓ fetches data
    ↓ passes to
📦 src/components/dashboard/dashboard-client.tsx (Client Component)
    ├── 📊 dashboard-stats.tsx (Stats cards)
    ├── 🔍 dashboard-header.tsx (Search & filters)
    ├── 🧭 dashboard-sidebar.tsx (Navigation)
    └── 👥 patients-list.tsx
        ├── 🎴 patient-card.tsx (×N)
        ├── ➕ add-patient-modal.tsx
        └── ✏️ edit-patient-modal.tsx
```

### **Shared Components**

```
📂 src/components/shared/
├── 📱 app-header.tsx        → Used in (dashboard) layout
├── 🔐 auth-header.tsx       → Used in (auth) layout
└── 📝 custom-select.tsx     → Used in forms
```

### **UI Primitives**

```
📂 src/components/ui/
├── button.tsx
├── dialog.tsx
├── input.tsx
├── select.tsx
├── toast.tsx
└── ... (40+ Radix UI components)
```

---

## 🔄 **Data Flow Diagram**

### **Authentication Flow**

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. Visit /signup
       ↓
┌─────────────────┐
│  Signup Page    │
│  (auth) layout  │
└──────┬──────────┘
       │ 2. Submit form
       ↓
┌─────────────────┐
│ Server Action   │
│ signUp()        │
└──────┬──────────┘
       │ 3. Create user
       ↓
┌─────────────────┐
│   Supabase      │
│   auth.users    │
└──────┬──────────┘
       │ 4. Trigger
       ↓
┌─────────────────┐
│   Supabase      │
│   profiles      │
└──────┬──────────┘
       │ 5. Redirect
       ↓
┌─────────────────┐
│  Onboarding     │
│  (auth) layout  │
└──────┬──────────┘
       │ 6. Complete
       ↓
┌─────────────────┐
│   Dashboard     │
│ (dashboard)     │
│  layout checks  │
│  auth first     │
└─────────────────┘
```

### **Dashboard Data Flow**

```
┌─────────────────┐
│ User visits     │
│  /dashboard     │
└──────┬──────────┘
       │ 1. Request
       ↓
┌─────────────────┐
│  Middleware     │
│ (refreshes      │
│  session)       │
└──────┬──────────┘
       │ 2. Check auth
       ↓
┌─────────────────┐
│ Dashboard       │
│ Layout          │
│ (verifies auth) │
└──────┬──────────┘
       │ 3. Fetch data
       ↓
┌─────────────────┐
│ Dashboard Page  │
│ (Server)        │
│ getPatients()   │
└──────┬──────────┘
       │ 4. Query DB
       ↓
┌─────────────────┐
│   Supabase      │
│   patients +    │
│   sessions +    │
│   gamification  │
└──────┬──────────┘
       │ 5. Calculate stats
       ↓
┌─────────────────┐
│ Server Action   │
│ (process data)  │
└──────┬──────────┘
       │ 6. Return data
       ↓
┌─────────────────┐
│ DashboardClient │
│ (Client)        │
│ initialPatients │
└──────┬──────────┘
       │ 7. Render UI
       ↓
┌─────────────────┐
│   Browser       │
│ (displays HTML) │
└─────────────────┘
```

### **Patient CRUD Flow**

```
CREATE:
User clicks "Add Patient"
    ↓
AddPatientModal opens (Client)
    ↓
User fills form + uploads avatar
    ↓
[Upload to Supabase Storage]
    ↓
[Server Action: createPatient()]
    ↓
[Supabase INSERT into patients]
    ↓
[Trigger creates gamification record]
    ↓
[Client updates local state]
    ↓
Modal closes, new card appears ✅

UPDATE:
User clicks "Edit" on patient card
    ↓
EditPatientModal opens with data
    ↓
User edits form
    ↓
[Server Action: updatePatient()]
    ↓
[Supabase UPDATE patients record]
    ↓
[Client updates local state]
    ↓
Modal closes, card updates ✅

DELETE:
User clicks "Delete"
    ↓
Confirmation dialog
    ↓
[Server Action: deletePatient()]
    ↓
[Supabase DELETE (CASCADE)]
    ↓
[Client removes from list]
    ↓
Card disappears ✅
```

---

## 🗄️ **Database Schema Map**

```
┌─────────────────┐
│  auth.users     │ (Supabase Auth)
│  - id (PK)      │
│  - email        │
└────────┬────────┘
         │ 1:1
         ↓
┌─────────────────┐
│   profiles      │
│  - id (PK, FK)  │
│  - full_name    │
│  - situation    │
│  - profile_     │
│    completed    │
└────────┬────────┘
         │ 1:N
         ↓
┌─────────────────┐
│   patients      │
│  - id (PK)      │
│  - user_id (FK) │
│  - name         │
│  - condition    │
│  - status       │
└────┬─────┬──────┘
     │     │
     │     │ 1:1
     │     ↓
     │  ┌─────────────────────┐
     │  │ patient_gamification │
     │  │  - patient_id (PK)   │
     │  │  - level             │
     │  │  - total_points      │
     │  │  - current_streak    │
     │  └─────────────────────┘
     │
     │ 1:N
     ↓
┌─────────────────┐
│   sessions      │
│  - id (PK)      │
│  - patient_id   │
│  - tool_type    │
│  - score        │
└─────────────────┘

┌─────────────────┐
│  aac_boards     │
│  - id (PK)      │
│  - user_id (FK) │
│  - patient_id   │
│  - is_active    │
└────────┬────────┘
         │ 1:N
         ↓
┌─────────────────┐
│   aac_cards     │
│  - id (PK)      │
│  - board_id (FK)│
│  - text         │
│  - image_url    │
│  - usage_count  │
└─────────────────┘
```

---

## 🔑 **Key File Purposes**

### **Core App Files**

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout, wraps all pages |
| `src/app/providers.tsx` | Provider wrapper (Theme, Notifications) |
| `src/middleware.ts` | Session refresh, runs on every request |

### **Layouts**

| File | Purpose |
|------|---------|
| `src/app/(marketing)/layout.tsx` | Public pages wrapper |
| `src/app/(auth)/layout.tsx` | Auth pages + AuthHeader |
| `src/app/(dashboard)/layout.tsx` | Protected pages + auth check |

### **Pages**

| File | Purpose |
|------|---------|
| `src/app/(marketing)/page.tsx` | Landing page |
| `src/app/(auth)/login/page.tsx` | Login form |
| `src/app/(auth)/signup/page.tsx` | Signup form |
| `src/app/(auth)/onboarding/page.tsx` | Complete profile |
| `src/app/(dashboard)/dashboard/page.tsx` | Dashboard (Server) ✅ |
| `src/app/(dashboard)/aac/page.tsx` | AAC Communicator |
| `src/app/(dashboard)/settings/page.tsx` | Settings |

### **Server Actions**

| File | Purpose |
|------|---------|
| `src/app/actions/auth.ts` | Auth operations |
| `src/app/actions/patients.ts` | Patient CRUD |
| `src/app/actions/aac.ts` | AAC board operations |
| `src/app/actions/profiles.ts` | Profile management |

### **Components**

| File | Purpose |
|------|---------|
| `src/components/dashboard/dashboard-client.tsx` | Main dashboard UI |
| `src/components/dashboard/patient-card.tsx` | Patient card |
| `src/components/shared/app-header.tsx` | App header |
| `src/components/shared/auth-header.tsx` | Auth header |
| `src/components/ui/*` | Radix UI primitives |

---

## 📊 **Import Path Map**

```typescript
// Use these aliases in your imports:

@/components          → src/components/
@/lib                 → src/lib/
@/types               → src/types/
@/app                 → src/app/
@/hooks               → src/hooks/
@/providers           → src/providers/

// Examples:
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Patient } from "@/types/patient.types"
import { getPatients } from "@/app/actions/patients"
```

---

## 🎯 **Quick Navigation Guide**

**Looking for...** → **Go to...**

- **Landing page?** → `src/app/(marketing)/page.tsx`
- **Login logic?** → `src/app/actions/auth.ts`
- **Dashboard UI?** → `src/components/dashboard/`
- **Patient types?** → `src/types/patient.types.ts`
- **Database config?** → `src/lib/supabase/`
- **Auth check?** → `src/app/(dashboard)/layout.tsx`
- **UI components?** → `src/components/ui/`
- **Migrations?** → `supabase/migrations/`

---

## 🚀 **Getting Started**

1. **Clone & Install**
   ```bash
   git clone <repo>
   npm install
   ```

2. **Set up Environment**
   ```bash
   cp .env.example .env.local
   # Add Supabase credentials
   ```

3. **Run Dev Server**
   ```bash
   npm run dev
   ```

4. **Navigate Code**
   - Use this file as a map
   - Follow import paths
   - Check documentation

---

**Last Updated:** 2025-01-17

**Quick Links:**
- [Architecture Guide](./ARCHITECTURE.md)
- [Refactoring Guide](./REFACTORING_GUIDE.md)
- [Migration Checklist](./MIGRATION_CHECKLIST.md)
- [Summary](./REFACTORING_SUMMARY.md)
