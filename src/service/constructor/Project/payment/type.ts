import { PaymentPlanStatus } from "../getDetail/type";

export type ProjectPaymentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
export type PaymentMethod = "BANK_TRANSFER" | "CASH" | "OTHER";

export type UploadItem = {
  name: string;
  url: string;
  type?: string;
};

export type ProjectPaymentItem = {
  id?: number;
  projectId?: number;
  projectLineId?: number | null;
  paymentPlanNo?: number | null;
  paymentPlanMilestone?: string | null;
  receiptCode?: string | null;
  paymentDate: string;
  amount: number;
  paymentMethod?: PaymentMethod;
  paymentMethodLabel?: string;
  status?: ProjectPaymentStatus;
  statusLabel?: string;
  payerName?: string | null;
  attachments?: UploadItem[] | null;
  note?: string | null;
  createdAt?: string;
  createdBy?: string;
};

export type ProjectPaymentSummary = {
  projectId: number;
  contractValue: number;
  contractAdvance: number;
  confirmedPaymentTotal: number;
  pendingPaymentTotal: number;
  totalCollected: number;
  remainingAmount: number;
  collectionRate: number;
  payments: ProjectPaymentItem[];
};

export const PAYMENT_PLAN_STATUS_META: Record<
  PaymentPlanStatus,
  { label: string; color: "default" | "info" | "warning" | "success" | "error" }
> = {
  PLANNED: { label: "Chưa đến hạn", color: "default" },
  DUE: { label: "Đến hạn thu", color: "info" },
  PARTIAL: { label: "Thu một phần", color: "warning" },
  PAID: { label: "Đã thu đủ", color: "success" },
  OVERDUE: { label: "Quá hạn", color: "error" },
};

export const PROJECT_PAYMENT_STATUS_OPTIONS: {
  value: ProjectPaymentStatus;
  label: string;
  color: "warning" | "success" | "error";
}[] = [
  { value: "CONFIRMED", label: "Đã xác nhận thu", color: "success" },
  { value: "PENDING", label: "Chờ xác nhận", color: "warning" },
  { value: "CANCELLED", label: "Đã hủy", color: "error" },
];

export const PAYMENT_METHOD_OPTIONS: {
  value: PaymentMethod;
  label: string;
}[] = [
  { value: "BANK_TRANSFER", label: "Chuyển khoản" },
  { value: "CASH", label: "Tiền mặt" },
  { value: "OTHER", label: "Hình thức khác" },
];
