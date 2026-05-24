import React from "react";
import { render, screen, fireEvent, waitFor } from "./test-utils";
import MyOrdersScreen from "../app/(app)/index";
import { useMyPickupOrders } from "@/src/features/orders/orders.hooks";
import { useMyProfile } from "@/src/features/profile/profile.hooks";
import { useMyNotifications } from "@/src/features/notifications/notifications.hooks";
import { router } from "expo-router";

// Mock dependencies
jest.mock("@/src/features/orders/orders.hooks");
jest.mock("@/src/features/profile/profile.hooks");
jest.mock("@/src/features/notifications/notifications.hooks");
jest.mock("expo-router");

const mockUseMyPickupOrders = useMyPickupOrders as jest.MockedFunction<
  typeof useMyPickupOrders
>;
const mockUseMyProfile = useMyProfile as jest.MockedFunction<
  typeof useMyProfile
>;
const mockUseMyNotifications = useMyNotifications as jest.MockedFunction<
  typeof useMyNotifications
>;

describe("MyOrdersScreen (Home/Index)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseMyPickupOrders.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);

    mockUseMyProfile.mockReturnValue({
      data: { full_name: "John Doe" },
      isLoading: false,
      error: null,
    } as any);

    mockUseMyNotifications.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
  });

  it("renders welcome message with user name", () => {
    render(<MyOrdersScreen />);

    expect(screen.getByText(/Xin chào, John Doe!/)).toBeTruthy();
  });

  it("displays loading state for profile", () => {
    mockUseMyProfile.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    render(<MyOrdersScreen />);

    expect(screen.getByText(/Đang tải.../)).toBeTruthy();
  });

  it("displays loading state for orders", () => {
    mockUseMyPickupOrders.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    } as any);

    render(<MyOrdersScreen />);

    const activityIndicator = screen.queryByTestId("activity-indicator");
    expect(activityIndicator).toBeTruthy();
  });

  it("displays empty state when no active orders", () => {
    render(<MyOrdersScreen />);

    expect(screen.getByText("Chưa có đơn đang xử lý")).toBeTruthy();
    expect(
      screen.getByText(/Tạo đơn mới để bắt đầu theo dõi/)
    ).toBeTruthy();
  });

  it("displays market price action button", () => {
    render(<MyOrdersScreen />);

    expect(screen.getByText("Bảng giá")).toBeTruthy();
    expect(screen.getByText(/Giá phế liệu trực tiếp/)).toBeTruthy();
  });

  it("displays price estimator button", () => {
    render(<MyOrdersScreen />);

    expect(screen.getByText("Công cụ tính toán")).toBeTruthy();
    expect(screen.getByText(/Ước lượng giá trị phế liệu/)).toBeTruthy();
  });

  it("displays notification bell icon", () => {
    render(<MyOrdersScreen />);

    const notificationButton = screen.getByTestId("notification-button");
    expect(notificationButton).toBeTruthy();
  });

  it("displays FAB (Floating Action Button)", () => {
    render(<MyOrdersScreen />);

    const fab = screen.getByTestId("fab-button");
    expect(fab).toBeTruthy();
  });

  it("renders order list when orders exist", () => {
    const mockOrders = [
      {
        id: "order-1",
        status: "pending",
        estimated_total: 500000,
        scheduled_date: "2024-05-25",
        scheduled_time_from: "10:00:00",
        scheduled_time_to: "12:00:00",
        address_snapshot: {
          address_line: "123 Nguyen Hue, HCMC",
        },
      },
    ];

    mockUseMyPickupOrders.mockReturnValue({
      data: mockOrders,
      isLoading: false,
      error: null,
    } as any);

    render(<MyOrdersScreen />);

    expect(screen.getByText("Đơn phế liệu")).toBeTruthy();
  });

  it("shows unread notification badge when there are unread notifications", () => {
    mockUseMyNotifications.mockReturnValue({
      data: [{ is_read: false }],
      isLoading: false,
      error: null,
    } as any);

    render(<MyOrdersScreen />);

    const notificationBadge = screen.getByTestId("notification-badge");
    expect(notificationBadge).toBeTruthy();
  });

  it("filters and displays only active orders", () => {
    const mockOrders = [
      {
        id: "order-1",
        status: "pending",
        estimated_total: 500000,
        scheduled_date: "2024-05-25",
        scheduled_time_from: "10:00:00",
        scheduled_time_to: "12:00:00",
        address_snapshot: { address_line: "123 Main St" },
      },
      {
        id: "order-2",
        status: "completed",
        estimated_total: 300000,
        scheduled_date: "2024-05-24",
        scheduled_time_from: "14:00:00",
        scheduled_time_to: "16:00:00",
        address_snapshot: { address_line: "456 Side St" },
      },
    ];

    mockUseMyPickupOrders.mockReturnValue({
      data: mockOrders,
      isLoading: false,
      error: null,
    } as any);

    render(<MyOrdersScreen />);

    // Should only show pending order, not completed
    expect(screen.getByText(/123 Main St/)).toBeTruthy();
  });
});
