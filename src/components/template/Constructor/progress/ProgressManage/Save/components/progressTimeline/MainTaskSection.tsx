import CoreNavbar from "@/components/organism/CoreNavbar";
import {
  ColumnProps,
  TableCollapse,
} from "@/components/organism/TableCollapse";
import { Box, Button, Typography } from "@mui/material";
import CollapseRow from "./CollapseRow";
import { useMemo } from "react";
import { CategoryList } from "@/service/constructor/Category/getList/type";
import { CoreButton } from "@/components/atoms/CoreButton";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import Task from "../../Dialog/Task";
export type WorkProgressRow = {
  id: number;
  code: string; // Mã công việc
  productionRequest: string; // Tên công việc
  startTime: string; // Thời gian bắt đầu
  endTime: string; // Thời gian kết thúc
  remainingTime: string; // Thời gian còn lại
  createdBy: string; // Người tạo
  progress: number; // Tiến độ (%)
  status: "DONE" | "PROCESSING"; // Trạng thái
};

export default function MainTaskSection() {
  const { showDialog } = useDialog();
  const columns = useMemo(
    () =>
      [
        {
          header: "Mã công việc",
          fieldName: "code",
        },
        {
          header: "Tên công việc",
          fieldName: "productionRequest",
        },
        {
          header: "Thời gian bắt đầu",
          fieldName: "startTime",
        },
        {
          header: "Thời gian kết thúc",
          fieldName: "endTime",
        },
        {
          header: "Thời gian còn lại",
          fieldName: "remainingTime",
        },
        {
          header: "Người tạo",
          fieldName: "createdBy",
        },
        {
          header: "Tiến độ (%)",
          fieldName: "progress",
        },
        {
          header: "Trạng thái",
          fieldName: "status",
        },
      ] as ColumnProps[],
    []
  );

  const tableData: WorkProgressRow[] = [
    {
      id: 1,
      code: "CV-001",
      productionRequest: "Thi công móng cọc",
      startTime: "01/12/2025",
      endTime: "10/12/2025",
      remainingTime: "2 ngày",
      createdBy: "Nguyễn Văn A",
      progress: 80,
      status: "PROCESSING",
    },
    {
      id: 2,
      code: "CV-002",
      productionRequest: "Đổ bê tông tầng 1",
      startTime: "05/12/2025",
      endTime: "15/12/2025",
      remainingTime: "0 ngày",
      createdBy: "Trần Thị B",
      progress: 100,
      status: "DONE",
    },
  ];
  return (
    <Box mt={2}>
      <CoreNavbar
        isFitContent
        breadcrumbs={[
          {
            title: "Task",
            content: (
              <Box
                sx={{
                  overflowX: "auto",
                  // width: "100vw",
                }}
              >
                <TableCollapse
                  nameCheck="code"
                  columns={columns}
                  data={tableData}
                  isShowColumnStt
                  tableName="abc"
                  paginationHidden
                  // totalPages={totalPages}
                  // onChangePageSize={onChangePageSize}
                  // isLoading={isLoadingTable}
                  // page={page}
                  // size={size}
                  // onRowClick={(id) => {
                  //   router.push({
                  //     pathname: `${RO}/[id]`,
                  //     query: { id, actionType: "VIEW" },
                  //   });
                  // }}
                  renderCollapse={(row) => {
                    return <CollapseRow row={row.id} />;
                  }}
                />
                <br />
                <CoreButton
                  onClick={() => {
                    showDialog(<Task />);
                  }}
                >
                  Thêm Công việc mới
                </CoreButton>
              </Box>
            ),
          },
        ]}
      />
    </Box>
  );
}
