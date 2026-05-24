module.exports = {
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
    "node_modules/(?!(expo|expo-.*|@expo|react-native|@react-native|react-native-.*|@react-navigation|@gluestack-ui|@gluestack-style|@tanstack/react-query)/)",
  ],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  collectCoverageFrom: [
    // "app/**/*.{ts,tsx}",
    // "src/**/*.{ts,tsx}",
    // "!**/*.d.ts",
    // "!**/__tests__/**",
    "app/**/login.tsx",
    "app/**/verify-otp.tsx",
    "app/**/settings.tsx",
    "app/**/index.tsx",
    "!**/_layout.tsx",
  ],

  coveragePathIgnorePatterns: ["/node_modules/", "/.expo/"],

  testPathIgnorePatterns: ["/node_modules/", "/.expo/"],

  testTimeout: 10000,
};