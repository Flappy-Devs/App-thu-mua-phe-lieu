import "@testing-library/jest-native/extend-expect";

// Mock Expo SQLite bootstrap so Supabase localStorage never touches native SQLite in tests
jest.mock("expo-sqlite/localStorage/install", () => ({}));

// Mock Supabase client to avoid loading src/lib/supabase and its SQLite-backed storage setup
jest.mock("@/src/lib/supabase", () => ({
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
      maybeSingle: jest.fn(),
      single: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
    })),
  },
}));

// Mock AsyncStorage
jest.mock(
  "@react-native-async-storage/async-storage",
  () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock Expo Router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => "/"),
  Link: ({
    children
  }) => children,
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock Icons
jest.mock("@expo/vector-icons/Ionicons", () => "Icon");

// Mock SafeArea
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({
    children
  }) => children,
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

// Mock hooks
jest.mock("@/src/hooks/useThemeColors", () => ({
  useThemeColors: jest.fn(() => ({
    neutral: {
      light: {
        lightest: "#FFFFFF",
        medium: "#F0F0F0",
      },
      dark: {
        darkest: "#1E1E1E",
        light: "#71727A",
      },
    },
    highlight: {
      medium: "#22C55E",
    },
  })),
}));