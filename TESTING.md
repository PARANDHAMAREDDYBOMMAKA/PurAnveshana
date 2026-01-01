# Testing Guide for Puranveshana

This document provides comprehensive information about the testing infrastructure for the Puranveshana application.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Unit Testing](#unit-testing)
- [Performance Testing](#performance-testing)
- [CI/CD Integration](#cicd-integration)
- [Wappalyzer Detection](#wappalyzer-detection)

## Overview

Puranveshana uses a comprehensive testing strategy that includes:
- **Unit Tests** - Jest + React Testing Library
- **Performance Tests** - Lighthouse CI for web performance, SEO, and accessibility
- **Load Tests** - Artillery for API performance and load testing

## Testing Stack

### Unit Testing
- **Jest** - Testing framework
- **React Testing Library** - React component testing
- **@testing-library/jest-dom** - DOM matchers
- **ts-jest** - TypeScript support

### Performance Testing
- **Lighthouse CI** - Web performance, accessibility, SEO audits
- **Artillery** - Load testing and API performance testing

## Running Tests

### Unit Tests

```bash
# Run all tests in watch mode
npm test

# Run tests once (for CI)
npm run test:ci

# Run tests with coverage
npm run test:coverage

# Run only API tests
npm run test:api

# Run only component tests
npm run test:components
```

### Performance Tests

#### Lighthouse CI

```bash
# Run Lighthouse CI with configuration
npm run lighthouse

# Run Lighthouse on local server (requires app to be running)
npm run lighthouse:local
```

**Prerequisites:**
- Application must be built and running: `npm run build && npm start`
- Or use dev mode: `npm run dev`

#### Load Testing with Artillery

```bash
# Run load tests
npm run load-test

# Run load tests with detailed report
npm run load-test:report
```

**Configuration:**
- Test scenarios are defined in `tests/load/api-load-test.yml`
- Tests multiple endpoints with different load patterns
- Simulates 5-20 concurrent users

### Run All Tests

```bash
# Run all tests (unit + performance + load)
npm run test:all

# Run only performance tests (lighthouse + load)
npm run test:perf
```

## Unit Testing

### Test Structure

```
__tests__/
├── api/
│   ├── auth.test.ts          # Authentication API tests
│   ├── yatra.test.ts         # Yatra API tests
│   └── ...                   # Other API tests
├── components/
│   ├── YatraGallery.test.tsx # YatraGallery component tests
│   ├── Navbar.test.tsx       # Navbar component tests
│   └── ...                   # Other component tests
└── pages/
    └── ...                   # Page-level tests
```

### Writing Tests

Example API test:
```typescript
import { POST as handler } from '@/app/api/yatra/route'

describe('POST /api/yatra', () => {
  it('should create a yatra story', async () => {
    const request = new Request('http://localhost/api/yatra', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Story' }),
    })

    const response = await handler(request)
    expect(response.status).toBe(200)
  })
})
```

Example component test:
```typescript
import { render, screen } from '@testing-library/react'
import YatraGallery from '@/components/YatraGallery'

it('should render yatra stories', async () => {
  render(<YatraGallery userId="user1" isAdmin={false} />)

  await waitFor(() => {
    expect(screen.getByText('Test Story')).toBeInTheDocument()
  })
})
```

### Coverage Thresholds

Current coverage thresholds (configured in `jest.config.ts`):
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Performance Testing

### Lighthouse CI

#### Metrics Tracked
- **Performance** - Load times, FCP, LCP, CLS, TBT
- **Accessibility** - ARIA, contrast, semantics
- **Best Practices** - HTTPS, console errors, deprecated APIs
- **SEO** - Meta tags, structured data, crawlability

#### Assertions
- Performance Score: ≥ 80
- Accessibility Score: ≥ 90
- Best Practices Score: ≥ 85
- SEO Score: ≥ 90
- First Contentful Paint: ≤ 2000ms
- Largest Contentful Paint: ≤ 2500ms
- Cumulative Layout Shift: ≤ 0.1
- Total Blocking Time: ≤ 300ms

#### Pages Tested
- `/` - Homepage
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Dashboard
- `/dashboard/yatra` - Yatra gallery
- `/dashboard/yatra/create` - Create yatra
- `/dashboard/profile` - Profile page
- `/dashboard/support` - Support tickets
- `/dashboard/payment-history` - Payment history

#### Configuration
Lighthouse configuration is in `lighthouserc.json`:
- Desktop preset
- 3 runs per page
- Results stored temporarily

### Load Testing with Artillery

#### Test Scenarios

1. **Browse Heritage Sites** (30% weight)
   - Load homepage
   - Fetch yatra stories
   - Realistic browsing delays

2. **View Yatra Story** (25% weight)
   - Load yatra list
   - Navigate to dashboard

3. **User Authentication Flow** (20% weight)
   - Login attempt
   - Access dashboard
   - Logout

4. **API Performance Tests** (25% weight)
   - Test `/api/yatra`
   - Test `/api/geocode`
   - Test `/api/support/tickets`

#### Load Phases

1. **Warm up** - 60s @ 5 requests/second
2. **Sustained load** - 120s @ 10 requests/second
3. **Peak load** - 60s @ 20 requests/second

#### Metrics
- Response time (p50, p95, p99)
- Request rate
- Error rate
- Success rate per endpoint

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  lighthouse:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm start &
          sleep 10
          npm run lighthouse

  load-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run load tests
        run: npm run load-test:report

      - name: Upload load test results
        uses: actions/upload-artifact@v3
        with:
          name: artillery-report
          path: tests/load/report.json
```

## Wappalyzer Detection

To make your testing infrastructure visible in Wappalyzer, you can add the following meta tags to your application:

### Add to `app/layout.tsx`:

```tsx
export const metadata = {
  // ... existing metadata
  other: {
    'testing-framework': 'Jest, React Testing Library',
    'performance-testing': 'Lighthouse CI, Artillery',
    'code-coverage': 'enabled',
  },
}
```

### Add HTTP Headers (in `next.config.js`):

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Testing-Stack',
            value: 'Jest,Lighthouse,Artillery',
          },
          {
            key: 'X-Performance-Monitoring',
            value: 'Lighthouse-CI',
          },
        ],
      },
    ]
  },
}
```

**Note:** These headers are typically only added in production if you want to showcase your testing infrastructure. For security reasons, you might want to limit this to specific environments.

### Detectable Technologies

The following testing technologies may be detected by Wappalyzer through various patterns:

- **Jest** - Through package.json or HTML comments in test environments
- **Lighthouse** - Through performance metrics and reports
- **Artillery** - Through HTTP headers if configured

## Best Practices

### Writing Tests

1. **Test User Behavior** - Focus on what users do, not implementation details
2. **Mock External Dependencies** - Database, APIs, file system
3. **Keep Tests Independent** - Each test should run in isolation
4. **Use Descriptive Names** - Test names should explain what they test
5. **Test Error Cases** - Don't just test happy paths

### Performance Testing

1. **Test in Production-Like Environment** - Use production builds
2. **Run Multiple Times** - Lighthouse runs 3 times by default
3. **Monitor Trends** - Track metrics over time
4. **Set Realistic Budgets** - Don't set unrealistic performance budgets
5. **Test on Different Devices** - Mobile and desktop

### Load Testing

1. **Start Small** - Begin with low load, gradually increase
2. **Test Real Scenarios** - Mimic actual user behavior
3. **Monitor Backend** - Watch database, memory, CPU during tests
4. **Test Regularly** - Run load tests before major releases
5. **Document Results** - Keep records of load test results

## Troubleshooting

### Jest Tests Failing

```bash
# Clear Jest cache
npx jest --clearCache

# Run with verbose output
npm test -- --verbose
```

### Lighthouse Issues

```bash
# Ensure app is running
npm run build
npm start

# Check if port 3000 is available
lsof -i :3000

# Run with debug output
npx lhci autorun --config=lighthouserc.json
```

### Artillery Issues

```bash
# Validate YAML configuration
npx artillery run --check tests/load/api-load-test.yml

# Run with verbose output
npx artillery run tests/load/api-load-test.yml --output report.json
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Artillery Documentation](https://www.artillery.io/docs)
- [Wappalyzer](https://www.wappalyzer.com/)

## Support

For issues or questions:
1. Check this documentation
2. Review test examples in `__tests__/`
3. Check CI/CD logs
4. Open an issue in the repository
