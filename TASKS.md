# TASKS - CRM_Alma Project
## Complete Action Plan

**Generated**: 2025-11-25
**Total Tasks**: 67
**Estimated Total Effort**: 80-120 hours

---

## P0 - CRITICAL (Do Immediately)

### Security

- [ ] **TASK-001**: Revoke all compromised credentials in Supabase Dashboard
  - File: Supabase Dashboard
  - Priority: CRITICAL
  - Estimated: 15 min

- [ ] **TASK-002**: Generate new DATABASE_URL credentials
  - File: Supabase Dashboard
  - Priority: CRITICAL
  - Estimated: 10 min

- [ ] **TASK-003**: Generate new JWT_SECRET
  - File: `.env`
  - Priority: CRITICAL
  - Estimated: 5 min

- [ ] **TASK-004**: Generate new SUPABASE_SERVICE_ROLE_KEY
  - File: Supabase Dashboard
  - Priority: CRITICAL
  - Estimated: 10 min

- [ ] **TASK-005**: Purge `.env` from git history
  - Command: `git filter-branch --tree-filter 'rm -f .env' HEAD` or use BFG
  - Priority: CRITICAL
  - Estimated: 30 min

- [ ] **TASK-006**: Install and configure git-secrets pre-commit hook
  - Command: `brew install git-secrets && git secrets --install`
  - Priority: CRITICAL
  - Estimated: 30 min

- [ ] **TASK-007**: Add AWS/generic secret patterns to git-secrets
  - Command: `git secrets --register-aws`
  - Priority: CRITICAL
  - Estimated: 15 min

---

## P1 - HIGH PRIORITY (This Week)

### React Hooks Fixes

- [ ] **TASK-008**: Fix setState in useEffect - PipelineBoard.tsx:298
  - File: `src/components/pipeline/PipelineBoard.tsx`
  - Line: 298
  - Action: Use useState lazy initialization instead of useEffect setState
  - Estimated: 30 min

- [ ] **TASK-009**: Fix setState in useEffect - PipelineBoard.tsx:318
  - File: `src/components/pipeline/PipelineBoard.tsx`
  - Line: 318
  - Action: Refactor to avoid cascading renders
  - Estimated: 30 min

- [ ] **TASK-010**: Fix setState in useEffect - Tooltip.tsx:83
  - File: `src/components/ui/Tooltip.tsx`
  - Line: 83
  - Action: Use useLayoutEffect or lazy state initialization
  - Estimated: 20 min

- [ ] **TASK-011**: Fix ref access during render - Dropdown.tsx:83-104
  - File: `src/components/ui/Dropdown.tsx`
  - Lines: 83-104
  - Action: Move triggerRef.current access to useEffect, use state for menuWidth
  - Estimated: 45 min

### TypeScript Fixes

- [ ] **TASK-012**: Remove `any` type - useCompanies.ts:9
  - File: `src/hooks/useCompanies.ts`
  - Line: 9
  - Action: Define proper Company interface for useFetch generic
  - Estimated: 20 min

- [ ] **TASK-013**: Remove `any` type - useContacts.ts:9
  - File: `src/hooks/useContacts.ts`
  - Line: 9
  - Action: Define proper Contact interface for useFetch generic
  - Estimated: 20 min

- [ ] **TASK-014**: Remove `any` type - useConversations.ts:9
  - File: `src/hooks/useConversations.ts`
  - Line: 9
  - Action: Define proper Conversation interface for useFetch generic
  - Estimated: 20 min

- [ ] **TASK-015**: Remove `any` type - useLeads.ts:9
  - File: `src/hooks/useLeads.ts`
  - Line: 9
  - Action: Define proper Lead interface for useFetch generic
  - Estimated: 20 min

- [ ] **TASK-016**: Remove `any` type - messages/route.ts:79
  - File: `src/app/api/messages/route.ts`
  - Line: 79
  - Action: Define proper type for message payload
  - Estimated: 15 min

- [ ] **TASK-017**: Remove `any` type - evolution-api.ts:36
  - File: `src/lib/evolution-api.ts`
  - Line: 36
  - Action: Define proper API response interface
  - Estimated: 15 min

- [ ] **TASK-018**: Remove `any` types - types/index.ts:178,179
  - File: `src/types/index.ts`
  - Lines: 178, 179
  - Action: Define proper generic types
  - Estimated: 20 min

### Code Architecture

- [ ] **TASK-019**: Create withTenant higher-order function for API routes
  - File: `src/lib/api-handlers.ts` (new)
  - Action: Extract tenant lookup pattern to reusable function
  - Estimated: 1 hour

- [ ] **TASK-020**: Refactor contacts/route.ts to use withTenant
  - File: `src/app/api/contacts/route.ts`
  - Estimated: 20 min

- [ ] **TASK-021**: Refactor companies/route.ts to use withTenant
  - File: `src/app/api/companies/route.ts`
  - Estimated: 20 min

- [ ] **TASK-022**: Refactor leads/route.ts to use withTenant
  - File: `src/app/api/leads/route.ts`
  - Estimated: 20 min

- [ ] **TASK-023**: Refactor pipelines/route.ts to use withTenant
  - File: `src/app/api/pipelines/route.ts`
  - Estimated: 20 min

- [ ] **TASK-024**: Refactor deals/route.ts to use withTenant
  - File: `src/app/api/deals/[id]/route.ts`
  - Estimated: 20 min

- [ ] **TASK-025**: Refactor conversations/route.ts to use withTenant
  - File: `src/app/api/conversations/route.ts`
  - Estimated: 20 min

- [ ] **TASK-026**: Refactor messages/route.ts to use withTenant
  - File: `src/app/api/messages/route.ts`
  - Estimated: 20 min

- [ ] **TASK-027**: Refactor webhooks/whatsapp/route.ts to use withTenant
  - File: `src/app/api/webhooks/whatsapp/route.ts`
  - Estimated: 20 min

---

## P2 - MEDIUM PRIORITY (Next Sprint)

### Tailwind/Design System Fixes

- [ ] **TASK-028**: Add animate-shimmer animation to tailwind.config.ts
  - File: `tailwind.config.ts`
  - Action: Add shimmer keyframes and animation
  - Estimated: 15 min

- [ ] **TASK-029**: Add slideInRight animation to tailwind.config.ts
  - File: `tailwind.config.ts`
  - Action: Add slideInRight keyframes
  - Estimated: 10 min

- [ ] **TASK-030**: Add slideInLeft animation to tailwind.config.ts
  - File: `tailwind.config.ts`
  - Action: Add slideInLeft keyframes
  - Estimated: 10 min

- [ ] **TASK-031**: Remove inline style animations from Modal.tsx
  - File: `src/components/ui/Modal.tsx`
  - Lines: 250-302
  - Action: Replace JSX style with Tailwind animation classes
  - Estimated: 30 min

- [ ] **TASK-032**: Refactor Avatar.tsx to use design system colors
  - File: `src/components/ui/Avatar.tsx`
  - Lines: 30-44
  - Action: Replace blue-500, emerald-500 etc with design tokens
  - Estimated: 45 min

- [ ] **TASK-033**: Add danger-hover and danger-active colors to theme
  - File: `tailwind.config.ts`
  - Action: Add hover/active variants for danger color
  - Estimated: 15 min

- [ ] **TASK-034**: Add success-hover and success-active colors to theme
  - File: `tailwind.config.ts`
  - Action: Add hover/active variants for success color
  - Estimated: 15 min

- [ ] **TASK-035**: Update Button.tsx danger variant to use design tokens
  - File: `src/components/ui/Button.tsx`
  - Line: 16
  - Action: Replace hover:bg-red-600 with hover:bg-danger-hover
  - Estimated: 10 min

- [ ] **TASK-036**: Update Button.tsx success variant to use design tokens
  - File: `src/components/ui/Button.tsx`
  - Line: 20
  - Action: Replace hover:bg-emerald-600 with hover:bg-success-hover
  - Estimated: 10 min

- [ ] **TASK-037**: Add channel-specific colors to Tailwind theme
  - File: `tailwind.config.ts`
  - Action: Create channel color group for WhatsApp, Email, Instagram etc
  - Estimated: 30 min

- [ ] **TASK-038**: Update Badge.tsx channelMap to use theme colors
  - File: `src/components/ui/Badge.tsx`
  - Lines: 107-113
  - Action: Replace hardcoded colors with theme references
  - Estimated: 20 min

### React/Performance Fixes

- [ ] **TASK-039**: Fix impure Math.random() in Skeleton.tsx
  - File: `src/components/ui/Skeleton.tsx`
  - Line: 329
  - Action: Generate random values in useState or useMemo
  - Estimated: 20 min

- [ ] **TASK-040**: Fix ChatArea.tsx useEffect dependencies
  - File: `src/components/inbox/ChatArea.tsx`
  - Line: 40
  - Action: Include full conversation object in dependency array
  - Estimated: 15 min

### Security Fixes

- [ ] **TASK-041**: Fix CSRF cookie httpOnly flag
  - File: `src/middleware.ts`
  - Line: 54
  - Action: Change httpOnly: false to httpOnly: true
  - Estimated: 5 min

- [ ] **TASK-042**: Add security headers to Next.js config
  - File: `next.config.ts`
  - Action: Add headers() function with CSP, X-Frame-Options, X-Content-Type-Options
  - Estimated: 30 min

### Code Duplication Fixes

- [ ] **TASK-043**: Create generic ListPage component
  - File: `src/components/common/ListPage.tsx` (new)
  - Action: Extract shared list pattern from ContactList, CompanyList, LeadList
  - Estimated: 2 hours

- [ ] **TASK-044**: Refactor ContactList.tsx to use ListPage
  - File: `src/components/contacts/ContactList.tsx`
  - Estimated: 45 min

- [ ] **TASK-045**: Refactor CompanyList.tsx to use ListPage
  - File: `src/components/companies/CompanyList.tsx`
  - Estimated: 45 min

- [ ] **TASK-046**: Refactor LeadList.tsx to use ListPage
  - File: `src/components/leads/LeadList.tsx`
  - Estimated: 45 min

- [ ] **TASK-047**: Create generic CRUD hook factory
  - File: `src/hooks/createEntityHooks.ts` (new)
  - Action: Replace 5 similar hooks with factory function
  - Estimated: 2 hours

- [ ] **TASK-048**: Create centralized query keys factory
  - File: `src/lib/query-keys.ts` (new)
  - Action: Standardize query key patterns across all hooks
  - Estimated: 1 hour

---

## P3 - LOW PRIORITY (Technical Debt)

### Unused Code Cleanup

- [ ] **TASK-049**: Remove unused 'Check' import - pipelines/page.tsx
  - File: `src/app/(dashboard)/settings/pipelines/page.tsx`
  - Line: 4
  - Estimated: 2 min

- [ ] **TASK-050**: Remove unused 'Calendar' import - CompanyDetailSheet.tsx
  - File: `src/components/companies/CompanyDetailSheet.tsx`
  - Line: 4
  - Estimated: 2 min

- [ ] **TASK-051**: Remove unused 'Loader2' import - InboxLayout.tsx
  - File: `src/components/inbox/InboxLayout.tsx`
  - Line: 4
  - Estimated: 2 min

- [ ] **TASK-052**: Remove unused 'getContactName' variable - ConversationList.tsx
  - File: `src/components/inbox/ConversationList.tsx`
  - Line: 42
  - Estimated: 2 min

- [ ] **TASK-053**: Remove unused 'error' variable - Sidebar.tsx
  - File: `src/components/layout/Sidebar.tsx`
  - Line: 44
  - Estimated: 2 min

- [ ] **TASK-054**: Remove unused 'toast' variable - PipelineBoard.tsx
  - File: `src/components/pipeline/PipelineBoard.tsx`
  - Line: 275
  - Estimated: 2 min

- [ ] **TASK-055**: Remove unused 'get' function - authStore.ts
  - File: `src/stores/authStore.ts`
  - Line: 22
  - Estimated: 2 min

- [ ] **TASK-056**: Run ESLint --fix to auto-remove remaining unused imports
  - Command: `npx eslint . --fix`
  - Estimated: 10 min

### Code Quality

- [ ] **TASK-057**: Remove unnecessary useCallback - ContactList.tsx
  - File: `src/components/contacts/ContactList.tsx`
  - Lines: 23-30
  - Action: Convert safeParseArray to regular function
  - Estimated: 5 min

- [ ] **TASK-058**: Remove unnecessary useMemo - InboxLayout.tsx
  - File: `src/components/inbox/InboxLayout.tsx`
  - Line: 47
  - Action: Replace useMemo with direct .find() call
  - Estimated: 5 min

- [ ] **TASK-059**: Fix unescaped HTML entities - pipelines/page.tsx
  - File: `src/app/(dashboard)/settings/pipelines/page.tsx`
  - Line: 234
  - Action: Replace " with &quot;
  - Estimated: 5 min

### Import Organization

- [ ] **TASK-060**: Create .prettierrc with import ordering rules
  - File: `.prettierrc` (new or update)
  - Action: Configure @trivago/prettier-plugin-sort-imports
  - Estimated: 30 min

- [ ] **TASK-061**: Run Prettier across all files
  - Command: `npx prettier --write "src/**/*.{ts,tsx}"`
  - Estimated: 10 min

### Design Token Consistency

- [ ] **TASK-062**: Add arbitrary width values to Tailwind theme
  - File: `tailwind.config.ts`
  - Action: Add spacing values for 120, 260, 320, 400
  - Estimated: 15 min

- [ ] **TASK-063**: Replace min-w-[320px] with design token
  - Files: Multiple (PipelineBoard.tsx, Skeleton.tsx)
  - Estimated: 15 min

- [ ] **TASK-064**: Replace text-[10px] with design token
  - Files: Badge.tsx, Sidebar.tsx
  - Estimated: 10 min

### Focus State Standardization

- [ ] **TASK-065**: Audit all focus: classes and convert to focus-visible:
  - Files: All interactive components
  - Action: Standardize to focus-visible for keyboard-only focus
  - Estimated: 1 hour

### Project Structure

- [ ] **TASK-066**: Create src/constants/index.ts for magic values
  - File: `src/constants/index.ts` (new)
  - Action: Extract TENANT_DOMAIN, API_TIMEOUT, TOAST_DURATION etc
  - Estimated: 30 min

- [ ] **TASK-067**: Create src/utils/index.ts for helper functions
  - File: `src/utils/index.ts` (new)
  - Action: Extract safeParseJSON, formatCurrency, formatPhone
  - Estimated: 45 min

---

## OPTIONAL ENHANCEMENTS

### Performance

- [ ] **TASK-OPT-001**: Add React Query devtools for debugging
  - Package: `@tanstack/react-query-devtools`
  - Estimated: 15 min

- [ ] **TASK-OPT-002**: Implement virtual scrolling for large lists
  - Package: `@tanstack/react-virtual`
  - Estimated: 4 hours

- [ ] **TASK-OPT-003**: Add bundle analyzer
  - Package: `@next/bundle-analyzer`
  - Estimated: 30 min

### Testing

- [ ] **TASK-OPT-004**: Set up Jest/Vitest for unit testing
  - Estimated: 2 hours

- [ ] **TASK-OPT-005**: Set up Playwright for E2E testing
  - Estimated: 3 hours

- [ ] **TASK-OPT-006**: Add automated color contrast testing
  - Package: `axe-core`
  - Estimated: 1 hour

### Documentation

- [ ] **TASK-OPT-007**: Add Storybook for component documentation
  - Estimated: 4 hours

- [ ] **TASK-OPT-008**: Create component usage guidelines
  - Estimated: 2 hours

### CI/CD

- [ ] **TASK-OPT-009**: Add GitHub Actions for lint/type-check on PR
  - File: `.github/workflows/ci.yml` (new)
  - Estimated: 1 hour

- [ ] **TASK-OPT-010**: Add Husky pre-commit hooks for lint-staged
  - Packages: `husky`, `lint-staged`
  - Estimated: 30 min

---

## TASK SUMMARY BY FILE

| File | Task Count |
|------|------------|
| `tailwind.config.ts` | 8 |
| `src/components/pipeline/PipelineBoard.tsx` | 4 |
| `src/components/ui/Modal.tsx` | 1 |
| `src/components/ui/Dropdown.tsx` | 1 |
| `src/components/ui/Skeleton.tsx` | 2 |
| `src/components/ui/Avatar.tsx` | 1 |
| `src/components/ui/Button.tsx` | 2 |
| `src/components/ui/Badge.tsx` | 2 |
| `src/components/ui/Tooltip.tsx` | 1 |
| `src/hooks/*.ts` | 5 |
| `src/app/api/**/*.ts` | 9 |
| `src/middleware.ts` | 1 |
| `next.config.ts` | 1 |
| New files to create | 6 |
| Other files | 23 |

---

## EXECUTION ORDER RECOMMENDATION

### Week 1 - Critical & Security
1. TASK-001 to TASK-007 (Security fixes)
2. TASK-041 (CSRF fix)
3. TASK-042 (Security headers)

### Week 2 - High Priority Fixes
4. TASK-008 to TASK-011 (React hooks)
5. TASK-012 to TASK-018 (TypeScript any)
6. TASK-019 to TASK-027 (API refactoring)

### Week 3 - Design System
7. TASK-028 to TASK-038 (Tailwind fixes)
8. TASK-039 to TASK-040 (React fixes)

### Week 4 - Code Quality
9. TASK-043 to TASK-048 (Duplication removal)
10. TASK-049 to TASK-067 (Low priority cleanup)

---

## PROGRESS TRACKING

**Completed**: 0/67 (0%)
**In Progress**: 0/67
**Remaining**: 67/67

---

*This task list should be updated as tasks are completed. Mark tasks with [x] when done.*
