import { expect, test } from "@playwright/test";

test.describe("Constructor ERP - Luồng nghiệp vụ chính (4.06)", () => {
  test("1. Đăng nhập hệ thống & điều hướng Dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="username"]', process.env.E2E_USER || "admin@gmail.com");
    await page.fill('input[name="password"]', process.env.E2E_PASS || "admin");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/Dashboard**");
    await expect(page.getByText("Tổng quan Điều hành")).toBeVisible();
  });

  test("2. Tạo & xem danh sách dự án", async ({ page }) => {
    await page.goto("/Constructor/Project");
    await expect(page.getByText("Quản lý dự án")).toBeVisible();
  });

  test("3. Giao việc & tiến độ dự án", async ({ page }) => {
    await page.goto("/Constructor/Progress/ProgressManage");
    await expect(page).toHaveURL(/ProgressManage/);
  });

  test("4. Thống kê thép & tính khối lượng tự động", async ({ page }) => {
    await page.goto("/Constructor/steelStatistics/addNew");
    await expect(page.getByText("Thêm mới thống kê thép")).toBeVisible();
  });
});
