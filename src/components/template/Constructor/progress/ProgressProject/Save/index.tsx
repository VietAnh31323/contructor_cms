import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreNavbar from "@/components/organism/CoreNavbar";

import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import CoreSwitch from "@/components/atoms/CoreSwitch";
import { ROUTES } from "@/routes";
import useProgressProjectSave from "./useProgressProjectSave";
import CoreLoading from "@/components/molecules/CoreLoading";
import { TopAction } from "@/components/molecules/TopAction";
import router from "next/router";
import { toastError, toastSuccess } from "@/toast";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { deleteProgress } from "@/service/constructor/Progress/delete";
import { usePermission } from "@/components/hooks/permission/usePermission";
import { PERMISSIONS } from "@/helper/permissions";
import { ActionType } from "@/components/molecules/TopAction";
export default function ProgressProjectSave() {
  const [value, handle] = useProgressProjectSave();
  const { isView, control, isLoading, id } = value;
  const { onSubmit } = handle;
  const { showDialog, hideDialog } = useDialog();
  const { hasPermission } = usePermission();
  const canUpdateProgress = hasPermission([
    PERMISSIONS.PROGRESS_UPDATE,
    PERMISSIONS.PROJECT_UPDATE,
  ]);
  const topActions: ActionType[] = [
    ...(hasPermission(PERMISSIONS.PROJECT_DELETE)
      ? (["delete"] as ActionType[])
      : []),
    ...(canUpdateProgress ? (["edit"] as ActionType[]) : []),
  ];
  const handleDelete = (id: number) => {
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa hạng mục này?</DialogContent>
        <DialogActions>
          <CoreButton onClick={hideDialog}>Hủy</CoreButton>
          <CoreButton
            color="error"
            onClick={async () => {
              try {
                await deleteProgress({ id });
                toastSuccess("Xóa thành công!");
                hideDialog();
                router.push(ROUTES.PROGRESS_PROJECT);
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
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs
            breadcrumbs={[
              {
                title: "Quản lý tiến trình",
                pathname: ROUTES.PROGRESS_PROJECT,
              },
              { title: isView ? "Chi tiết" : "Chỉnh sửa" },
            ]}
          />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={[
            {
              title: isView ? "Chi tiết" : "Chỉnh sửa",
              rightAction: isView && topActions.length > 0 && (
                <TopAction
                  actionList={topActions}
                  onEditAction={() => {
                    router.push({
                      pathname: `${ROUTES.PROGRESS_PROJECT}/[id]`,
                      query: { id: Number(id) },
                    });
                  }}
                  onDeleteAction={() => handleDelete(id)}
                />
              ),
              content: isLoading ? (
                <CoreLoading />
              ) : (
                <form className="flex flex-col py-6 " onSubmit={onSubmit}>
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <CoreInputCustom
                        control={control}
                        name="code"
                        label="Mã tiến trình"
                        placeholder="Nhập mã tiến trình"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <CoreInputCustom
                        control={control}
                        name="name"
                        label="Tên tiến trình"
                        placeholder="Nhập tên tiến trình"
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <CoreInputCustom
                        control={control}
                        name="description"
                        label="Mô tả"
                        placeholder="Nhập mô tả"
                        variant="standard"
                        multiline
                        rows={4}
                        sx={{ width: "100%", padding: "0" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <CoreSwitch
                        control={control}
                        name="isActive"
                        label="Trạng thái"
                      />
                    </Grid>
                  </Grid>
                  {!isView && (
                    <div className="py-4 flex justify-center gap-4 items-center">
                      <CoreButton
                        onClick={() => router.push(ROUTES.PROGRESS_PROJECT)}
                        theme="cancel"
                      >
                        {"Hủy bỏ"}
                      </CoreButton>
                      {canUpdateProgress && (
                        <CoreButton
                          theme="submit"
                          type="submit"
                          loading={isLoading}
                        >
                          {"Lưu"}
                        </CoreButton>
                      )}
                    </div>
                  )}
                </form>
              ),
            },
          ]}
        />
      </PageContainer>
    </Grid>
  );
}
