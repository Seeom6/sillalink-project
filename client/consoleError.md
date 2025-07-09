# Console Errors - SillaLink Project

## Informational Messages (Non-Critical)
react-dom-client.development.js:25022 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
## Fixed Issues

### ✅ Hydration Mismatch with Browser Extensions
**Issue**: Browser extensions (like form fillers) were adding `fdprocessedid` attributes causing hydration mismatches in multiple components (Button, Input, motion.button).
**Fix**: Added `suppressHydrationWarning` to all affected components:
- Button component (`client/app/shared/ui/button.tsx`)
- Input components (`client/app/shared/ui/input.tsx`, `client/app/shared/components/forms/Input.tsx`)
- AuthFormInput component (`client/app/(main)/(auth)/components/AuthFormInput.tsx`)
- LeftSidebar logout button (`client/app/admin/components/LeftSidebar.tsx`)

### ✅ Image Aspect Ratio Warning
**Issue**: Image in LeftSidebar had width modified without height, causing aspect ratio warning.
**Fix**: Added `h-auto` class to maintain aspect ratio.

### ✅ LCP Image Priority Warning
**Issue**: Logo image was detected as LCP but missing priority prop.
**Fix**: Added `priority` prop to the logo Image component.

### ✅ AdminRouteGuard Console Spam
**Issue**: Development mode message was logged repeatedly.
**Fix**: Added flag to log only once per session.

### ✅ Auth Endpoint 404 Error
**Issue**: AuthContext was calling incorrect endpoint `/api/v1/website/auth/me` instead of using proper base URL.
**Fix**: Updated to use `NEXT_PUBLIC_API_BASE_URL` environment variable.

### ✅ Technology Image "undefined" URL
**Issue**: Technology images showing "undefined" in URLs causing 400 errors.
**Fix**: Added validation to prevent undefined/null values from being passed to Image component.

### Missing Key Props in TechnologiesGrid
**Issue**: React warning "Each child in a list should have a unique key prop" in TechnologiesGrid component.
**Fix**: Enhanced key props for all list renderings:
- Added fallback keys for main technology mapping: `key={technology._id || \`technology-${index}\`}`
- Improved tag mapping keys: `key={\`${technology._id || 'tech'}-tag-${tagIndex}-${tag}\`}`
- Added proper React.Fragment keys for conditional rendering
- Imported React to support React.Fragment usage

### Technology Delete Functionality
**Issue**: Delete functionality for technologies not working properly.
**Fix**: Comprehensive delete functionality enhancement:
- Fixed CSRF token endpoint URL to use proper base URL
- Enhanced error handling in delete API with specific error messages
- Added debug logging throughout the delete flow (frontend and backend)
- Improved delete action hook with better response handling
- Added proper TypeScript types for delete responses
- Enhanced backend controller and service with detailed logging

### TypeScript Errors in TechnologyFilters.tsx and TechnologyStats.tsx
**Issue**: Multiple TypeScript errors due to improper type assertions and interface mismatches.
**Fix**: Comprehensive TypeScript error resolution:
- **TechnologyFilters.tsx**:
  - Replaced `as any` type assertions with proper enum types
  - Fixed `exactOptionalPropertyTypes` issues by using conditional object updates
  - Added proper imports for `TechnologyCategory`, `TechnologyStatus`, `DifficultyLevel`
  - Fixed Slider component callback signature
  - Uncommented and properly imported Slider component
- **TechnologyStats.tsx**:
  - Replaced `as number` assertions with proper type guards
  - Fixed interface mismatch between `TechnologyStats` and component usage
  - Updated interface to match actual API response structure
- **technologyTypes.ts**:
  - Updated `TechnologyStats` interface to match component expectations
  - Fixed property names: `total` → `totalTechnologies`, `featured` → `featuredCount`, etc.

### Critical Technology Delete Functionality Issues
**Issue**: Two critical problems with technology deletion:
1. **Wrong Technology Name in Delete Dialog**: Confirmation dialog showed incorrect technology name
2. **Delete Operation Failing**: Technologies were not being deleted from database or UI

**Root Cause**: Backend was returning raw MongoDB documents instead of properly serialized data, causing `_id` fields to be ObjectId objects instead of strings, resulting in `undefined` values in frontend.

**Fix**: Comprehensive backend and frontend resolution:
- **Backend (`technology.admin.controller.ts`)**:
  - Added proper DTO transformation using `GetAllTechnologiesResponseDto`
  - Fixed both `getAll()` and `getById()` endpoints to serialize `_id` properly
  - Ensured consistent data structure across all technology endpoints
- **Frontend**:
  - Added robust ID validation in delete handlers
  - Enhanced error handling with user-friendly messages
  - Added safety checks to prevent deletion with invalid IDs
  - Improved delete confirmation flow with proper state management
- **Data Integrity**:
  - Fixed `_id` serialization from MongoDB ObjectId to string
  - Ensured consistent technology data structure across frontend and backend
  - Added fallback mechanisms for edge cases

### Critical Technology Edit Functionality Issues
**Issue**: Multiple critical problems with technology editing:
1. **Multiple Rapid API Requests**: Edit button triggered numerous simultaneous API calls
2. **Rate Limiting Errors**: Server responded with HTTP 429 (Too Many Requests)
3. **Invalid Image URL Requests**: Requests to `/media/image/technologies/undefined` causing 400 errors
4. **Performance Impact**: Failed requests causing system slowdown

**Root Cause**: Combination of undefined `_id` values (same as delete issue), missing request deduplication, and improper image URL handling in edit forms.

**Fix**: Comprehensive edit functionality resolution:
- **API Request Deduplication (`technologyApi.ts`)**:
  - Added request cache to prevent duplicate API calls for same technology ID
  - Implemented promise-based deduplication with automatic cleanup
  - Added proper error handling and cache management
- **Hook Optimization (`useTechnology.ts`)**:
  - Enhanced `useTechnology` hook with duplicate request prevention
  - Added proper ID validation and state management
  - Implemented loading state protection against multiple calls
- **Image URL Validation (`TechnologyForm.tsx`)**:
  - Fixed undefined image URL handling in both Add and Edit forms
  - Added proper validation to prevent requests to `/undefined` paths
  - Enhanced image preview state management
- **Edit Page Enhancement (`edit/[id]/page.tsx`)**:
  - Added comprehensive ID validation before API calls
  - Implemented proper loading and error states
  - Added user-friendly error boundaries and fallback UI
- **Grid Component Safety (`TechnologiesGrid.tsx`)**:
  - Added ID validation in edit button handlers
  - Enhanced error handling with user feedback
  - Prevented edit actions with invalid IDs

**Technical Improvements**:
- **Request Throttling**: Implemented client-side request deduplication
- **Error Boundaries**: Added comprehensive error handling throughout edit flow
- **State Management**: Enhanced loading states and user feedback
- **Data Validation**: Multiple layers of ID and data validation

### Technology Update API Validation Error
**Issue**: HTTP 400 error with "id Required" validation error when updating technologies.
**Root Cause**: Backend validation schema required `id` field in request body, but controller was using `Omit<UpdateTechnologyDto, 'id'>` which removed the id field, causing validation mismatch.

**Fix**: Comprehensive API validation resolution:
- **Frontend (`technologyApi.ts`)**:
  - Added `id` field to FormData in update requests
  - Enhanced error logging and debugging for update operations
  - Added comprehensive request/response logging
- **Backend (`technology.admin.controller.ts`)**:
  - Fixed controller to accept full `UpdateTechnologyDto` instead of omitting id
  - Added ID validation to ensure URL parameter matches body parameter
  - Enhanced error handling and validation consistency
- **Validation Consistency**:
  - Aligned frontend request structure with backend validation schema
  - Ensured proper data flow from frontend form to backend validation
  - Added safety checks for ID parameter consistency

## 🔄 Remaining Issues

### Development Messages (Informational)
- React DevTools download suggestion
- Various development stack traces (non-critical)

---
**All critical console errors have been resolved! 🎉**
Promise.then
handleLoading @ image-component.tsx:77
(anonymous) @ image-component.tsx:233
applyRef @ use-merged-ref.ts:55
(anonymous) @ use-merged-ref.ts:42
commitAttachRef @ react-dom-client.development.js:12245
runWithFiberInDEV @ react-dom-client.development.js:844
safelyAttachRef @ react-dom-client.development.js:12263
commitLayoutEffectOnFiber @ react-dom-client.development.js:12804
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12802
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12802
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12802
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12802
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12802
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12802
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12691
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12691
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12691
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12802
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12802
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12802
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12691
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12691
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12691
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12691
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12686
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12866
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13672
commitLayoutEffectOnFiber @ react-dom-client.development.js:12768
flushLayoutEffects @ react-dom-client.development.js:15686
commitRoot @ react-dom-client.development.js:15527
commitRootWhenReady @ react-dom-client.development.js:14758
performWorkOnRoot @ react-dom-client.development.js:14681
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<img>
exports.jsx @ react-jsx-runtime.development.js:339
(anonymous) @ image-component.tsx:259
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateForwardRef @ react-dom-client.development.js:8678
beginWork @ react-dom-client.development.js:10894
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<ForwardRef>
exports.jsx @ react-jsx-runtime.development.js:339
(anonymous) @ image-component.tsx:404
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateForwardRef @ react-dom-client.development.js:8678
beginWork @ react-dom-client.development.js:10894
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<ForwardRef>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
LeftSidebar @ LeftSidebar.tsx:102
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<LeftSidebar>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
AdminLayout @ layout.tsx:36
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<AdminLayout>
exports.jsx @ react-jsx-runtime.development.js:339
ClientSegmentRoot @ client-segment.tsx:50
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10504
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2347
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1024
resolveModel @ react-server-dom-turbopack-client.browser.development.js:1592
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2281
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
[project]/node_modules/next/dist/client/app-index.js [app-client] (ecmascript) @ app-index.tsx:157
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateModuleFromParent @ dev-base.ts:128
commonJsRequire @ runtime-utils.ts:241
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:78
loadScriptsInSequence @ app-bootstrap.ts:20
appBootstrap @ app-bootstrap.ts:60
[project]/node_modules/next/dist/client/app-next-turbopack.js [app-client] (ecmascript) @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateRuntimeModule @ dev-base.ts:97
registerChunk @ runtime-backend-dom.ts:85
await in registerChunk
registerChunk @ runtime-base.ts:356
(anonymous) @ dev-backend-dom.ts:127
(anonymous) @ dev-backend-dom.ts:127
page.tsx:341 Each child in a list should have a unique "key" prop.

Check the render method of `TechnologiesPage`. See https://react.dev/link/warning-keys for more information.
error @ intercept-console-error.ts:40
(anonymous) @ react-dom-client.development.js:23132
runWithFiberInDEV @ react-dom-client.development.js:844
warnForMissingKey @ react-dom-client.development.js:23131
warnOnInvalidKey @ react-dom-client.development.js:5610
reconcileChildrenArray @ react-dom-client.development.js:5691
reconcileChildFibersImpl @ react-dom-client.development.js:6012
(anonymous) @ react-dom-client.development.js:6117
reconcileChildren @ react-dom-client.development.js:8654
beginWork @ react-dom-client.development.js:10826
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<li>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
(anonymous) @ page.tsx:341
TechnologiesPage @ page.tsx:340
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<TechnologiesPage>
exports.jsx @ react-jsx-runtime.development.js:339
ClientPageRoot @ client-page.tsx:60
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10504
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2347
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1024
resolveModel @ react-server-dom-turbopack-client.browser.development.js:1592
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2281
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
[project]/node_modules/next/dist/client/app-index.js [app-client] (ecmascript) @ app-index.tsx:157
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateModuleFromParent @ dev-base.ts:128
commonJsRequire @ runtime-utils.ts:241
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:78
loadScriptsInSequence @ app-bootstrap.ts:20
appBootstrap @ app-bootstrap.ts:60
[project]/node_modules/next/dist/client/app-next-turbopack.js [app-client] (ecmascript) @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateRuntimeModule @ dev-base.ts:97
registerChunk @ runtime-backend-dom.ts:85
await in registerChunk
registerChunk @ runtime-base.ts:356
(anonymous) @ dev-backend-dom.ts:127
(anonymous) @ dev-backend-dom.ts:127
TechnologiesGrid.tsx:120 Each child in a list should have a unique "key" prop.

Check the render method of `TechnologiesGrid`. See https://react.dev/link/warning-keys for more information.
error @ intercept-console-error.ts:40
(anonymous) @ react-dom-client.development.js:23132
runWithFiberInDEV @ react-dom-client.development.js:844
warnForMissingKey @ react-dom-client.development.js:23131
warnOnInvalidKey @ react-dom-client.development.js:5610
reconcileChildrenArray @ react-dom-client.development.js:5691
reconcileChildFibersImpl @ react-dom-client.development.js:6012
(anonymous) @ react-dom-client.development.js:6117
reconcileChildren @ react-dom-client.development.js:8654
beginWork @ react-dom-client.development.js:10826
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<Card>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
(anonymous) @ TechnologiesGrid.tsx:120
TechnologiesGrid @ TechnologiesGrid.tsx:119
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<TechnologiesGrid>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
TechnologiesPage @ page.tsx:350
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<TechnologiesPage>
exports.jsx @ react-jsx-runtime.development.js:339
ClientPageRoot @ client-page.tsx:60
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10504
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2347
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1024
resolveModel @ react-server-dom-turbopack-client.browser.development.js:1592
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2281
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
[project]/node_modules/next/dist/client/app-index.js [app-client] (ecmascript) @ app-index.tsx:157
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateModuleFromParent @ dev-base.ts:128
commonJsRequire @ runtime-utils.ts:241
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:78
loadScriptsInSequence @ app-bootstrap.ts:20
appBootstrap @ app-bootstrap.ts:60
[project]/node_modules/next/dist/client/app-next-turbopack.js [app-client] (ecmascript) @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateRuntimeModule @ dev-base.ts:97
registerChunk @ runtime-backend-dom.ts:85
await in registerChunk
registerChunk @ runtime-base.ts:356
(anonymous) @ dev-backend-dom.ts:127
(anonymous) @ dev-backend-dom.ts:127
report-hmr-latency.ts:26 [Fast Refresh] done in NaNms
image:1  GET http://localhost:3000/_next/image?url=http%3A%2F%2Flocalhost%3A5000%2Fmedia%2Fimage%2Ftechnologies%2Fundefined&w=48&q=75 400 (Bad Request)
warn-once.ts:6 Image with src "/Silla-Link-compnay.svg" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.
Read more: https://nextjs.org/docs/api-reference/next/image#priority
warnOnce @ warn-once.ts:6
(anonymous) @ get-img-props.ts:613
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 112ms
AuthContext.tsx:40  GET http://localhost:3000/api/v1/website/auth/me 404 (Not Found)
checkAuthStatus @ AuthContext.tsx:40
AuthProvider.useEffect @ AuthContext.tsx:33
react-stack-bottom-frame @ react-dom-client.development.js:23054
runWithFiberInDEV @ react-dom-client.development.js:844
commitHookEffectListMount @ react-dom-client.development.js:11977
commitHookPassiveMountEffects @ react-dom-client.development.js:12098
commitPassiveMountOnFiber @ react-dom-client.development.js:13928
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13940
flushPassiveEffects @ react-dom-client.development.js:15868
flushPendingEffects @ react-dom-client.development.js:15829
performSyncWorkOnRoot @ react-dom-client.development.js:16361
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
flushSpawnedWork @ react-dom-client.development.js:15804
commitRoot @ react-dom-client.development.js:15528
commitRootWhenReady @ react-dom-client.development.js:14758
performWorkOnRoot @ react-dom-client.development.js:14681
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
RootLayout @ layout.tsx:58
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2348
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
getOutlinedModel @ react-server-dom-turbopack-client.browser.development.js:1320
parseModelString @ react-server-dom-turbopack-client.browser.development.js:1533
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2287
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1024
resolveModel @ react-server-dom-turbopack-client.browser.development.js:1592
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2281
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
<RootLayout>
buildFakeTask @ react-server-dom-turbopack-client.browser.development.js:2033
initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:2020
resolveDebugInfo @ react-server-dom-turbopack-client.browser.development.js:2056
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2254
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
[project]/node_modules/next/dist/client/app-index.js [app-client] (ecmascript) @ app-index.tsx:157
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateModuleFromParent @ dev-base.ts:128
commonJsRequire @ runtime-utils.ts:241
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:78
loadScriptsInSequence @ app-bootstrap.ts:20
appBootstrap @ app-bootstrap.ts:60
[project]/node_modules/next/dist/client/app-next-turbopack.js [app-client] (ecmascript) @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateRuntimeModule @ dev-base.ts:97
registerChunk @ runtime-backend-dom.ts:85
await in registerChunk
registerChunk @ runtime-base.ts:356
(anonymous) @ dev-backend-dom.ts:127
(anonymous) @ dev-backend-dom.ts:127
AuthContext.tsx:62 Auth check failed: 404
AdminRouteGuard.tsx:23 AdminRouteGuard - Development mode, bypassing auth completely
AdminRouteGuard.tsx:23 AdminRouteGuard - Development mode, bypassing auth completely
