# 🏗️ MindTherapy - Architecture Documentation

## 📖 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [Data Flow](#data-flow)
6. [Component Hierarchy](#component-hierarchy)
7. [Authentication & Authorization](#authentication--authorization)
8. [Database Schema](#database-schema)
9. [API Layer](#api-layer)
10. [Best Practices](#best-practices)

---

## 📋 Overview

MindTherapy is a **Next.js 15** therapeutic platform for autism and communication support, built with:
- ⚡ **React 19** Server & Client Components
- 🗄️ **Supabase** for backend (Auth, Database, Storage)
- 🎨 **Tailwind CSS 4** for styling
- 📊 **TypeScript** for type safety

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** (App Router)
- **React 19** (Server/Client Components)
- **TypeScript 5**
- **Tailwind CSS 4**
- **Radix UI** (Accessible components)
- **Lucide React** (Icons)
- **Recharts** (Data visualization)

### **Backend**
- **Supabase**
  - PostgreSQL Database
  - Authentication
  - Storage (File uploads)
  - Row Level Security (RLS)
- **Server Actions** (Next.js native)

### **DevOps**
- **Vercel** (Deployment)
- **Git** (Version control)
- **ESLint** (Code quality)

---

## 📁 Project Structure

```
mindtherapy-landing-main/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # 🌐 Public pages (Route Group)
│   │   │   ├── page.tsx              # Landing page
│   │   │   └── layout.tsx            # Marketing layout
│   │   │
│   │   ├── (auth)/                   # 🔐 Auth pages (Route Group)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── onboarding/page.tsx
│   │   │   └── layout.tsx            # Auth layout with AuthHeader
│   │   │
│   │   ├── (dashboard)/              # 📊 App pages (Route Group)
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx          # Server Component ✅
│   │   │   │   ├── loading.tsx       # Loading state
│   │   │   │   └── patient/[id]/     # Dynamic route
│   │   │   ├── aac/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx            # Dashboard layout with auth
│   │   │
│   │   ├── actions/                  # 🔧 Server Actions
│   │   │   ├── auth.ts
│   │   │   ├── patients.ts
│   │   │   ├── aac.ts
│   │   │   └── profiles.ts
│   │   │
│   │   ├── api/                      # API routes (if needed)
│   │   ├── providers.tsx             # Root providers
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # React Components
│   │   ├── dashboard/                # Dashboard feature
│   │   │   ├── dashboard-client.tsx
│   │   │   ├── dashboard-stats.tsx
│   │   │   ├── dashboard-header.tsx
│   │   │   ├── dashboard-sidebar.tsx
│   │   │   ├── patients-list.tsx
│   │   │   ├── patient-card.tsx
│   │   │   ├── add-patient-modal.tsx
│   │   │   └── edit-patient-modal.tsx
│   │   │
│   │   ├── aac/                      # AAC feature
│   │   ├── shared/                   # Shared components
│   │   │   ├── app-header.tsx
│   │   │   ├── auth-header.tsx
│   │   │   └── custom-select.tsx
│   │   │
│   │   └── ui/                       # UI primitives (Radix)
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   │
│   ├── lib/                          # Utilities & Config
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts         # Session refresh
│   │   ├── utils.ts
│   │   └── constants.ts
│   │
│   ├── providers/                    # Context Providers
│   │   └── notification-provider.tsx
│   │
│   ├── types/                        # TypeScript types
│   │   ├── database.types.ts
│   │   ├── patient.types.ts
│   │   ├── aac.types.ts
│   │   └── document.types.ts
│   │
│   └── middleware.ts                 # Next.js middleware
│
├── public/                           # Static assets
│   ├── logos/
│   ├── images/
│   └── videos/
│
├── supabase/
│   └── migrations/                   # Database migrations
│       └── 01_master.sql
│
├── ARCHITECTURE.md                   # This file
├── REFACTORING_GUIDE.md             # Migration guide
├── MIGRATION_CHECKLIST.md           # Step-by-step checklist
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 🎯 Architecture Patterns

### **1. Route Groups**

Route groups organize pages without affecting URLs:

```
(marketing)/page.tsx  → URL: /
(auth)/login/page.tsx → URL: /login
(dashboard)/dashboard/page.tsx → URL: /dashboard
```

**Benefits:**
- ✅ Different layouts per group
- ✅ Shared loading/error states
- ✅ Better code organization
- ✅ URL structure stays clean

### **2. Server-First Pattern**

**Server Components** (default):
- Fetch data on server
- No JavaScript sent to client
- Better performance & SEO

**Client Components** (opt-in with "use client"):
- Interactive UI
- Hooks (useState, useEffect)
- Browser APIs

**Example:**
```tsx
// Server Component (page.tsx)
export default async function DashboardPage() {
  const data = await fetchData() // Server-side
  return <DashboardClient initialData={data} />
}

// Client Component (dashboard-client.tsx)
"use client"
export function DashboardClient({ initialData }) {
  const [data, setData] = useState(initialData)
  // Interactive UI logic
}
```

### **3. Feature-Based Organization**

Components grouped by feature, not type:

```
✅ Good:
components/
├── dashboard/
│   ├── stats.tsx
│   ├── sidebar.tsx
│   └── patient-card.tsx
└── aac/
    ├── card-grid.tsx
    └── voice-settings.tsx

❌ Bad:
components/
├── cards/
├── modals/
└── forms/
```

### **4. Separation of Concerns**

| Layer | Location | Purpose |
|-------|----------|---------|
| **Presentation** | `components/` | UI & Interaction |
| **Business Logic** | `actions/` | Data operations |
| **Data Access** | `lib/supabase/` | Database queries |
| **Types** | `types/` | Type definitions |
| **Utilities** | `lib/utils/` | Helper functions |

---

## 🔄 Data Flow

### **1. Authentication Flow**

```
User Signup
    ↓
[Server Action] signUp()
    ↓
Supabase creates auth.users
    ↓
[Trigger] creates profiles record
    ↓
Redirect to /onboarding
    ↓
[Server Action] completeProfile()
    ↓
Redirect to /dashboard
```

### **2. Dashboard Data Flow**

```
User visits /dashboard
    ↓
[Middleware] checks session
    ↓
[Layout] verifies auth & profile
    ↓
[Page Server Component] fetches data
    ↓
getPatients() → Supabase query
    ↓
Returns PatientWithStats[]
    ↓
Passes to <DashboardClient initialPatients={...} />
    ↓
[Client Component] renders UI
    ↓
User interactions (add/edit/delete)
    ↓
[Server Actions] mutate data
    ↓
Optimistic UI updates
```

### **3. Patient CRUD Flow**

```
CREATE:
User clicks "Add Patient"
    ↓
<AddPatientModal> opens
    ↓
User fills form + uploads avatar
    ↓
[Client] uploads to Supabase Storage
    ↓
[Server Action] createPatient()
    ↓
[Supabase] inserts into patients table
    ↓
[Trigger] creates gamification record
    ↓
[Client] updates local state
    ↓
Modal closes, card appears

READ:
[Server] getPatients()
    ↓
SELECT patients WITH sessions stats
    ↓
Calculate progress scores
    ↓
Return PatientWithStats[]

UPDATE:
User clicks "Edit"
    ↓
<EditPatientModal> opens with data
    ↓
User edits form
    ↓
[Server Action] updatePatient()
    ↓
[Supabase] updates record
    ↓
[Client] updates local state

DELETE:
User clicks "Delete"
    ↓
Confirm dialog
    ↓
[Server Action] deletePatient()
    ↓
[Supabase] CASCADE deletes relations
    ↓
[Client] removes from list
```

---

## 🧩 Component Hierarchy

### **Dashboard Page Structure**

```
DashboardPage (Server)
    └── DashboardClient (Client)
        ├── DashboardSidebar
        │   └── NavItems
        ├── DashboardHeader
        │   ├── Search
        │   └── FilterSelect
        ├── DashboardStats
        │   └── StatsCard × 4
        └── PatientsList
            ├── AddPatientButton
            ├── PatientCard × N
            │   ├── Avatar
            │   ├── ProgressBar
            │   ├── StatsGrid
            │   ├── ActionButtons
            │   └── MoreMenu
            ├── AddPatientModal
            │   └── PatientForm
            └── EditPatientModal
                └── PatientForm
```

### **Component Responsibilities**

| Component | Type | Responsibility |
|-----------|------|----------------|
| `DashboardPage` | Server | Fetch data, auth check |
| `DashboardClient` | Client | State management, UI logic |
| `DashboardStats` | Client | Display metrics |
| `DashboardHeader` | Client | Search & filters |
| `DashboardSidebar` | Client | Navigation |
| `PatientsList` | Client | Patient grid & modals |
| `PatientCard` | Client | Individual patient UI |
| `AddPatientModal` | Client | Create patient form |
| `EditPatientModal` | Client | Update patient form |

---

## 🔐 Authentication & Authorization

### **Authentication Flow**

1. **Middleware** (`src/middleware.ts`)
   - Runs on every request
   - Refreshes Supabase session
   - Handles token refresh

2. **Layout Auth Check** (`(dashboard)/layout.tsx`)
   - Server-side auth verification
   - Redirects if not authenticated
   - Redirects if profile incomplete

3. **Row Level Security (RLS)**
   - Database-level security
   - Users can only access their own data

### **Auth Architecture**

```
Request
    ↓
[Middleware] updateSession()
    ↓ (if auth required)
[Layout] check auth.getUser()
    ↓ (if not authenticated)
redirect("/login")
    ↓ (if authenticated)
[Page] render content
```

### **Protected Routes**

All routes in `(dashboard)` group are automatically protected by layout.

**Manual protection** (if needed):
```tsx
// In any server component
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect("/login")
```

---

## 🗄️ Database Schema

### **Core Tables**

#### **profiles**
```sql
- id (uuid, PK) → auth.users.id
- email (text, unique)
- full_name (text)
- situation (enum)
- avatar_url (text)
- profile_completed (boolean)
```

#### **patients**
```sql
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- name (text)
- date_of_birth (date)
- condition (enum)
- autism_level (enum)
- status (enum)
- avatar_url (text)
```

#### **sessions**
```sql
- id (uuid, PK)
- patient_id (uuid, FK → patients)
- tool_type (text)
- duration_minutes (int)
- score (int)
- completed (boolean)
```

#### **patient_gamification**
```sql
- patient_id (uuid, PK, FK → patients)
- level (int)
- total_points (int)
- current_streak (int)
- achievements (text[])
```

#### **aac_boards**
```sql
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- patient_id (uuid, FK → patients)
- name (text)
- is_active (boolean)
```

#### **aac_cards**
```sql
- id (uuid, PK)
- board_id (uuid, FK → aac_boards)
- text (text)
- image_url (text)
- usage_count (int)
- is_favorite (boolean)
```

### **Relationships**

```
auth.users (Supabase)
    ↓ 1:1
profiles
    ↓ 1:N
patients
    ↓ 1:1
patient_gamification
    ↓ 1:N
sessions

auth.users
    ↓ 1:N
aac_boards
    ↓ 1:N
aac_cards
```

---

## 🔌 API Layer

### **Server Actions**

Server Actions are the primary API:

**Location:** `src/app/actions/`

#### **Auth Actions** (`auth.ts`)
```tsx
signUp(data) → AuthResult
signIn(data) → AuthResult
signOut() → AuthResult
resetPassword(email) → AuthResult
updatePassword(newPassword) → AuthResult
getCurrentUser() → User | null
completeProfile(data) → AuthResult
```

#### **Patient Actions** (`patients.ts`)
```tsx
getPatients() → ActionResult<PatientWithStats[]>
getPatient(id) → ActionResult<PatientWithStats>
createPatient(data) → ActionResult<Patient>
updatePatient(id, data) → ActionResult<Patient>
deletePatient(id) → ActionResult<void>
```

#### **AAC Actions** (`aac.ts`)
```tsx
getActiveAACBoard(patientId) → ActionResult<AACBoardWithData>
createAACBoard(data) → ActionResult<AACBoard>
updateAACBoard(id, data) → ActionResult<AACBoard>
createAACCard(data) → ActionResult<AACCard>
updateCardUsage(id) → ActionResult<void>
toggleCardFavorite(id) → ActionResult<void>
```

### **Client Usage**

```tsx
"use client"
import { createPatient } from "@/app/actions/patients"

async function handleSubmit() {
  const result = await createPatient(formData)
  if (result.success) {
    // Handle success
  } else {
    // Handle error: result.error
  }
}
```

### **Error Handling**

All actions return:
```tsx
interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}
```

---

## ✅ Best Practices

### **1. Component Design**

✅ **Do:**
- Keep components small (<200 lines)
- One component per file
- Use TypeScript interfaces
- Extract reusable logic to hooks

❌ **Don't:**
- Mix server and client logic
- Use `any` type
- Hardcode strings (use constants)

### **2. Server vs Client**

✅ **Use Server Components for:**
- Data fetching
- Backend logic
- Database queries
- SEO-critical content

✅ **Use Client Components for:**
- Interactivity (onClick, onChange)
- State management (useState)
- Browser APIs (localStorage)
- Third-party libraries requiring window

### **3. Data Fetching**

✅ **Do:**
- Fetch in Server Components
- Pass data to Client Components
- Use Server Actions for mutations
- Handle loading states

❌ **Don't:**
- Fetch in useEffect (causes hydration errors)
- Fetch in Client Components (unless necessary)

### **4. Type Safety**

✅ **Do:**
```tsx
import type { Patient } from "@/types/patient.types"

interface Props {
  patient: Patient
  onDelete: (id: string) => void
}
```

❌ **Don't:**
```tsx
// Bad: any types
function Component({ patient }: { patient: any }) {}
```

### **5. File Naming**

- **Components:** `PascalCase.tsx` or `kebab-case.tsx`
- **Utilities:** `camelCase.ts`
- **Types:** `kebab-case.types.ts`
- **Actions:** `kebab-case.ts`

### **6. Import Order**

```tsx
// 1. React & Next.js
import { useState } from "react"
import Image from "next/image"

// 2. Third-party
import { Button } from "@/components/ui/button"

// 3. Internal - Actions
import { createPatient } from "@/app/actions/patients"

// 4. Internal - Components
import { PatientCard } from "@/components/dashboard/patient-card"

// 5. Internal - Types
import type { Patient } from "@/types/patient.types"

// 6. Internal - Utils
import { cn } from "@/lib/utils"
```

---

## 🚀 Performance Optimization

### **1. Server Components**
- Reduce client JavaScript
- Faster initial load
- Better SEO

### **2. Loading States**
- Add `loading.tsx` for Suspense
- Show skeletons
- Improve perceived performance

### **3. Image Optimization**
- Use `next/image`
- Lazy load images
- Optimize formats (WebP)

### **4. Code Splitting**
- Dynamic imports for modals
- Route-based splitting (automatic)

---

## 📚 Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)

---

**Last Updated:** 2025-01-17
