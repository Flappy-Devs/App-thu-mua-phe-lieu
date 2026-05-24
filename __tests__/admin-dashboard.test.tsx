import React from "react";
import { render, screen } from "./test-utils";
import AdminDashboard from "../app/(admin)/index";
import { useThemeColors } from "@/src/hooks/useThemeColors";
import { useAdminPickupOrders } from "@/src/features/admin/admin.hooks";

// Mock dependencies
jest.mock("@/src/hooks/useThemeColors");
jest.mock("@/src/features/admin/admin.hooks");

const mockUseThemeColors = useThemeColors as jest.MockedFunction<
  typeof useThemeColors
>;
const mockUseAdminPickupOrders = useAdminPickupOrders as jest.MockedFunction<
  typeof useAdminPickupOrders
>;

describe("AdminDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAdminPickupOrders.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
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
  });

  it("renders admin dashboard", () => {
    render(<AdminDashboard />);

    expect(screen.getByText("Quản lý đơn hàng")).toBeTruthy();
  });

  it("displays admin navigation tabs", () => {
    render(<AdminDashboard />);

    // Common admin tabs
    expect(screen.queryByText(/Đơn hàng/i)).toBeTruthy() ||
      screen.queryByText(/Orders/i) !== null;
  });
});
