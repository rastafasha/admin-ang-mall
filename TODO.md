u# Angular 18 Update TODO

## Status: In Progress

### 1. [DONE] Backup & Branch ✅
- Created git branch `blackboxai/angular-update-18`
- Committed TODO.md

### 2. [PARTIAL] Update to Angular 15 ⚠️
- package.json updated to Angular 15.2.10, CLI 15.2.11, TS ~4.9.5
- npm install failed: peer dep conflict with @angular-devkit/build-angular@15.2.11 & typescript@4.9.5 (use --legacy-peer-deps)
- Peer @ng-web-apis ignored
- angular.json unchanged (schematics ran?)
- Next: `npm install --legacy-peer-deps`, commit, test ng serve, proceed to v16

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
