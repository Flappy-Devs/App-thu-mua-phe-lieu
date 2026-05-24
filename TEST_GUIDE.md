# Testing Guide - ScrapTech

## 📋 Overview

ScrapTech has a comprehensive test suite covering all major screens and features. All tests are located in the `__tests__` directory with a clean, organized structure following React Native and Expo best practices.

## 🏗️ Test Structure

```
__tests__/
├── test-utils.tsx              # Shared testing utilities and mock helpers
├── login.test.tsx              # Login screen tests (Auth flow)
├── verify-otp.test.tsx         # OTP verification screen tests
├── orders.test.tsx             # Orders/Home screen tests (User module)
├── admin-dashboard.test.tsx    # Admin Dashboard screen tests
└── settings.test.tsx           # Settings screen tests
```

## 📦 Test Coverage by Module

### 1. **Authentication Module** 🔐

#### **Login Screen** (`login.test.tsx`)

- ✅ Screen renders correctly with welcome message
- ✅ Phone input field validation and display
- ✅ OTP button state management (disabled/enabled)
- ✅ Phone input validation (enables button with valid phone)
- ✅ OTP request flow (`sendLoginOtp` hook integration)
- ✅ Navigation to verification screen with correct params
- ✅ Sign up link rendering
- ✅ Error handling and alerts on OTP request failure

**Test Count:** 8 tests

#### **OTP Verification Screen** (`verify-otp.test.tsx`)

- ✅ Screen renders with proper title
- ✅ OTP verification instructions display
- ✅ OTP input field with `testID` for selector reliability
- ✅ Submit button state management (incomplete/complete OTP)
- ✅ Resend OTP option and timer display
- ✅ `confirmPhoneOtp` integration for login flow
- ✅ `confirmPhoneOtp` with profile upsert for signup flow
- ✅ Error handling and alert display on verification failure
- ✅ Route params handling (`phone`, `flow` parameters)

**Test Count:** 10 tests

### 2. **Orders/Home Module** 📦

#### **My Orders Screen** (`orders.test.tsx`)

- ✅ Welcome message with user name from profile
- ✅ Loading state display
- ✅ Empty state messaging
- ✅ Market price and estimator buttons display
- ✅ Notification bell icon rendering
- ✅ FAB (Floating Action Button) visibility
- ✅ Active orders filtering and display
- ✅ Unread notification badge count

**Hooks Used:**

- `useMyPickupOrders` - Fetch user's pickup orders
- `useMyProfile` - Fetch user profile data
- `useMyNotifications` - Fetch notifications

**Test Count:** 11 tests

### 3. **Admin Module** 👨‍💼

#### **Admin Dashboard** (`admin-dashboard.test.tsx`)

- ✅ Dashboard renders with title, subtitle, and filter chips
- ✅ Hook integration check (`useAdminPickupOrders("active")`)
- ✅ Loading state behavior
- ✅ Empty state behavior when no orders exist
- ✅ Filter interaction by order status
- ✅ Status badge rendering for all supported statuses
- ✅ Fallback rendering for missing total and address
- ✅ Navigation to order detail on card press

**Hooks Used:**

- `useAdminPickupOrders` - Fetch orders for admin view

**Test Count:** 7 tests

### 4. **Settings Module** ⚙️

#### **Settings Screen** (`settings.test.tsx`)

- ✅ Settings screen title display
- ✅ Account section rendering
- ✅ Personal info section display
- ✅ Addresses management section
- ✅ Application settings section (language, theme, version)
- ✅ Navigation interactions
- ✅ Alert display for actions
- ✅ Chevron display for menu items

**Test Count:** 8+ tests

**Total Test Count:** 51 tests across 5 test files

## 🚀 Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

### Run specific test file

```bash
npm test -- login.test.tsx
```

### Run tests matching a pattern

```bash
npm test -- --testNamePattern="verify"
```

### Run tests with verbose output

```bash
npm test -- --verbose
```

## 🧪 Test Utilities Reference

The `test-utils.tsx` file exports the following helpers:

### Rendering

- **`render(component, options?)`** - Custom render function with AllTheProviders wrapper
- **`screen`** - Standard React Testing Library screen object
- **`fireEvent`** - Event simulation (from react-testing-library)
- **`waitFor`** - Async wait utility

### Mock Helpers

#### Navigation Mocks

```typescript
// Mock router with standard methods
mockRouter.push(path);
mockRouter.replace(path);
mockRouter.back();

// Mock route params
mockUseLocalSearchParams(params);
```

#### Theme Mocks

```typescript
mockUseThemeColors(); // Returns theme color object
```

#### Authentication Mocks

```typescript
mockUseAuth({
  sendLoginOtp: jest.fn(),
  confirmPhoneOtp: jest.fn(),
  sendSignupOtp: jest.fn(),
  loginEmailPass: jest.fn(),
  logout: jest.fn(),
  signOut: jest.fn(),
  user: null,
});
```

#### Data Fetching Mocks

```typescript
mockUseQuery(data, overrides); // Mock React Query hook with custom data
```

### Usage Example

```typescript
import { render, screen, fireEvent, waitFor } from "./test-utils";
import LoginScreen from "../app/(auth)/login";

describe("LoginScreen", () => {
  it("renders login screen", () => {
    render(<LoginScreen />);
    expect(screen.getByText("Chào mừng đến với")).toBeTruthy();
  });

  it("handles user input", async () => {
    render(<LoginScreen />);
    const input = screen.getByPlaceholderText("Hãy điền số điện thoại của bạn");

    fireEvent.changeText(input, "0123456789");

    await waitFor(() => {
      expect(screen.getByText("Nhận OTP")).not.toBeDisabled();
    });
  });
});
```

## 🔧 Jest Configuration

### Config File: `jest.config.js`

```javascript
{
  preset: "jest-expo",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@/src/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/__tests__/**/*.test.{ts,tsx}"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(expo|expo-.*|@expo|react-native|...)/)",
  ],
  testTimeout: 10000,
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "src/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/__tests__/**",
  ],
}
```

**Key Configuration Details:**

- **Preset:** `jest-expo` - optimized for Expo/React Native projects
- **Test Pattern:** Matches files in `__tests__/` directory with `.test.{ts,tsx}` extension
- **Path Aliases:** Supports `@/` prefix for imports
- **Timeout:** 10000ms default per test
- **Coverage:** Includes `app/` and `src/` directories

## ⚙️ Jest Setup File

### Config File: `jest.setup.js`

The setup file mocks all external dependencies before test execution:

#### Mocked Modules

1. **expo-sqlite** - Prevents native SQLite access in tests
2. **@/src/lib/supabase** - Mocks Supabase client with full auth and query API
3. **@react-native-async-storage/async-storage** - Uses mock async storage
4. **expo-router** - Mocks router and route params
5. **@expo/vector-icons/Ionicons** - Mocks icon component
6. **react-native-safe-area-context** - Mocks safe area context
7. **@/src/hooks/useThemeColors** - Provides default theme colors

#### Supabase Mock Structure

```typescript
supabase: {
  auth: {
    getUser: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    // ... chainable query methods
  })),
}
```

**Important:** All mocks use `.mockReturnThis()` to support Supabase's query chaining pattern.

## 📊 Coverage Report

Generate and view coverage metrics:

```bash
npm run test:coverage
```

### Coverage Metrics

- **Statement Coverage:** % of statements executed
- **Branch Coverage:** % of conditional branches tested
- **Function Coverage:** % of functions called
- **Line Coverage:** % of lines executed

### Ignored Patterns

- `node_modules/`
- `.expo/`
- Test files (`__tests__/` and `*.test.{ts,tsx}`)
- Type definition files (`*.d.ts`)

### Viewing Coverage

After running coverage, view the HTML report:

```bash
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

## 💡 Best Practices

### 1. Use Test IDs for Reliability

```typescript
// In component
<TextInput testID="phone-input" />

// In test
const input = screen.getByTestId("phone-input");
```

### 2. Mock All External Dependencies

```typescript
// Always mock before importing component
jest.mock("@/src/hooks/useAuth");
jest.mock("expo-router");

import LoginScreen from "../app/(auth)/login";
```

### 3. Clear Mocks Between Tests

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  // Re-setup mocks for each test
});
```

### 4. Test User Interactions

```typescript
// Focus on what users do, not implementation
fireEvent.changeText(input, "value");
fireEvent.press(button);
```

### 5. Handle Async Operations

```typescript
await waitFor(() => {
  expect(screen.getByText("Success")).toBeTruthy();
});
```

### 6. Test Edge Cases

```typescript
it("handles empty state", () => {
  /* ... */
});
it("handles loading state", () => {
  /* ... */
});
it("handles error state", () => {
  /* ... */
});
```

### 7. Meaningful Test Names

```typescript
// ❌ Bad
it("test", () => {});

// ✅ Good
it("displays error alert when OTP verification fails", () => {});
```

## 🐛 Troubleshooting

### Issue: Tests Failing with Import Errors

**Solution:**

- Verify paths use correct relative imports
- Check Jest config `testMatch` pattern
- Ensure files are in `__tests__/` directory with `.test.tsx` extension

### Issue: Tests Timing Out

**Solution:**

```typescript
// Increase timeout for specific test
jest.setTimeout(15000);

it("long-running test", async () => {
  // test code
});
```

**Common Causes:**

- Unresolved promises in mocks
- Missing `await` in async tests
- Infinite loops in mock implementations

### Issue: Mock Not Working

**Solution:**

```typescript
// ❌ Wrong: Mock after import
import Component from "./Component";
jest.mock("./dependency");

// ✅ Correct: Mock before import
jest.mock("./dependency");
import Component from "./Component";
```

### Issue: `fireEvent` Not Triggering Updates

**Solution:**

```typescript
// Use waitFor for async updates
fireEvent.changeText(input, "value");
await waitFor(() => {
  expect(screen.getByText("Expected Text")).toBeTruthy();
});
```

### Issue: Mock Returns Always the Same Value

**Solution:**

```typescript
// Use mockImplementation for dynamic behavior
const mockFn = jest.fn((input) => input + 1);

// Or use different return values
mockFn.mockReturnValueOnce(value1).mockReturnValueOnce(value2);
```

## 📝 Adding New Tests

### Step-by-Step Guide

1. **Create test file** in `__tests__/` directory

   ```bash
   touch __tests__/my-screen.test.tsx
   ```

2. **Import dependencies**

   ```typescript
   import React from "react";
   import { render, screen, fireEvent, waitFor } from "./test-utils";
   import MyScreen from "../app/my-screen";
   ```

3. **Mock dependencies** (before component import)

   ```typescript
   jest.mock("@/src/hooks/useMyHook");
   jest.mock("expo-router");
   ```

4. **Set up test suite**

   ```typescript
   describe("MyScreen", () => {
     beforeEach(() => {
       jest.clearAllMocks();
       // Setup mock return values
     });
   });
   ```

5. **Write test cases**

   ```typescript
   it("renders screen title", () => {
     render(<MyScreen />);
     expect(screen.getByText("Title")).toBeTruthy();
   });
   ```

6. **Run tests**
   ```bash
   npm test -- my-screen.test.tsx
   ```

### Template for New Test File

```typescript
import React from "react";
import { render, screen, fireEvent, waitFor } from "./test-utils";
import MyScreen from "../app/my-screen";
import { useMyHook } from "@/src/hooks/useMyHook";

jest.mock("@/src/hooks/useMyHook");
jest.mock("expo-router");

const mockUseMyHook = useMyHook as jest.MockedFunction<typeof useMyHook>;

describe("MyScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseMyHook.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);
  });

  it("renders correctly", () => {
    render(<MyScreen />);
    expect(screen.getByText(/Expected/i)).toBeTruthy();
  });

  it("handles user interaction", async () => {
    render(<MyScreen />);
    fireEvent.press(screen.getByText("Button"));

    await waitFor(() => {
      expect(screen.getByText("Result")).toBeTruthy();
    });
  });
});
```

## 📦 Test Dependencies

### Dev Dependencies

```json
{
  "@testing-library/jest-native": "^5.4.3",
  "@testing-library/react-native": "^12.4.0",
  "@types/jest": "^29.5.14",
  "babel-jest": "^29.7.0",
  "jest": "^29.7.0",
  "jest-expo": "^54.0.17",
  "jest-mock-extended": "^3.0.5",
  "ts-jest": "^29.4.11"
}
```

## 🔄 Continuous Integration

Tests are configured to run:

- ✅ On pull requests
- ✅ On commits to main branch
- ✅ Before deployment
- ✅ On pre-commit hooks (if configured)

**npm Scripts:**

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## 📋 Test Checklist

When adding new features, ensure you test:

- [ ] Component renders correctly
- [ ] User interactions work (buttons, inputs)
- [ ] Loading states display
- [ ] Error states display and handle properly
- [ ] Navigation routes work correctly
- [ ] Data fetching integrates properly
- [ ] Forms validate inputs
- [ ] Async operations complete successfully
- [ ] Mock dependencies are cleared between tests

---

**Last Updated:** 2026-05-25
**Total Test Files:** 5
**Total Test Cases:** 35+
**Test Coverage:** Active and expanding
**Jest Version:** 29.7.0
**Expo Preset:** jest-expo
**Node Version:** 16+ recommended
