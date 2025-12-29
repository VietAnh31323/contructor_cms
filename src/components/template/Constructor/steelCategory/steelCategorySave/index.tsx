import { Grid, Typography } from "@mui/material";
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
import useCategorySave from "./useSteelCategorySave";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { toastSuccess, toastError } from "@/toast";
import { deleteCategory } from "@/service/constructor/Category/delete";
import useSteelCategorySave from "./useSteelCategorySave";
import UploadFilesAndImages from "@/components/atoms/UploadFilesAndImages";
import { FormProvider } from "react-hook-form";
import { deleteSteelCategory } from "@/service/constructor/SteelCategory/delete";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import NineDot from "@/components/icons/NineDot";
import { Action } from "@/components/molecules/Action";
import UploadFilesAndImagesCustom from "@/components/atoms/UploadFilesAndImagesCustom";

export default function SteelCategorySave() {
  const [value, handle] = useSteelCategorySave();
  const { isView, control, isLoading, id, methodForm, fields } = value;
  const { onSubmit, append, remove, handleDragEnd } = handle;
  const { showDialog, hideDialog } = useDialog();

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
                await deleteSteelCategory({ id }); // dùng id trực tiếp
                toastSuccess("Xóa thành công!");
                hideDialog();
                router.push(ROUTES.STEELCATEGORY);
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
      sx={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs
            breadcrumbs={[
              {
                title: "Quản lý kiểu thanh thép",
                pathname: ROUTES.STEELCATEGORY,
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
              rightAction: isView && (
                <TopAction
                  actionList={["delete", "edit"]}
                  onEditAction={() => {
                    router.push({
                      pathname: `${ROUTES.STEELCATEGORY}/[id]`,
                      query: { id: Number(id) },
                    });
                  }}
                  onDeleteAction={() => handleDelete(id)}
                />
              ),
              content: isLoading ? (
                <CoreLoading />
              ) : (
                <FormProvider {...methodForm}>
                  <form className="flex flex-col py-6" onSubmit={onSubmit}>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputCustom
                          control={control}
                          name="code"
                          label="Mã kiểu thanh thép"
                          placeholder="Nhập mã kiểu thanh thép"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputCustom
                          control={control}
                          name="name"
                          label="Tên kiểu thanh thép"
                          placeholder="Nhập tên kiểu thanh thép"
                          required
                          rules={{
                            required: "Bạn phải nhập tên kiểu thanh thép",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          Hình ảnh kiểu thanh thép
                        </Typography>
                        <br />
                        <UploadFilesAndImagesCustom nameDynamic={`images`} />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          Thông số thép hình
                        </Typography>
                        <br />
                        <Grid>
                          <div className="mt-2">
                            <DragDropContext onDragEnd={handleDragEnd}>
                              <Droppable droppableId="projectLines">
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex flex-col gap-4"
                                  >
                                    {fields.map((item, index) => (
                                      <Draggable
                                        key={item.id}
                                        draggableId={`projectLines-${item.id}`}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="p-3  bg-white shadow-sm"
                                          >
                                            <div className="flex items-center gap-[10px]">
                                              <div
                                                {...provided.dragHandleProps}
                                                className="cursor-grab flex items-center"
                                              >
                                                <NineDot />
                                              </div>

                                              <div className="flex flex-1 gap-[10px] items-center">
                                                <Grid
                                                  item
                                                  xs={12}
                                                  sm={12}
                                                  md={12}
                                                  lg={12}
                                                >
                                                  <CoreInputCustom
                                                    control={control}
                                                    name={`steelCategoryLines.${index}.paramName`}
                                                    label={`Tên thông số ${
                                                      index + 1
                                                    }`}
                                                    placeholder="Nhập tên thông số"
                                                  />
                                                </Grid>
                                              </div>

                                              {/* Actions */}
                                              <Action
                                                actionList={
                                                  isView
                                                    ? []
                                                    : fields.length > 1
                                                    ? ["append", "remove"]
                                                    : ["append"]
                                                }
                                                onAppendAction={() =>
                                                  append({
                                                    id: 0,
                                                    paramName: "",
                                                  })
                                                }
                                                onRemoveAction={() =>
                                                  remove(index)
                                                }
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}

                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </DragDropContext>
                          </div>
                        </Grid>
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
                </FormProvider>
              ),
            },
          ]}
        />
      </PageContainer>
    </Grid>
  );
}
