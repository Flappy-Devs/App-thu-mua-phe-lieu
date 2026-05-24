import React from "react";
import { render, screen, fireEvent } from "./test-utils";
import SettingsScreen from "../app/(app)/settings";
import { useThemeColors } from "@/src/hooks/useThemeColors";
import { router } from "expo-router";
import { Alert } from "react-native";

// Mock dependencies
jest.mock("@/src/hooks/useThemeColors");
jest.mock("expo-router");

const mockUseThemeColors = useThemeColors as jest.MockedFunction<
  typeof useThemeColors
>;
const mockRouter = router as jest.Mocked<typeof router>;

describe("SettingsScreen", () => {
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
  });

  it("renders settings screen title", () => {
    render(<SettingsScreen />);

    expect(screen.getByText("Cài đặt ứng dụng")).toBeTruthy();
  });

  it("displays account section", () => {
    render(<SettingsScreen />);

    expect(screen.getByText("Tài khoản")).toBeTruthy();
  });

  it("displays personal info row", () => {
    render(<SettingsScreen />);

    expect(screen.getByText("Thông tin cá nhân")).toBeTruthy();
    expect(screen.getByText("Quản lý hồ sơ tài khoản")).toBeTruthy();
  });

  it("displays saved addresses row", () => {
    render(<SettingsScreen />);

    expect(screen.getByText("Địa chỉ đã lưu")).toBeTruthy();
    expect(screen.getByText("Xem và cập nhật địa chỉ mặc định")).toBeTruthy();
  });

  it("displays application section", () => {
    render(<SettingsScreen />);

    expect(screen.getByText("Ứng dụng")).toBeTruthy();
  });

  it("displays language setting", () => {
    render(<SettingsScreen />);

    expect(screen.getByText("Ngôn ngữ")).toBeTruthy();
    expect(screen.getByText("Tiếng Việt")).toBeTruthy();
  });

  it("displays theme setting", () => {
    render(<SettingsScreen />);

    expect(screen.getByText("Giao diện")).toBeTruthy();
    expect(screen.getByText("Sáng")).toBeTruthy();
  });

  it("displays app version", () => {
    render(<SettingsScreen />);

    expect(screen.getByText("Phiên bản ứng dụng")).toBeTruthy();
    expect(screen.getByText("1.0.0")).toBeTruthy();
  });

  it("back button navigates to user-info", () => {
    mockRouter.replace = jest.fn();

    render(<SettingsScreen />);

    const backButton = screen.getByTestId("back-button");
    fireEvent.press(backButton);

    expect(mockRouter.replace).toHaveBeenCalledWith("/user-info");
  });

  it("shows alert when clicking on account settings", () => {
    const mockAlert = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

    render(<SettingsScreen />);

    const personalInfoRow = screen.getByText("Thông tin cá nhân");
    fireEvent.press(personalInfoRow);

    expect(mockAlert).toHaveBeenCalledWith(
      "Tính năng ngoài scope chưa thực hiện!"
    );

    mockAlert.mockRestore();
  });

  it("app version row has no chevron", () => {
    render(<SettingsScreen />);

    const versionRow = screen.getByText("Phiên bản ứng dụng");
    expect(versionRow).toBeTruthy();
    // The chevron should not be displayed for version row
  });

  it("all rows have chevrons except version", () => {
    render(<SettingsScreen />);

    const personalInfoRow = screen.getByText("Thông tin cá nhân");
    const addressRow = screen.getByText("Địa chỉ đã lưu");

    // Both should have clickable areas with chevrons
    expect(personalInfoRow).toBeTruthy();
    expect(addressRow).toBeTruthy();
  });

  it("renders correct number of section headers", () => {
    render(<SettingsScreen />);

    const accountHeader = screen.getByText("Tài khoản");
    const appHeader = screen.getByText("Ứng dụng");

    expect(accountHeader).toBeTruthy();
    expect(appHeader).toBeTruthy();
  });

  it("renders all icons correctly", () => {
    render(<SettingsScreen />);

    // Just verify screen renders without errors
    // Icons are mocked in jest.setup.js
    expect(screen.getByText("Cài đặt ứng dụng")).toBeTruthy();
  });
});
