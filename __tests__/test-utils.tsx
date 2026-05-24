import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react-native";

// Wrapper component with providers (add as needed)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react-native";
export { customRender as render };

// Mock helper functions
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

export const mockUseRouter = () => {
  const { useRouter } = require("expo-router");
  useRouter.mockReturnValue(mockRouter);
  return mockRouter;
};

export const mockUseLocalSearchParams = (params = {}) => {
  const { useLocalSearchParams } = require("expo-router");
  useLocalSearchParams.mockReturnValue(params);
};

export const mockUseThemeColors = () => {
  return {
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
  };
};

export const mockUseAuth = (overrides = {}) => {
  return {
    sendLoginOtp: jest.fn().mockResolvedValue(undefined),
    verifyLoginOtp: jest.fn().mockResolvedValue(undefined),
    verifyRegisterOtp: jest.fn().mockResolvedValue(undefined),
    loginEmailPass: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
    user: null,
    ...overrides,
  };
};

export const mockUseQuery = (data = undefined, overrides = {}) => {
  return {
    data,
    isLoading: false,
    error: null,
    isSuccess: !data ? false : true,
    ...overrides,
  };
};
