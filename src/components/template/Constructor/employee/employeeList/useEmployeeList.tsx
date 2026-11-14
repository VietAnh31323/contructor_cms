import {
  CERTIFICATE_REQUIRED_POSITIONS,
  DEPARTMENT_OPTIONS,
  getOptionLabel,
  POSITION_OPTIONS,
  ROLE_SHORT_LABELS,
  STAFF_STATUS_OPTIONS,
  WORKLOAD_LEVEL_META,
} from "../constants";
import { ROUTES } from "@/routes";
import { useEmployeeListQuery } from "@/service/constructor/Employee/getList";
import { RequestBody } from "@/service/constructor/Employee/getList/type";
import { Chip, Stack, Tooltip } from "@mui/material";
import _ from "lodash";
import moment from "moment";
import router from "next/router";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const defaultValues: RequestBody["GET"] = {
  search: "",
  position: null,
  department: null,
  status: null,
  page: 0,
  size: 20,
};

const useEmployeeList = () => {
  const methodForm = useForm<RequestBody["GET"]>({
    defaultValues,
  });
  const { handleSubmit, control, reset } = methodForm;

  const [queryPage, setQueryPage] = useState<RequestBody["GET"]>(
    _.omitBy(defaultValues, _.isNil)
  );

  const { data, isLoading } = useEmployeeListQuery(queryPage);

  const onSubmit = handleSubmit((input) => {
    setQueryPage({
      ...input,
      page: 0,
      size: queryPage.size ?? 20,
    });
  });

  const onReset = () => {
    reset(defaultValues);
    setQueryPage({ page: 0, size: 20 });
  };

  const onChangePageSize = (val: { page?: number; size?: number }) => {
    setQueryPage((prev) => ({
      ...prev,
      page: val.page ?? 0,
      size: val.size ?? 20,
    }));
  };

  const columns = useMemo(
    () => [
      { header: "Mã nhân sự", fieldName: "code" },
      { header: "Họ và tên", fieldName: "name" },
      { header: "Chức vụ", fieldName: "positionLabel" },
      { header: "Phòng ban", fieldName: "departmentLabel" },
      { header: "Tài khoản", fieldName: "accountSummary" },
      { header: "Tải DA / Công việc", fieldName: "workloadSummary" },
      { header: "Chứng chỉ hành nghề", fieldName: "certificateSummary" },
      { header: "Trạng thái", fieldName: "statusBadge" },
    ],
    []
  );

  const rawPage: any = data?.data;
  const content = rawPage?.content ?? [];
  const page = rawPage?.page ?? queryPage.page ?? 0;
  const size = rawPage?.size ?? queryPage.size ?? 20;
  const totalPages = rawPage?.totalPages ?? 1;

  const tableData = content.map((item: any) => {
    const statusOpt = STAFF_STATUS_OPTIONS.find((s) => s.value === item.status);
    const certCount = item.certificateCount ?? 0;
    const expiredCount = item.expiredCertificateCount ?? 0;
    const expiringCount = item.expiringSoonCertificateCount ?? 0;
    const requiresCert =
      item.position && CERTIFICATE_REQUIRED_POSITIONS.has(item.position);

    let certificateSummary: React.ReactNode = "—";
    if (certCount === 0) {
      certificateSummary = requiresCert ? (
        <Chip
          size="small"
          color="error"
          variant="outlined"
          label="Thiếu chứng chỉ bắt buộc"
        />
      ) : (
        <span className="text-gray-400">Chưa có</span>
      );
    } else {
      certificateSummary = (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          <Chip
            size="small"
            color="primary"
            variant="outlined"
            label={`${certCount} chứng chỉ`}
          />
          {expiredCount > 0 && (
            <Chip
              size="small"
              color="error"
              label={`${expiredCount} hết hạn`}
            />
          )}
          {expiringCount > 0 && (
            <Chip
              size="small"
              color="warning"
              label={`${expiringCount} sắp hết hạn`}
            />
          )}
        </Stack>
      );
    }

    // 2.03: Tóm tắt tài khoản & phân quyền
    let accountSummary: React.ReactNode = (
      <Chip size="small" variant="outlined" label="Chưa cấp TK" />
    );
    if (item.hasAccount) {
      const isLocked = item.accountStatus && item.accountStatus !== "ACTIVE";
      const roles: any[] = item.roles ?? [];
      accountSummary = (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          <Chip
            size="small"
            color={isLocked ? "error" : "success"}
            variant="outlined"
            label={isLocked ? "TK khóa" : "Đã cấp TK"}
          />
          {roles.slice(0, 2).map((r) => (
            <Chip
              key={r.id ?? r.name}
              size="small"
              label={ROLE_SHORT_LABELS[r.name] || r.name}
            />
          ))}
          {roles.length > 2 && (
            <Chip size="small" label={`+${roles.length - 2}`} />
          )}
        </Stack>
      );
    }

    // 2.04: Tóm tắt tải dự án & công việc (click mở thẳng tab Dự án & Công việc)
    const activeProjects = item.activeProjectCount ?? 0;
    const activeTasks = item.activeTaskCount ?? 0;
    const overdueTasks = item.overdueTaskCount ?? 0;
    const wlLevel = item.workloadLevel || "NORMAL";
    const wlMeta = WORKLOAD_LEVEL_META[wlLevel] || WORKLOAD_LEVEL_META.NORMAL;

    const workloadSummary = (
      <Tooltip title="Nhấn để xem chi tiết dự án & công việc đang tham gia">
        <Stack
          direction="row"
          spacing={0.5}
          flexWrap="wrap"
          useFlexGap
          onClick={(e) => {
            e.stopPropagation();
            router.push({
              pathname: `${ROUTES.EMPLOYEE}/${item.id}`,
              query: { actionType: "VIEW", tab: "workload" },
            });
          }}
          sx={{ cursor: "pointer" }}
        >
          <Chip
            size="small"
            color={wlMeta.color}
            variant={wlLevel === "NORMAL" ? "outlined" : "filled"}
            label={`${activeProjects} DA • ${activeTasks} CV`}
          />
          {overdueTasks > 0 && (
            <Chip
              size="small"
              color="error"
              label={`${overdueTasks} trễ`}
            />
          )}
        </Stack>
      </Tooltip>
    );

    return {
      ...item,
      positionLabel: getOptionLabel(item.position, POSITION_OPTIONS),
      departmentLabel: getOptionLabel(item.department, DEPARTMENT_OPTIONS),
      phoneDisplay: item.phone || "—",
      joinDateDisplay: item.joinDate
        ? moment(item.joinDate).format("DD/MM/YYYY")
        : "—",
      accountSummary,
      workloadSummary,
      certificateSummary,
      statusBadge: (
        <Chip
          size="small"
          color={statusOpt?.color ?? "default"}
          label={statusOpt?.label ?? item.status ?? "Đang làm việc"}
        />
      ),
    };
  });

  return [
    {
      columns,
      tableData,
      page,
      size,
      totalPages,
      isLoading,
      control,
    },
    {
      onSubmit,
      onReset,
      onChangePageSize,
    },
  ] as const;
};

export default useEmployeeList;
