import CoreNavbar from "@/components/organism/CoreNavbar";
import {
  ColumnProps,
  TableCollapse,
} from "@/components/organism/TableCollapse";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import CollapseRow from "./CollapseRow";
import { useMemo, useState } from "react";
import { CategoryList } from "@/service/constructor/Category/getList/type";
import { CoreButton } from "@/components/atoms/CoreButton";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import Task from "../../Dialog/Task";
import { useParams, useSearchParams } from "next/navigation";
import { ROUTES } from "@/routes";
import { deleteCategory } from "@/service/constructor/Category/delete";
import { toastSuccess, toastError } from "@/toast";
import router from "next/router";
import { deleteTask } from "@/service/constructor/Task/delete";
export type WorkProgressRow = {
  id: number;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  remainingTime: string;
  reviewer: string;
  taskStaffMaps: string;
  progress: number;
  priorityLevel: "HIGH" | "MEDIUM" | "LOW";
};

export default function MainTaskSection() {
  const searchParams = useSearchParams();
  const params = useParams();

  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const { showDialog, hideDialog } = useDialog();
  const handleDelete = (id: number) => {
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa Công việc này?</DialogContent>
        <DialogActions>
          <CoreButton onClick={hideDialog}>Hủy</CoreButton>
          <CoreButton
            theme="cancel"
            onClick={async () => {
              try {
                await deleteTask({ id });

                // ⭐ QUAN TRỌNG NHẤT
                setTableData((prev) => prev.filter((item) => item.id !== id));

                toastSuccess("Xóa thành công!");
                hideDialog();
              } catch (err: any) {
                toastError(err?.message || "Xóa thất bại");
              }
            }}
          >
            Đồng ý
          </CoreButton>
        </DialogActions>
      </Dialog>
    );
  };

  const columns = useMemo(
    () =>
      [
        {
          header: "Mã công việc",
          fieldName: "code",
        },
        {
          header: "Tên công việc",
          fieldName: "name",
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
          fieldName: "reviewer",
        },
        {
          header: "Công việc được giao cho",
          fieldName: "taskStaffMaps",
        },
        {
          header: "Tiến độ (%)",
          fieldName: "progress",
        },
        {
          header: "Mức độ ưu tiên",
          fieldName: "priorityLevel",
        },
        {
          header: "",
          render: (row: WorkProgressRow) => (
            <CoreButton theme="cancel" onClick={() => handleDelete(row.id)}>
              Xóa công việc cha
            </CoreButton>
          ),
        },
      ] as ColumnProps[],
    []
  );

  const [tableData, setTableData] = useState<WorkProgressRow[]>([]);
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
                    showDialog(
                      <Task
                        onSubmitSuccess={(row) => {
                          console.log("ROW RECEIVED:", row);
                          setTableData((prev) => [row, ...prev]);
                          setSelectedTaskId(row.id);
                        }}
                      />
                    );
                  }}
                  disabled={isView}
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
