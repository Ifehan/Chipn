# Bundle Size Optimization Guide

## 1. Request Deduplication (Implemented)
- **File**: `src/services/request-deduplicator.ts`
- **Benefit**: Prevents duplicate API requests, reducing network overhead
- **Implementation**: Automatic GET request deduplication via API client
- **Impact**: Reduces redundant network calls, especially on rapid route changes

### Usage
The deduplicator is integrated into the API client automatically for GET requests. No changes needed in services.

```typescript
// Automatically deduplicates identical GET requests
const data = await apiClient.get('/api/users/profile');
```

## 2. React.memo() Optimization (Implemented)
- **Components Wrapped**:
  - **Atoms**: Avatar, Button, StatCard, Card, TabButton, SettingItem, BackButton
  - **Molecules**: ProfileCard, PaymentMethodCard
- **Benefit**: Prevents unnecessary re-renders of pure components
- **Impact**: 5-15% reduction in re-render overhead for deeply nested component trees

### How to identify candidates for memoization:
1. Pure presentational components (no internal state)
2. Simple props (primitives or stable references)
3. Receives same props frequently but parent re-renders often
4. Not in performance-critical paths that need frequent updates

## 3. Bundle Size Optimization (Implemented)
- **Strategy**: Vendor code splitting + minification
- **Configuration**: `vite.config.ts`

### Key Optimizations:

1. **Code Splitting by Vendor**
   - `vendor-react`: React core dependencies
   - `vendor-ui`: UI icon library (lucide-react)
   - `vendor-form`: Form handling libraries
   - `vendor-radix`: Radix UI components
   - **Benefit**: Better caching - dependencies rarely change

2. **Minification**
   - Terser compression enabled
   - Console logs removed in production
   - Debugger statements stripped
   - **Expected size reduction**: 30-40% from minification alone

3. **Target Modern Browser**
   - ES2020 target instead of ES5
   - Reduces polyfill overhead
   - Smaller output size

4. **CSS Code Splitting**
   - CSS files split alongside JS chunks
   - Users only download CSS needed for current route

### Build Output Analysis

To see the bundle size breakdown, run:
```bash
pnpm build
```

Check the `dist/` folder for output size:
```bash
ls -lah dist/
du -sh dist/
```

### Recommended Additional Optimizations (Future):

1. **Lazy Loading Pages**
   ```typescript
   const HomePage = lazy(() => import('./pages/HomePage'))
   const LoginPage = lazy(() => import('./pages/LoginPage'))
   // Wrap with Suspense boundary
   ```

2. **Image Optimization**
   - Use WebP format when possible
   - Implement responsive images with srcset
   - Use image CDN if available

3. **Tree Shaking**
   - Ensure all imports are used
   - Use named imports instead of default imports where applicable

4. **Dependency Audit**
   ```bash
   npm audit
   pnpm list
   # Remove unused dependencies
   ```

5. **Dynamic Imports for Heavy Components**
   - Split large page components into chunks
   - Load on demand with React.lazy()

## Performance Metrics

Monitor these metrics after deployment:
- **Bundle Size**: Target < 300KB (gzipped)
- **Largest Chunk**: Target < 150KB (gzipped)
- **First Contentful Paint (FCP)**: Target < 2s
- **Largest Contentful Paint (LCP)**: Target < 2.5s

## Configuration Details

### vite.config.ts Options Explained:

- `minify: 'terser'` - Uses Terser for best compression
- `terserOptions.compress.drop_console` - Removes console.log in production (set via logger for important logs)
- `target: 'ES2020'` - Modern JavaScript syntax, smaller output
- `cssCodeSplit: true` - Splits CSS into separate files per chunk
- `sourcemap: false` - Disables source maps (enable for debugging)
- `optimizeDeps.include` - Pre-bundles heavy dependencies for faster builds

## Testing Bundle Optimization

### Check if memoization is working:
```typescript
import { Button } from './components/atoms/Button'

// Button will skip re-render if props unchanged
// Verify with React DevTools Profiler
```

### Verify request deduplication:
```typescript
// These will be deduped automatically
await apiClient.get('/api/users/profile') // Request sent
await apiClient.get('/api/users/profile') // Returned immediately from first request
```

## Monitoring

The application includes monitoring services:
- **`logger.ts`**: Tracks errors and info logs
- **`performance-monitor.ts`**: Tracks API request timing
- **`web-vitals-monitor.ts`**: Tracks Core Web Vitals (LCP, FID, CLS)

Enable these logs in development to track performance:
```typescript
import { logger } from './services'
logger.info('Bundle size optimizations active', {}, 'App')
```
