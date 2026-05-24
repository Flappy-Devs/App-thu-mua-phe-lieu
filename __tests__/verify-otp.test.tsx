import React from "react";
import { render, screen, fireEvent, waitFor } from "./test-utils";
import VerifyOtpScreen from "../app/(auth)/verify-otp";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";
import { useThemeColors } from "@/src/hooks/useThemeColors";
import { router } from "expo-router";
import { Alert } from "react-native";
import * as authApi from "@/src/features/auth/auth.api";

// Mock dependencies
jest.mock("expo-router");
jest.mock("@/src/hooks/useAuth");
jest.mock("@/src/hooks/useThemeColors");
jest.mock("@/src/features/auth/auth.api");

const mockUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseThemeColors = useThemeColors as jest.MockedFunction<
  typeof useThemeColors
>;
const mockAuthApi = authApi as jest.Mocked<typeof authApi>;

describe("VerifyOtpScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLocalSearchParams.mockReturnValue({
      phone: "0123456789",
      flow: "login",
    } as any);

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
      confirmPhoneOtp: jest.fn(),
      sendLoginOtp: jest.fn(),
      sendSignupOtp: jest.fn(),
      loginEmailPass: jest.fn(),
      signOut: jest.fn(),
      user: null,
    } as any);

    mockAuthApi.requestLoginOtp.mockResolvedValue(undefined as any);
    mockAuthApi.requestSignupOtp.mockResolvedValue(undefined as any);
    mockAuthApi.upsertMyProfile.mockResolvedValue(undefined as any);
  });

  it("renders OTP verification screen", () => {
    render(<VerifyOtpScreen />);

    expect(screen.getByText(/Xác thực số điện thoại/)).toBeTruthy();
  });

  it("displays OTP instructions from params", () => {
    render(<VerifyOtpScreen />);

    expect(
      screen.getByText(/Nhập mã 6 chữ số được gửi đến điện thoại của bạn/)
    ).toBeTruthy();
  });

  it("renders OTP input fields", () => {
    render(<VerifyOtpScreen />);

    expect(screen.getByTestId("otp-input")).toBeTruthy();
  });

  it("disables submit button with incomplete OTP", () => {
    render(<VerifyOtpScreen />);

    const submitButton = screen.getByText("Xác thực OTP");
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button with complete OTP", async () => {
    render(<VerifyOtpScreen />);

    const input = screen.getByTestId("otp-input");
    fireEvent.changeText(input, "123456");

    await waitFor(() => {
      const submitButton = screen.getByText("Xác thực OTP");
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("displays resend OTP option", () => {
    render(<VerifyOtpScreen />);

    expect(screen.getByText(/Gửi lại sau/)).toBeTruthy();
  });

  it("shows timer for resend button", () => {
    render(<VerifyOtpScreen />);

    // Timer should be displayed
    expect(screen.getByTestId("resend-timer")).toBeTruthy();
  });

  it("calls verifyLoginOtp on submit for login flow", async () => {
    const mockConfirmPhoneOtp = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      confirmPhoneOtp: mockConfirmPhoneOtp,
      sendLoginOtp: jest.fn(),
      sendSignupOtp: jest.fn(),
      loginEmailPass: jest.fn(),
      signOut: jest.fn(),
      user: null,
    } as any);

    render(<VerifyOtpScreen />);

    fireEvent.changeText(screen.getByTestId("otp-input"), "123456");

    const submitButton = screen.getByText("Xác thực OTP");
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockConfirmPhoneOtp).toHaveBeenCalledWith("0123456789", "123456");
    });
  });

  it("calls confirmPhoneOtp on submit for signup flow", async () => {
    mockUseLocalSearchParams.mockReturnValue({
      phone: "0123456789",
      flow: "signup",
    } as any);

    const mockConfirmPhoneOtp = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      confirmPhoneOtp: mockConfirmPhoneOtp,
      sendLoginOtp: jest.fn(),
      sendSignupOtp: jest.fn(),
      loginEmailPass: jest.fn(),
      signOut: jest.fn(),
      user: null,
    } as any);

    render(<VerifyOtpScreen />);

    fireEvent.changeText(screen.getByTestId("otp-input"), "123456");

    const submitButton = screen.getByText("Xác thực OTP");
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockConfirmPhoneOtp).toHaveBeenCalledWith("0123456789", "123456");
      expect(mockAuthApi.upsertMyProfile).toHaveBeenCalledWith({
        fullName: "",
        phone: "0123456789",
      });
    });
  });

  it("handles verification error", async () => {
    const mockAlert = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());
    const mockConfirmPhoneOtp = jest
      .fn()
      .mockRejectedValue(new Error("Invalid OTP"));

    mockUseAuth.mockReturnValue({
      confirmPhoneOtp: mockConfirmPhoneOtp,
      sendLoginOtp: jest.fn(),
      sendSignupOtp: jest.fn(),
      loginEmailPass: jest.fn(),
      signOut: jest.fn(),
      user: null,
    } as any);

    render(<VerifyOtpScreen />);

    fireEvent.changeText(screen.getByTestId("otp-input"), "123456");

    const submitButton = screen.getByText("Xác thực OTP");
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        "Xác thực thất bại",
        "Invalid OTP"
      );
    });

    mockAlert.mockRestore();
  });
});
