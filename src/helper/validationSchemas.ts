import { z } from "zod";

export const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên khách hàng phải có ít nhất 2 ký tự")
    .max(255, "Tên khách hàng không quá 255 ký tự"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Số điện thoại không hợp lệ (VD: 0912345678)"),
  email: z
    .string()
    .trim()
    .email("Email không đúng định dạng")
    .optional()
    .or(z.literal("")),
});

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Tên dự án phải có ít nhất 3 ký tự")
    .max(255, "Tên dự án không quá 255 ký tự"),
  contractValue: z
    .number({ message: "Giá trị hợp đồng phải là số" })
    .min(0, "Giá trị hợp đồng không được âm")
    .optional(),
});

export const steelProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên bảng thống kê thép không được để trống")
    .max(255),
});

export const taskProgressSchema = z.object({
  name: z.string().trim().min(2, "Tên công việc không được để trống"),
  weight: z.number().min(0.1, "Trọng số phải lớn hơn 0").optional(),
});

export function extractVietnameseApiError(err: any, fallback = "Có lỗi xảy ra"): string {
  const data = err?.response?.data;
  if (data?.message && typeof data.message === "string") {
    return data.message;
  }
  if (data?.errorFields && typeof data.errorFields === "object") {
    const first = Object.values(data.errorFields)[0];
    if (typeof first === "string") return first;
  }
  if (err?.message && typeof err.message === "string") {
    return err.message;
  }
  return fallback;
}
