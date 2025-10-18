# ✅ MindTherapy Migration Checklist

## 🎯 Goal: Migrate to New Refactored Structure (Zero Downtime)

---

## 📋 **Phase 1: Preparation** (Do First!)

- [ ] **Backup everything**
  ```bash
  git add .
  git commit -m "backup: before refactoring migration"
  git branch backup-before-refactor
  ```

- [ ] **Verify new structure exists**
  ```bash
  ls src/app/(marketing)
  ls src/app/(auth)
  ls src/app/(dashboard)
  ls src/components/dashboard
  ```

- [ ] **Read REFACTORING_GUIDE.md** completely

- [ ] **Test current app** (make sure everything works before migration)
  - [ ] Login works
  - [ ] Dashboard loads
  - [ ] Patient CRUD works

---

## 📦 **Phase 2: Install Providers** (Safe to do)

- [ ] **Update root layout** to use new providers:

```tsx
// src/app/layout.tsx
import { Providers } from "./providers"

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Test:** App still works with providers wrapper

---

## 🏗️ **Phase 3: Migrate Routes** (One at a time!)

### **Step 3.1: Marketing Pages**

- [ ] **Move landing page:**
  ```bash
  # Keep old one, test new one first
  cp src/app/page.tsx src/app/(marketing)/page.tsx
  ```

- [ ] **Update internal links** in landing page:
  - [ ] `/login` → `/login` (stays same)
  - [ ] `/signup` → `/signup` (stays same)
  - [ ] `/dashboard` → `/dashboard` (stays same)

- [ ] **Test:** Visit `http://localhost:3000` → landing page loads

- [ ] **If works:** Delete old file
  ```bash
  rm src/app/page.tsx
  ```

---

### **Step 3.2: Auth Pages**

- [ ] **Move login page:**
  ```bash
  cp -r src/app/login src/app/(auth)/login
  ```

- [ ] **Move signup page:**
  ```bash
  cp -r src/app/signup src/app/(auth)/signup
  ```

- [ ] **Move forgot-password:**
  ```bash
  cp -r src/app/forgot-password src/app/(auth)/forgot-password
  ```

- [ ] **Move onboarding:**
  ```bash
  cp -r src/app/onboarding src/app/(auth)/onboarding
  ```

- [ ] **Update redirect paths** in auth actions if needed
  - Check `src/app/actions/auth.ts`
  - Paths should still work (route groups don't change URLs)

- [ ] **Test auth flow:**
  - [ ] Signup works
  - [ ] Login works
  - [ ] Password reset works
  - [ ] Onboarding works

- [ ] **If works:** Delete old auth folders
  ```bash
  rm -rf src/app/login
  rm -rf src/app/signup
  rm -rf src/app/forgot-password
  rm -rf src/app/onboarding
  ```

---

### **Step 3.3: Dashboard (MOST IMPORTANT!)**

This is the critical migration that fixes hydration errors.

- [ ] **Backup current dashboard:**
  ```bash
  cp src/app/dashboard/page.tsx src/app/dashboard/page.tsx.old-working
  ```

- [ ] **Copy new dashboard structure:**
  ```bash
  # The new files are already in src/app/(dashboard)/dashboard/
  # Just need to verify they exist
  ls src/app/(dashboard)/dashboard/page.tsx
  ls src/components/dashboard/dashboard-client.tsx
  ```

- [ ] **Update any internal links in the app** to use dashboard:
  - Links to `/dashboard` still work
  - Links to `/aac` should be `/aac`
  - Links to `/settings` should be `/settings`

- [ ] **Test new dashboard:**
  - [ ] Go to `/dashboard`
  - [ ] Check console for hydration errors (should be GONE! ✅)
  - [ ] Stats cards display correctly
  - [ ] Patient list loads
  - [ ] Search works
  - [ ] Filter works
  - [ ] Add patient modal opens
  - [ ] Edit patient works
  - [ ] Delete patient works

- [ ] **If everything works:** Delete old dashboard
  ```bash
  rm -rf src/app/dashboard
  ```

---

### **Step 3.4: Other Dashboard Pages**

- [ ] **Move AAC page:**
  ```bash
  cp -r src/app/aac src/app/(dashboard)/aac
  ```
  - [ ] Test: `/aac` works

- [ ] **Move Settings page:**
  ```bash
  cp -r src/app/settings src/app/(dashboard)/settings
  ```
  - [ ] Test: `/settings` works

- [ ] **If works:** Delete old folders
  ```bash
  rm -rf src/app/aac
  rm -rf src/app/settings
  ```

---

## 🧹 **Phase 4: Cleanup** (After everything works!)

- [ ] **Remove backup files:**
  ```bash
  rm src/app/dashboard/page.tsx.backup
  rm src/app/dashboard/_page_server.tsx
  rm src/app/dashboard/_components/DashboardClient.tsx
  rm src/app/partners.txt
  ```

- [ ] **Remove old dashboard backup:**
  ```bash
  rm src/app/dashboard/page.tsx.old-working
  ```

- [ ] **Verify no broken imports:**
  ```bash
  npm run build
  ```

- [ ] **Run linter:**
  ```bash
  npm run lint
  ```

---

## 🧪 **Phase 5: Comprehensive Testing**

### **5.1 Authentication Flow**

- [ ] **Landing page** (`/`)
  - [ ] Loads correctly
  - [ ] All sections visible
  - [ ] CTA buttons work
  - [ ] No console errors

- [ ] **Signup** (`/signup`)
  - [ ] Form validation works
  - [ ] Can create account
  - [ ] Redirects to onboarding

- [ ] **Onboarding** (`/onboarding`)
  - [ ] Form loads
  - [ ] Can complete profile
  - [ ] Redirects to dashboard

- [ ] **Login** (`/login`)
  - [ ] Can login
  - [ ] Redirects to dashboard
  - [ ] Wrong password shows error

---

### **5.2 Dashboard Functionality**

- [ ] **Dashboard Main** (`/dashboard`)
  - [ ] **NO HYDRATION ERRORS in console** ✅
  - [ ] Stats cards show correct numbers
  - [ ] Patient list displays
  - [ ] Sidebar navigation works
  - [ ] Search works
  - [ ] Filter works

- [ ] **Patient Management**
  - [ ] Add patient modal opens
  - [ ] Can create new patient
  - [ ] Avatar upload works
  - [ ] New patient appears in list
  - [ ] Can edit patient
  - [ ] Can delete patient (with confirmation)

- [ ] **AAC Page** (`/aac`)
  - [ ] Loads correctly
  - [ ] Communication cards work
  - [ ] Text-to-speech works

- [ ] **Settings** (`/settings`)
  - [ ] Profile update works
  - [ ] Theme toggle works
  - [ ] Notifications settings work

---

### **5.3 Edge Cases**

- [ ] **Direct URL access**
  - [ ] `/dashboard` when not logged in → redirects to `/login`
  - [ ] `/login` when logged in → redirects to `/dashboard`
  - [ ] `/onboarding` when profile complete → redirects to `/dashboard`

- [ ] **Browser refresh**
  - [ ] Refresh on dashboard → stays on dashboard
  - [ ] Refresh on patient page → stays on patient page

- [ ] **Back/Forward navigation**
  - [ ] Browser back button works correctly
  - [ ] Browser forward button works correctly

---

## 📊 **Phase 6: Performance Check**

- [ ] **Run Lighthouse audit**
  - [ ] Performance > 80
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90

- [ ] **Check bundle size**
  ```bash
  npm run build
  # Check .next/static/chunks size
  ```

- [ ] **Verify SSR**
  - [ ] View page source on `/dashboard`
  - [ ] Should see rendered HTML (not just loading spinner)

---

## 🚀 **Phase 7: Deployment**

- [ ] **Build succeeds**
  ```bash
  npm run build
  ```

- [ ] **No build errors or warnings**

- [ ] **Deploy to staging first**
  - [ ] Test everything in staging
  - [ ] Get team approval

- [ ] **Deploy to production**
  ```bash
  git add .
  git commit -m "refactor: migrate to route groups and server components"
  git push
  ```

- [ ] **Monitor production**
  - [ ] Check error logs
  - [ ] Check analytics
  - [ ] Check user feedback

---

## 🎉 **Success Criteria**

✅ All checkboxes above are ticked
✅ No hydration errors in console
✅ All functionality works as before
✅ Performance is improved
✅ Code is better organized
✅ Team is happy 😊

---

## 🆘 **Rollback Plan** (If something breaks)

```bash
# Rollback to backup
git reset --hard backup-before-refactor
git push -f origin main  # Only if needed

# Or restore specific file
git checkout backup-before-refactor -- src/app/dashboard/page.tsx
```

---

## 📝 **Notes**

- **URL structure doesn't change** - Route groups are invisible
- **Old files work alongside new** - Safe to test incrementally
- **Test in dev first** - Don't rush to production
- **Keep backups** - Until 100% confident

---

## ✨ **Post-Migration Improvements** (Optional)

- [ ] Add error boundaries
- [ ] Add loading skeletons everywhere
- [ ] Add Suspense boundaries
- [ ] Optimize images with next/image
- [ ] Add E2E tests with Playwright
- [ ] Add unit tests for components
- [ ] Add Storybook for component documentation

---

**You've got this! 💪**

Remember: Test incrementally, keep backups, and don't rush!
