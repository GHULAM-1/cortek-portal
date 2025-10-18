# 🔧 MindTherapy Refactoring Guide

## 📋 Overview

This guide explains the new refactored architecture that fixes hydration errors, improves code organization, and follows Next.js 15 best practices.

---

## 🏗️ **New Architecture**

### **Route Groups Structure**

```
src/app/
├── (marketing)/          # Public pages
│   ├── page.tsx          # Landing page
│   └── layout.tsx        # Marketing layout
│
├── (auth)/               # Authentication pages
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   ├── onboarding/
│   └── layout.tsx        # Auth layout (with AuthHeader)
│
├── (dashboard)/          # Authenticated app pages
│   ├── dashboard/
│   │   ├── page.tsx      # Server Component (fixes hydration!)
│   │   └── loading.tsx   # Loading state
│   ├── aac/
│   ├── settings/
│   └── layout.tsx        # Dashboard layout (with auth check)
│
├── actions/              # Server Actions (keep as is)
├── providers.tsx         # Root providers wrapper
└── layout.tsx            # Root layout
```

---

## 🔑 **Key Changes**

### **1. Route Groups**

Route groups `(name)` don't affect the URL but allow different layouts:

- **(marketing)** - Public pages without auth
- **(auth)** - Auth pages with AuthHeader
- **(dashboard)** - Protected pages with auth check

### **2. Dashboard Server Component** ✅

**OLD (Causes hydration error):**
```tsx
// src/app/dashboard/page.tsx
"use client"
export default function Dashboard() {
  useEffect(() => {
    // Fetch data client-side
  }, [])
}
```

**NEW (Fixed):**
```tsx
// src/app/(dashboard)/dashboard/page.tsx
export default async function DashboardPage() {
  const patients = await getPatients() // Server-side
  return <DashboardClient initialPatients={patients} />
}
```

### **3. Modular Components**

Dashboard UI is now split into reusable components:

```
src/components/dashboard/
├── dashboard-client.tsx     # Main client wrapper
├── dashboard-stats.tsx      # Stats cards
├── dashboard-header.tsx     # Header with search
├── dashboard-sidebar.tsx    # Navigation sidebar
├── patients-list.tsx        # Patient grid
├── patient-card.tsx         # Individual card
├── add-patient-modal.tsx    # Add modal
└── edit-patient-modal.tsx   # Edit modal
```

### **4. Providers System**

Centralized context providers:

```tsx
// src/app/providers.tsx
export function Providers({ children }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </ThemeProvider>
  )
}
```

---

## 📦 **Component Organization**

### **Naming Convention:**

- **Server Components**: No "use client", async functions
- **Client Components**: "use client", interactive UI
- **Shared Components**: `src/components/shared/`
- **Feature Components**: `src/components/{feature}/`

### **Import Aliases:**

```tsx
@/components      → src/components
@/lib             → src/lib
@/types           → src/types
@/app             → src/app
```

---

## 🚀 **Migration Steps**

### **Step 1: Update Root Layout** (Optional)

```tsx
// src/app/layout.tsx
import { Providers } from "./providers"

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### **Step 2: Move Landing Page**

```bash
# Move landing page to marketing route group
mv src/app/page.tsx src/app/(marketing)/page.tsx
```

### **Step 3: Move Auth Pages**

```bash
# Move all auth pages
mv src/app/login src/app/(auth)/login
mv src/app/signup src/app/(auth)/signup
mv src/app/forgot-password src/app/(auth)/forgot-password
mv src/app/onboarding src/app/(auth)/onboarding
```

### **Step 4: Move Dashboard Pages**

```bash
# Move dashboard pages
mv src/app/dashboard src/app/(dashboard)/dashboard
mv src/app/aac src/app/(dashboard)/aac
mv src/app/settings src/app/(dashboard)/settings
```

### **Step 5: Update Dashboard**

Replace `src/app/(dashboard)/dashboard/page.tsx` with new server component version.

### **Step 6: Test Everything**

1. Run dev server: `npm run dev`
2. Test auth flow: Login → Onboarding → Dashboard
3. Test patient CRUD: Add → Edit → Delete
4. Test AAC page
5. Test settings

---

## 🔄 **Old vs New Structure**

| Feature | Old | New |
|---------|-----|-----|
| Dashboard | Client component with useEffect | Server component with SSR |
| Layouts | Single layout for all | Route groups with specific layouts |
| Auth check | In each page | In layout |
| Components | Flat structure (63 files) | Organized by feature |
| Providers | Hardcoded | Centralized wrapper |
| Hydration | ❌ Errors | ✅ Fixed |

---

## ✅ **Benefits**

1. ✅ **No more hydration errors** - Server data fetching
2. ✅ **Better SEO** - Server-side rendering
3. ✅ **Faster initial load** - Less client JS
4. ✅ **Better organization** - Route groups & feature folders
5. ✅ **Reusable components** - Modular dashboard
6. ✅ **Type safety** - Proper TypeScript interfaces
7. ✅ **Easier maintenance** - Clear separation of concerns

---

## 🧪 **Testing Checklist**

- [ ] Landing page loads
- [ ] Sign up flow works
- [ ] Login works
- [ ] Onboarding completes
- [ ] Dashboard loads without errors
- [ ] Patient CRUD works
- [ ] AAC page works
- [ ] Settings page works
- [ ] Theme switching works
- [ ] Notifications work

---

## 📚 **File Mapping**

### **Old → New Locations:**

```
OLD: src/app/page.tsx
NEW: src/app/(marketing)/page.tsx

OLD: src/app/login/page.tsx
NEW: src/app/(auth)/login/page.tsx

OLD: src/app/dashboard/page.tsx (86KB client component)
NEW: src/app/(dashboard)/dashboard/page.tsx (server)
     + src/components/dashboard/* (client components)

OLD: src/app/dashboard/_page_server.tsx (incomplete)
NEW: (deleted - replaced by proper server component)

OLD: src/app/dashboard/page.tsx.backup
NEW: (can be deleted after migration)
```

---

## 🛠️ **Troubleshooting**

### **Issue: 404 on /dashboard**

**Fix:** Make sure route group folder is `(dashboard)` with parentheses

### **Issue: Auth check runs twice**

**Fix:** Remove auth check from page.tsx, it's in layout.tsx now

### **Issue: Components not found**

**Fix:** Update imports from `@/components/...` to new paths

### **Issue: Hydration mismatch**

**Fix:** Make sure server component fetches data, passes to client

---

## 📝 **Next Steps**

After successful migration:

1. ✅ Test thoroughly
2. ✅ Remove old backup files
3. ✅ Update documentation
4. ✅ Consider adding error boundaries
5. ✅ Add loading states
6. ✅ Add Suspense boundaries
7. ✅ Optimize images
8. ✅ Add E2E tests

---

## 🎯 **Quick Migration Command**

If you want to migrate everything at once:

```bash
# Backup current state
git add .
git commit -m "backup: before refactoring"

# The new structure is ready in parallel
# Just update the URLs to use route groups:
# - /dashboard → stays same (route groups are invisible in URL)
# - /login → stays same
# - Components import from new paths
```

---

## 💡 **Pro Tips**

1. **Test incrementally** - Move one route group at a time
2. **Keep old files** - Until new ones are verified
3. **Use Loading states** - Add loading.tsx for better UX
4. **Error boundaries** - Add error.tsx for error handling
5. **Metadata** - Add SEO metadata to each page

---

## 📞 **Support**

For questions or issues during migration:
- Check Next.js 15 docs: https://nextjs.org/docs
- Review this guide
- Test in dev mode first

---

**Happy Refactoring! 🚀**
