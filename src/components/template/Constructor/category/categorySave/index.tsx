import { Grid } from "@mui/material";
import router from "next/router";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreNavbar from "@/components/organism/CoreNavbar";
import PageContainer from "@/components/organism/PageContainer";
import { TopAction } from "@/components/molecules/TopAction";
import CoreLoading from "@/components/molecules/CoreLoading";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import CoreSwitch from "@/components/atoms/CoreSwitch";
import { ROUTES } from "@/routes";
import useCategorySave from "./useCategorySave";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import { toastSuccess, toastError } from "@/toast";
import { deleteCategory } from "@/service/constructor/Category/delete";

export default function CategorySave() {
  const [value, handle] = useCategorySave();
  const { isView, control, isLoading, id } = value;
  const { onSubmit } = handle;
  const { showDialog, hideDialog } = useDialog();

  const handleDelete = (id: number) => {
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa hạng mục này?</DialogContent>
        <DialogActions>
          <Button onClick={hideDialog}>Hủy</Button>
          <Button
            color="error"
            onClick={async () => {
              try {
                await deleteCategory({ id }); // dùng id trực tiếp
                toastSuccess("Xóa thành công!");
                hideDialog();
                router.push(ROUTES.CATEGORY);
              } catch (err: any) {
                toastError(err?.message || "Xóa thất bại");
              }
            }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs
            breadcrumbs={[
              { title: "Quản lý hạng mục", pathname: ROUTES.CATEGORY },
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
              rightAction: isView && (
                <TopAction
                  actionList={["delete", "edit"]}
                  onEditAction={() => {
                    router.push({
                      pathname: `${ROUTES.CATEGORY}/[id]`,
                      query: { id: Number(id) },
                    });
                  }}
                  onDeleteAction={() => handleDelete(id)}
                />
              ),
              content: isLoading ? (
                <CoreLoading />
              ) : (
                <form className="flex flex-col py-6" onSubmit={onSubmit}>
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="code"
                        label="Mã hạng mục"
                        placeholder="Nhập mã hạng mục"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="name"
                        label="Tên hạng mục"
                        placeholder="Nhập tên hạng mục"
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
                      <CoreButton onClick={() => {}} theme="cancel">
                        Hủy bỏ
                      </CoreButton>
                      <CoreButton
                        theme="submit"
                        type="submit"
                        loading={isLoading}
                      >
                        Lưu
                      </CoreButton>
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
