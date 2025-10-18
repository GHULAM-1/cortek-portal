# 🔄 Component Extraction Guide

## ✅ **Golden Rule**

**NEVER use "use client" in `page.tsx` or `layout.tsx`**

Instead:
1. Create a client component in `src/components/{feature}/`
2. Import and use it in the server component page

---

## 📋 **Pattern to Follow**

### **❌ BAD (Current pattern):**

```tsx
// ❌ src/app/login/page.tsx
"use client"

export default function LoginPage() {
  const [state, setState] = useState()
  // ... interactive logic
  return <form>...</form>
}
```

### **✅ GOOD (New pattern):**

```tsx
// ✅ src/app/(auth)/login/page.tsx (Server Component)
import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login | MindTherapy"
}

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />  {/* Client component */}
    </div>
  )
}

// ✅ src/components/auth/login-form.tsx (Client Component)
"use client"

export function LoginForm() {
  const [state, setState] = useState()
  // ... interactive logic
  return <form>...</form>
}
```

---

## 📝 **Refactoring Checklist**

### **Pages Needing Refactoring:**

- [x] ✅ **login** → `components/auth/login-form.tsx`
- [ ] ⏳ **signup** → `components/auth/signup-form.tsx`
- [ ] ⏳ **onboarding** → `components/auth/onboarding-form.tsx`
- [ ] ⏳ **forgot-password** → `components/auth/forgot-password-form.tsx`
- [ ] ⏳ **reset-password** → `components/auth/reset-password-form.tsx`
- [ ] ⏳ **confirm-email** → `components/auth/confirm-email-content.tsx`
- [ ] ⏳ **settings** → `components/settings/settings-form.tsx`
- [ ] ⏳ **aac** → `components/aac/aac-board.tsx`
- [x] ✅ **dashboard** → `components/dashboard/dashboard-client.tsx`
- [ ] ⏳ **patient/[id]** → `components/patient/patient-detail.tsx`
- [ ] ⏳ **patient/[id]/play** → `components/patient/play-content.tsx`
- [ ] ⏳ **landing (/)** → `components/marketing/landing-content.tsx`

---

## 🛠️ **Step-by-Step Refactoring Process**

### **For Each Page:**

#### **Step 1: Read Current Page**
```bash
# Check current structure
cat src/app/{page}/page.tsx | head -20
```

#### **Step 2: Create Client Component**
```tsx
// src/components/{feature}/{name}-form.tsx
"use client"

export function {Name}Form() {
  // Copy all client logic here
  const [state, setState] = useState()

  // Copy all handlers
  const handleSubmit = async () => { ... }

  // Copy JSX
  return (
    <div>...</div>
  )
}
```

#### **Step 3: Create Server Page**
```tsx
// src/app/({group})/{page}/page.tsx
import { {Name}Form } from "@/components/{feature}/{name}-form"

export const metadata = {
  title: "{Title} | MindTherapy",
  description: "..."
}

export default function {Name}Page() {
  // Optional: Fetch server data here

  return (
    <div>
      <h1>{Title}</h1>
      <{Name}Form />
    </div>
  )
}
```

#### **Step 4: Test**
```bash
npm run dev
# Visit page and verify it works
```

---

## 📦 **Component Organization**

```
src/components/
├── auth/              # Authentication components
│   ├── login-form.tsx
│   ├── signup-form.tsx
│   ├── onboarding-form.tsx
│   ├── forgot-password-form.tsx
│   ├── reset-password-form.tsx
│   └── confirm-email-content.tsx
│
├── dashboard/         # Dashboard components
│   ├── dashboard-client.tsx
│   ├── dashboard-stats.tsx
│   ├── dashboard-header.tsx
│   └── ...
│
├── patient/           # Patient components
│   ├── patient-detail.tsx
│   ├── play-content.tsx
│   └── ...
│
├── aac/               # AAC components
│   └── aac-board.tsx
│
├── settings/          # Settings components
│   └── settings-form.tsx
│
├── marketing/         # Landing page components
│   └── landing-content.tsx
│
└── shared/            # Shared components
    ├── app-header.tsx
    └── auth-header.tsx
```

---

## 🎯 **Examples**

### **Example 1: Login Page** ✅ DONE

**Before:**
```tsx
// src/app/login/page.tsx
"use client"
export default function LoginPage() { ... }
```

**After:**
```tsx
// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/login-form"
export default function LoginPage() {
  return <LoginForm />
}

// src/components/auth/login-form.tsx
"use client"
export function LoginForm() { ... }
```

---

### **Example 2: Signup Page** ⏳ TODO

**Current:**
```tsx
// src/app/signup/page.tsx (275 lines)
"use client"
export default function RegistoPage() { ... }
```

**Target:**
```tsx
// src/app/(auth)/signup/page.tsx
import { SignupForm } from "@/components/auth/signup-form"

export const metadata = {
  title: "Criar Conta | MindTherapy",
  description: "Crie a sua conta MindTherapy"
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <SignupForm />
      </div>
    </div>
  )
}

// src/components/auth/signup-form.tsx (copy logic from page.tsx)
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp } from "@/app/actions/auth"

export function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({ ... })

  // ... rest of logic from original page.tsx

  return (
    <form>...</form>
  )
}
```

---

### **Example 3: Settings Page** ⏳ TODO

**Current:**
```tsx
// src/app/settings/page.tsx
"use client"
export default function SettingsPage() { ... }
```

**Target:**
```tsx
// src/app/(dashboard)/settings/page.tsx
import { SettingsForm } from "@/components/settings/settings-form"

export default function SettingsPage() {
  return <SettingsForm />
}

// src/components/settings/settings-form.tsx
"use client"
export function SettingsForm() { ... }
```

---

## 🔍 **What to Extract**

### **Always Extract (Client-only):**
- ✅ `useState`, `useEffect`, `useRouter`
- ✅ Event handlers (`onClick`, `onChange`, `onSubmit`)
- ✅ Form validation logic
- ✅ Interactive UI state
- ✅ Browser APIs (`localStorage`, `window`)

### **Keep in Server Component:**
- ✅ `metadata` export
- ✅ Data fetching (`await getData()`)
- ✅ Database queries
- ✅ Server Actions calls (if not in form)
- ✅ Static content/layout

---

## ⚠️ **Common Mistakes**

### **❌ Mistake 1: Adding "use client" to page.tsx**
```tsx
// ❌ BAD
"use client"
export default function Page() { ... }
```

### **❌ Mistake 2: Not extracting interactive logic**
```tsx
// ❌ BAD - useState in server component
export default function Page() {
  const [state, setState] = useState() // ERROR!
}
```

### **❌ Mistake 3: Fetching data in client component**
```tsx
// ❌ BAD
"use client"
export function Form() {
  useEffect(() => {
    fetchData() // Hydration error!
  }, [])
}
```

### **✅ Correct Pattern:**
```tsx
// ✅ GOOD - Server Component fetches
export default async function Page() {
  const data = await fetchData() // Server
  return <ClientForm data={data} />
}

// ✅ GOOD - Client receives data
"use client"
export function ClientForm({ data }) {
  const [state, setState] = useState(data)
}
```

---

## 📚 **Quick Reference**

| File Type | "use client"? | Purpose |
|-----------|---------------|---------|
| `page.tsx` | ❌ NEVER | Server Component - fetch data |
| `layout.tsx` | ❌ NEVER | Server Component - structure |
| `loading.tsx` | ❌ NO | Server Component - loading state |
| `error.tsx` | ✅ YES | Must be client (error boundary) |
| `components/{feature}/` | ✅ IF NEEDED | Client if interactive |

---

## 🚀 **Benefits**

1. ✅ **No Hydration Errors** - Server data fetching
2. ✅ **Better SEO** - Server-rendered HTML
3. ✅ **Faster Initial Load** - Less client JavaScript
4. ✅ **Better Organization** - Clear separation
5. ✅ **Type Safety** - Props are typed

---

## 📝 **Next Steps**

1. Read this guide
2. Start with one page (e.g., signup)
3. Follow the pattern
4. Test thoroughly
5. Move to next page
6. Repeat until all pages are refactored

---

**Last Updated:** 2025-01-17
