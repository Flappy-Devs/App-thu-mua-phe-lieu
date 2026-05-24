import React from "react";
import { render, screen, fireEvent, waitFor } from "./test-utils";
import LoginScreen from "../app/(auth)/login";
import { useAuth } from "@/src/hooks/useAuth";
import { useThemeColors } from "@/src/hooks/useThemeColors";
import { router } from "expo-router";

// Mock dependencies
jest.mock("@/src/hooks/useAuth");
jest.mock("@/src/hooks/useThemeColors");
jest.mock("expo-router");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseThemeColors = useThemeColors as jest.MockedFunction<
  typeof useThemeColors
>;
const mockRouter = router as jest.Mocked<typeof router>;

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseThemeColors.mockReturnValue({
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
    } as any);

    mockUseAuth.mockReturnValue({
      sendLoginOtp: jest.fn(),
      loginEmailPass: jest.fn(),
      logout: jest.fn(),
      user: null,
    } as any);
  });

  it("renders login screen correctly", () => {
    render(<LoginScreen />);

    expect(screen.getByText("Chào mừng đến với")).toBeTruthy();
    expect(screen.getByText("ScrapTech")).toBeTruthy();
  });

  it("displays phone input field", () => {
    render(<LoginScreen />);

    const phoneInput = screen.getByPlaceholderText(
      "Hãy điền số điện thoại của bạn"
    );
    expect(phoneInput).toBeTruthy();
  });

  it("disables OTP button when phone is empty", () => {
    render(<LoginScreen />);

    const otpButton = screen.getByText("Nhận OTP");
    expect(otpButton).toBeDisabled();
  });

  it("enables OTP button when valid phone is entered", async () => {
    render(<LoginScreen />);

    const phoneInput = screen.getByPlaceholderText(
      "Hãy điền số điện thoại của bạn"
    );

    fireEvent.changeText(phoneInput, "0123456789");

    await waitFor(() => {
      const otpButton = screen.getByText("Nhận OTP");
      expect(otpButton).not.toBeDisabled();
    });
  });

  it("calls sendLoginOtp when OTP button is pressed with valid phone", async () => {
    const mockSendLoginOtp = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      sendLoginOtp: mockSendLoginOtp,
      loginEmailPass: jest.fn(),
      logout: jest.fn(),
      user: null,
    } as any);

    render(<LoginScreen />);

    const phoneInput = screen.getByPlaceholderText(
      "Hãy điền số điện thoại của bạn"
    );
    const otpButton = screen.getByText("Nhận OTP");

    fireEvent.changeText(phoneInput, "0123456789");
    fireEvent.press(otpButton);

    await waitFor(() => {
      expect(mockSendLoginOtp).toHaveBeenCalled();
    });
  });

  it("navigates to verify-otp screen on successful OTP request", async () => {
    const mockSendLoginOtp = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      sendLoginOtp: mockSendLoginOtp,
      loginEmailPass: jest.fn(),
      logout: jest.fn(),
      user: null,
    } as any);

    mockRouter.push = jest.fn();

    render(<LoginScreen />);

    const phoneInput = screen.getByPlaceholderText(
      "Hãy điền số điện thoại của bạn"
    );
    const otpButton = screen.getByText("Nhận OTP");

    fireEvent.changeText(phoneInput, "0123456789");
    fireEvent.press(otpButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/(auth)/verify-otp",
          params: expect.objectContaining({
            flow: "login",
          }),
        })
      );
    });
  });

  it("renders sign up link", () => {
    render(<LoginScreen />);

    const signUpText = screen.getByText("Đăng ký");
    expect(signUpText).toBeTruthy();
  });

  it("handles error from sendLoginOtp", async () => {
    const mockAlert = jest.spyOn(require("react-native").Alert, "alert");
    const mockSendLoginOtp = jest
      .fn()
      .mockRejectedValue(new Error("Network error"));

    mockUseAuth.mockReturnValue({
      sendLoginOtp: mockSendLoginOtp,
      loginEmailPass: jest.fn(),
      logout: jest.fn(),
      user: null,
    } as any);

    render(<LoginScreen />);

    const phoneInput = screen.getByPlaceholderText(
      "Hãy điền số điện thoại của bạn"
    );
    const otpButton = screen.getByText("Nhận OTP");

    fireEvent.changeText(phoneInput, "0123456789");
    fireEvent.press(otpButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        "Gửi OTP thất bại",
        expect.stringContaining("error")
      );
    });

    mockAlert.mockRestore();
  });
});
