u# Angular 18 Update TODO

## Status: In Progress

### 1. [DONE] Backup & Branch ✅
- Created git branch `blackboxai/angular-update-18`
- Committed TODO.md

### 2. [DONE] Update to Angular 15 ✅
- Angular/CLI 15.2.10/15.2.11, TS 4.9.5
- npm i --legacy-peer-deps success
- ng serve compiling/running (localhost:4203)
- Committed

### 3. [DONE] Update to Angular 16 ✅
- Angular 16 complete

### 4. [FAILED] Update to Angular 17 ❌
- `ng update` error: Multiple major versions not supported; do individually
- Next: manual or skip to v18 direct from v16


### 3. [PENDING] Update to Angular 16
- `ng update @angular/cli@16 @angular/core@16`
- `npm install`
- Fix errors, test

### 4. [PENDING] Update to Angular 17
- `ng update @angular/cli@17 @angular/core@17`
- `npm install`
- Fix errors, test

### 5. [PENDING] Update to Angular 18
- `ng update @angular/cli@18 @angular/core@18`
- `npm install`
- Fix errors, test

### 6. [PENDING] Update TypeScript & 3rd parties
- `npm i typescript@~5.6.2`
- Update @ngx-translate/core: `ng update @ngx-translate/core` or manual
- Check/update others (ckeditor, ng2-charts, etc.)
- `npm audit fix`

### 7. [PENDING] Test Builds & Features
- `ng serve`
- `ng build`
- `ng build --configuration adminecommerce`
- Test PWA, service worker, key modules (admin, auth, charts)

### 8. [DONE] Commit & Push
- git add .
- git commit -m "Update to Angular 18"
- git push origin blackboxai/angular-update-18

Updated: Step 1 next.
