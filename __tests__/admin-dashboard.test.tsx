import React from "react";
import { fireEvent, render, screen } from "./test-utils";
import AdminDashboard from "../app/(admin)/index";
import { useAdminPickupOrders } from "@/src/features/admin/admin.hooks";
import { router } from "expo-router";

// Mock dependencies
jest.mock("@/src/features/admin/admin.hooks");
jest.mock("expo-router");

const mockUseAdminPickupOrders = useAdminPickupOrders as jest.MockedFunction<
  typeof useAdminPickupOrders
>;
const mockRouter = router as jest.Mocked<typeof router>;

describe("AdminDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAdminPickupOrders.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);

    mockRouter.push = jest.fn();
  });

  it("renders admin dashboard and filter tabs", () => {
    render(<AdminDashboard />);

    expect(screen.getByText("Quản lý đơn hàng")).toBeTruthy();
    expect(screen.getByText("Theo dõi và xử lý các đơn đang hoạt động.")).toBeTruthy();
    expect(screen.getByText("Tất cả")).toBeTruthy();
    expect(screen.getByText("Chờ xác nhận")).toBeTruthy();
    expect(screen.getByText("Đã xác nhận")).toBeTruthy();
    expect(screen.getByText("Đang tới")).toBeTruthy();
  });

  it("requests active pickup orders", () => {
    render(<AdminDashboard />);

    expect(mockUseAdminPickupOrders).toHaveBeenCalledWith("active");
  });

  it("shows loading state", () => {
    mockUseAdminPickupOrders.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    } as any);

    render(<AdminDashboard />);

    expect(screen.queryByText("Không có đơn phù hợp")).toBeNull();
    expect(screen.queryByText(/Đơn #/i)).toBeNull();
  });

  it("shows empty state when there are no orders", () => {
    render(<AdminDashboard />);

    expect(screen.getByText("Không có đơn phù hợp")).toBeTruthy();
  });

  it("filters orders by selected status", () => {
    mockUseAdminPickupOrders.mockReturnValue({
      data: [
        {
          id: "pending-001",
          status: "pending",
          scheduled_date: "2026-05-25",
          estimated_total: 200000,
          address_snapshot: { address_line: "12 Nguyen Trai" },
        },
        {
          id: "confirm-001",
          status: "confirmed",
          scheduled_date: "2026-05-26",
          estimated_total: 300000,
          address_snapshot: { address_line: "25 Le Loi" },
        },
      ],
      isLoading: false,
      error: null,
    } as any);

    render(<AdminDashboard />);

    expect(screen.getByText("12 Nguyen Trai")).toBeTruthy();
    expect(screen.getByText("25 Le Loi")).toBeTruthy();

    fireEvent.press(screen.getByText("Chờ xác nhận"));
    expect(screen.getByText("12 Nguyen Trai")).toBeTruthy();
    expect(screen.queryByText("25 Le Loi")).toBeNull();

    fireEvent.press(screen.getByText("Đang tới"));
    expect(screen.getByText("Không có đơn phù hợp")).toBeTruthy();
  });

  it("renders status labels and fallback values", () => {
    mockUseAdminPickupOrders.mockReturnValue({
      data: [
        {
          id: "12345678-pending",
          status: "pending",
          scheduled_date: "2026-05-25",
          estimated_total: 500000,
          address_snapshot: { address_line: "1 Hai Ba Trung" },
        },
        {
          id: "12345678-confirmed",
          status: "confirmed",
          scheduled_date: "2026-05-25",
          estimated_total: 750000,
          address_snapshot: { address_line: "2 Tran Hung Dao" },
        },
        {
          id: "12345678-ontheway",
          status: "on_the_way",
          scheduled_date: "2026-05-25",
          estimated_total: 100000,
          address_snapshot: { address_line: "3 Dien Bien Phu" },
        },
        {
          id: "12345678-completed",
          status: "completed",
          scheduled_date: "2026-05-25",
          estimated_total: undefined,
          address_snapshot: null,
        },
        {
          id: "12345678-rejected",
          status: "rejected",
          scheduled_date: "2026-05-25",
          estimated_total: 90000,
          address_snapshot: { address_line: "5 Vo Thi Sau" },
        },
        {
          id: "12345678-cancelled",
          status: "cancelled",
          scheduled_date: "2026-05-25",
          estimated_total: 120000,
          address_snapshot: { address_line: "6 Pasteur" },
        },
      ],
      isLoading: false,
      error: null,
    } as any);

    render(<AdminDashboard />);

    expect(screen.getByText("chờ xác nhận")).toBeTruthy();
    expect(screen.getByText("đã xác nhận")).toBeTruthy();
    expect(screen.getByText("đang tới")).toBeTruthy();
    expect(screen.getByText("hoàn thành")).toBeTruthy();
    expect(screen.getByText("từ chối")).toBeTruthy();
    expect(screen.getByText("đã hủy")).toBeTruthy();
    expect(screen.getByText("Đang cập nhật")).toBeTruthy();
    expect(screen.getByText("Chưa có địa chỉ")).toBeTruthy();
    expect(screen.getByText("500.000 VND")).toBeTruthy();
  });

  it("navigates to order details when pressing an order card", () => {
    mockUseAdminPickupOrders.mockReturnValue({
      data: [
        {
          id: "order-1234-abcd",
          status: "pending",
          scheduled_date: "2026-05-25",
          estimated_total: 150000,
          address_snapshot: { address_line: "100 Nguyen Hue" },
        },
      ],
      isLoading: false,
      error: null,
    } as any);

    render(<AdminDashboard />);

    fireEvent.press(screen.getByText("Đơn #order-12"));
    expect(mockRouter.push).toHaveBeenCalledWith("/(admin)/orders/order-1234-abcd");
  });
});
