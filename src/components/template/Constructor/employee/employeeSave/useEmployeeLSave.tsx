import {
  CERTIFICATE_REQUIRED_POSITIONS,
  POSITION_DEFAULT_ROLES,
  ROLE_LABELS,
} from "../constants";
import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { Role } from "@/service/constructor/Account/getList/type";
import {
  useAllRolesQuery,
  useUnassignedAccountsQuery,
} from "@/service/constructor/Account/manage";
import { useEmployeeDetailQuery } from "@/service/constructor/Employee/getDetail";
import { postEmployee, putEmployee } from "@/service/constructor/Employee/save";
import {
  RequestBody,
  StaffCertificateItem,
} from "@/service/constructor/Employee/save/type";
import { useEmployeeWorkloadQuery } from "@/service/constructor/Employee/workload";
import { toastError, toastSuccess } from "@/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";

export type AccountSetupMode = "CREATE" | "ASSIGN" | "NONE";

const createEmptyCertificate = (): StaffCertificateItem => ({
  id: null,
  certificateType: "",
  certificateNumber: "",
  certificateRank: null,
  issuedBy: "",
  issueDate: "",
  expiryDate: "",
  note: "",
});

const defaultValues: RequestBody["SAVE"] = {
  code: "",
  email: "",
  position: "",
  department: null,
  joinDate: null,
  status: "WORKING",
  idCardNumber: "",
  idCardIssueDate: null,
  idCardIssuePlace: "",
  firstName: "",
  lastName: "",
  birthDate: null,
  address: "",
  phone: "",
  gender: null,
  description: "",
  genPassword: "",
  certificates: [],
  createAccount: true,
  assignAccountId: null,
  initialPassword: "",
  mustChangePassword: true,
};

const extractErrorMessage = (error: any): string => {
  const errData = error?.response?.data;
  if (errData?.errors) {
    if (Array.isArray(errData.errors) && errData.errors.length > 0) {
      return errData.errors[0]?.message || JSON.stringify(errData.errors[0]);
    }
    if (typeof errData.errors === "object") {
      const firstVal = Object.values(errData.errors)[0];
      if (typeof firstVal === "string") return firstVal;
    }
  }
  return errData?.message || error?.message || "Có lỗi xảy ra";
};

const useEmployeeSave = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const params = useParams();

  const actionType = searchParams.get("actionType");
  const tabParam = searchParams.get("tab") || (router.query?.tab as string);
  const isView = actionType === "VIEW";

  const id = Number(params?.id || router.query?.id);
  const isUpdate = Boolean(id && !Number.isNaN(id));
  const initialTab = isUpdate && tabParam === "workload" ? 1 : 0;

  const methodForm = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });

  const { reset, handleSubmit, control, setValue } = methodForm;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certificates",
  });

  const selectedPosition = useWatch({ control, name: "position" });
  const watchedEmail = useWatch({ control, name: "email" });
  const watchedAssignAccountId = useWatch({ control, name: "assignAccountId" });
  const watchedCertificates = useWatch({ control, name: "certificates" });

  const isCertificateRequired = Boolean(
    selectedPosition && CERTIFICATE_REQUIRED_POSITIONS.has(selectedPosition)
  );

  // 2.03: Trạng thái thiết lập tài khoản & phân quyền
  const [accountMode, setAccountMode] = useState<AccountSetupMode>("CREATE");
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(true);
  const hasManuallyEditedRoles = useRef(false);

  const { data: allRoles = [] } = useAllRolesQuery();
  const { data: dataDetail, isLoading } = useEmployeeDetailQuery(id, {
    enabled: isUpdate,
  });

  const employeeDetail = dataDetail?.data;
  const hasLinkedAccount = Boolean(employeeDetail?.hasAccount);

  const { data: unassignedAccounts = [] } = useUnassignedAccountsQuery({
    enabled: !isView && !hasLinkedAccount,
  });

  // 2.04: Tải dự án & công việc của nhân sự
  const { data: workload, isLoading: isLoadingWorkload } =
    useEmployeeWorkloadQuery(id, {
      enabled: isUpdate,
    });

  const unassignedAccountOptions = useMemo(
    () =>
      unassignedAccounts.map((acc) => {
        const fullName = [acc.firstName, acc.lastName]
          .filter(Boolean)
          .join(" ")
          .trim();
        return {
          value: acc.id,
          label: fullName ? `${acc.username} (${fullName})` : acc.username,
          raw: acc,
        };
      }),
    [unassignedAccounts]
  );

  // Tự động tạo sẵn 1 dòng chứng chỉ khi chọn chức vụ bắt buộc chứng chỉ ở chế độ Thêm mới / Chỉnh sửa
  useEffect(() => {
    if (!isView && isCertificateRequired && fields.length === 0) {
      append(createEmptyCertificate());
    }
  }, [isView, isCertificateRequired, fields.length, append]);

  // Gợi ý vai trò tự động theo Chức vụ khi tạo tài khoản mới (nếu người dùng chưa chỉnh tay vai trò)
  useEffect(() => {
    if (
      isView ||
      hasLinkedAccount ||
      accountMode !== "CREATE" ||
      hasManuallyEditedRoles.current ||
      allRoles.length === 0
    ) {
      return;
    }
    const targetRoleNames = selectedPosition
      ? POSITION_DEFAULT_ROLES[selectedPosition] || ["STAFF"]
      : ["STAFF"];
    const matched = allRoles.filter((r) => targetRoleNames.includes(r.name));
    if (matched.length > 0) {
      setSelectedRoles(matched);
    }
  }, [selectedPosition, allRoles, accountMode, hasLinkedAccount, isView]);

  // Khi chọn 1 tài khoản chưa gán ở chế độ ASSIGN, tự động nạp danh sách vai trò hiện tại của tài khoản đó
  useEffect(() => {
    if (accountMode !== "ASSIGN" || !watchedAssignAccountId) {
      return;
    }
    const chosen = unassignedAccounts.find(
      (a) => a.id === Number(watchedAssignAccountId)
    );
    if (chosen?.roles && chosen.roles.length > 0) {
      setSelectedRoles(chosen.roles);
    }
  }, [accountMode, watchedAssignAccountId, unassignedAccounts]);

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) =>
      isUpdate ? putEmployee(id, body) : postEmployee(body),

    onSuccess: (res: any) => {
      toastSuccess(
        isUpdate
          ? "Cập nhật thông tin nhân sự thành công!"
          : "Thêm mới nhân sự thành công!"
      );
      queryClient.invalidateQueries({ queryKey: ["staff-list"] });
      queryClient.invalidateQueries({ queryKey: ["staff-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["account-list"] });
      queryClient.invalidateQueries({ queryKey: ["account-unassigned"] });
      const targetId = res?.data?.id ?? id;
      if (targetId) {
        router.push(`${ROUTES.EMPLOYEE}/${targetId}?actionType=VIEW`);
      } else {
        router.push(ROUTES.EMPLOYEE);
      }
    },

    onError: (error: any) => {
      toastError(extractErrorMessage(error));
    },
  });

  const handleChangeAccountMode = (mode: AccountSetupMode) => {
    if (isView) return;
    setAccountMode(mode);
    if (mode !== "ASSIGN") {
      setValue("assignAccountId", null);
    }
    if (mode !== "CREATE") {
      setValue("initialPassword", "");
    }
  };

  const handleToggleRole = (role: Role) => {
    if (isView) return;
    hasManuallyEditedRoles.current = true;
    setSelectedRoles((prev) =>
      prev.some((r) => r.id === role.id)
        ? prev.filter((r) => r.id !== role.id)
        : [...prev, role]
    );
  };

  const getRoleLabel = (role: Role) =>
    ROLE_LABELS[role.name] || role.description || role.name;

  const onSubmit = handleSubmit((formData) => {
    const certs = (formData.certificates ?? []).filter(
      (c) =>
        c &&
        (c.certificateType ||
          c.certificateNumber?.trim() ||
          c.issueDate ||
          c.expiryDate)
    );

    const trimmedCccd = formData.idCardNumber?.trim() || "";
    if (trimmedCccd && !/^\d{9}(\d{3})?$/.test(trimmedCccd)) {
      toastError("Số CCCD/CMND không hợp lệ (phải gồm 9 hoặc 12 chữ số)!");
      return;
    }

    // Kiểm tra mật khẩu khởi tạo nếu có nhập
    const trimmedInitPass = formData.initialPassword?.trim() || "";
    if (
      !hasLinkedAccount &&
      accountMode === "CREATE" &&
      trimmedInitPass &&
      trimmedInitPass.length < 6
    ) {
      toastError("Mật khẩu khởi tạo phải có ít nhất 6 ký tự!");
      return;
    }

    if (
      !hasLinkedAccount &&
      accountMode === "ASSIGN" &&
      !formData.assignAccountId
    ) {
      toastError("Vui lòng chọn tài khoản có sẵn cần gán cho nhân sự!");
      return;
    }

    const today = moment().startOf("day");
    const seenCertNumbers = new Set<string>();
    for (let i = 0; i < certs.length; i++) {
      const c = certs[i];
      if (
        !c.certificateType ||
        !c.certificateNumber?.trim() ||
        !c.issueDate ||
        !c.expiryDate
      ) {
        toastError(
          `Chứng chỉ #${i + 1}: Vui lòng nhập đầy đủ Loại, Số chứng chỉ, Ngày cấp và Ngày hết hạn!`
        );
        return;
      }
      if (moment(c.expiryDate).isBefore(moment(c.issueDate), "day")) {
        toastError(
          `Chứng chỉ #${i + 1}: Ngày hết hạn phải lớn hơn hoặc bằng ngày cấp!`
        );
        return;
      }
      const normNo = c.certificateNumber.trim().toLowerCase();
      if (seenCertNumbers.has(normNo)) {
        toastError(
          `Số chứng chỉ "${c.certificateNumber.trim()}" đang bị nhập trùng!`
        );
        return;
      }
      seenCertNumbers.add(normNo);
    }

    if (
      formData.position &&
      CERTIFICATE_REQUIRED_POSITIONS.has(formData.position)
    ) {
      if (certs.length === 0) {
        toastError(
          "Vị trí Kỹ sư giám sát và Chỉ huy trưởng bắt buộc phải có ít nhất 01 chứng chỉ hành nghề!"
        );
        return;
      }
      const hasValidCert = certs.some(
        (c) => c.expiryDate && !moment(c.expiryDate).isBefore(today, "day")
      );
      if (!hasValidCert) {
        toastError(
          "Vị trí Kỹ sư giám sát và Chỉ huy trưởng cần ít nhất 01 chứng chỉ hành nghề còn hiệu lực!"
        );
        return;
      }
    }

    const shouldSendRoles =
      hasLinkedAccount || accountMode === "CREATE" || accountMode === "ASSIGN";

    mutate({
      ...formData,
      status: formData.status || "WORKING",
      idCardNumber: trimmedCccd || null,
      certificates: certs.map((c) => ({
        ...c,
        certificateNumber: c.certificateNumber.trim(),
      })),
      createAccount: hasLinkedAccount ? false : accountMode === "CREATE",
      assignAccountId:
        !hasLinkedAccount && accountMode === "ASSIGN"
          ? Number(formData.assignAccountId)
          : null,
      initialPassword:
        !hasLinkedAccount && accountMode === "CREATE" && trimmedInitPass
          ? trimmedInitPass
          : null,
      mustChangePassword,
      roles: shouldSendRoles
        ? selectedRoles.map((r) => ({ id: r.id, name: r.name }))
        : undefined,
    });
  });

  useEffect(() => {
    if (isUpdate && employeeDetail) {
      reset({
        ...defaultValues,
        ...employeeDetail,
        status: employeeDetail.status || "WORKING",
        certificates: employeeDetail.certificates ?? [],
        assignAccountId: null,
        initialPassword: "",
      });

      if (employeeDetail.hasAccount) {
        setSelectedRoles((employeeDetail.roles as Role[]) || []);
        setMustChangePassword(Boolean(employeeDetail.mustChangePassword));
        hasManuallyEditedRoles.current = true;
      } else {
        setAccountMode("NONE");
        setSelectedRoles([]);
        setMustChangePassword(true);
        hasManuallyEditedRoles.current = false;
      }
    }
  }, [isUpdate, employeeDetail, reset]);

  const handleAddCertificate = () => {
    append(createEmptyCertificate());
  };

  const handleRemoveCertificate = (index: number) => {
    remove(index);
  };

  return [
    {
      isView,
      isUpdate,
      initialTab,
      isLoading,
      isSubmitting,
      control,
      id,
      fields,
      watchedEmail,
      watchedCertificates,
      isCertificateRequired,
      employeeDetail,
      hasLinkedAccount,
      accountMode,
      allRoles,
      selectedRoles,
      mustChangePassword,
      unassignedAccountOptions,
      workload,
      isLoadingWorkload,
    },
    {
      onSubmit,
      handleAddCertificate,
      handleRemoveCertificate,
      handleChangeAccountMode,
      handleToggleRole,
      setMustChangePassword,
      getRoleLabel,
    },
  ] as const;
};

export default useEmployeeSave;
