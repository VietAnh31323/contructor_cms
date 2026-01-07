import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";

import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreNavbar from "@/components/organism/CoreNavbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import useConstructionProjectSave from "./useConstructionProjectSave";
import { RowBoxCommon } from "@/components/atoms/RowBoxCommon";
import EditText from "@/components/atoms/EditText";
import upload from "@/assets/png/upload.png";
import CoreAutoCompleteAPI from "@/components/atoms/CoreAutoCompleteAPI";
import { getCategoryList } from "@/service/constructor/Category/getList";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import NineDot from "@/components/icons/NineDot";
import { Action } from "@/components/molecules/Action";
import { getEmployeeList } from "@/service/constructor/Employee/getList";
import UploadFilesAndImages from "@/components/atoms/UploadFilesAndImages";
import { CoreDatePicker } from "@/components/atoms/CoreDatePicker";
import CoreInputMoney from "@/components/atoms/CoreInputMoney";
import router from "next/router";
import { ROUTES } from "@/routes";
import { TopAction } from "@/components/molecules/TopAction";
import { deleteProject } from "@/service/constructor/Project/delete";
import { toastError, toastSuccess } from "@/toast";
import { useDialog } from "@/components/hooks/dialog/useDialog";
export default function ConstructionProjectSave() {
  const [value, handle] = useConstructionProjectSave();
  const {
    isView,
    page,
    rowsPerPage,
    control,
    isUpdate,
    isLoading,
    id,
    methodForm,
    fields,
    watch,
    setValue,
  } = value;
  const { setPage, setRowsPerPage, onSubmit, append, remove, handleDragEnd } =
    handle;
  const { showDialog, hideDialog } = useDialog();
  const contractValue = watch("contractValue") || 0;
  const contractAdvance = watch("contractAdvance") || 0;
  const projectLines = watch("projectLines") || [];
  const totalPaid = projectLines.reduce(
    (sum: number, item: any) => sum + (Number(item?.paymentAmount) || 0),
    0
  );
  const remainingAmount =
    Number(contractValue || 0) - Number(contractAdvance || 0) - totalPaid;

  useEffect(() => {
    const remain = Math.max(remainingAmount, 0);

    // set số tiền còn lại
    setValue("remainingAmount", remain);

    // nếu đã thanh toán đủ
    if (remain <= 0) {
      setValue("state", "COMPLETED");
    }
  }, [contractValue, contractAdvance, projectLines, setValue]);
  // const [date, setDate] = useState<Date | null>(null);
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
                await deleteProject({ id }); // dùng id trực tiếp
                toastSuccess("Xóa thành công!");
                hideDialog();
                router.push(ROUTES.PROJECT);
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
  const [editorText, setEditorText] = useState("");
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        overflowY: "auto",
      }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs
            breadcrumbs={[{ title: "Quản lý dự án" }, { title: "Thêm mới" }]}
          />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Thêm mới",
              rightAction: isView && (
                <TopAction
                  actionList={["delete", "edit"]}
                  onEditAction={() => {
                    router.push({
                      pathname: `${ROUTES.PROJECT}/[id]`,
                      query: { id: Number(id) },
                    });
                  }}
                  onDeleteAction={() => handleDelete(id)}
                />
              ),
              content: (
                <FormProvider {...methodForm}>
                  <form className="flex flex-col py-6 " onSubmit={onSubmit}>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputCustom
                          control={control}
                          name="code"
                          label="Mã hồ sơ"
                          placeholder="Nhập mã hồ sơ"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputCustom
                          control={control}
                          name="name"
                          label="Tên công trình dự án"
                          placeholder="Nhập tên công trình dự án"
                          required
                          rules={{ required: "Trường này là bắt buộc" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputCustom
                          control={control}
                          name="owner"
                          label="Chủ đầu tư"
                          placeholder="Nhập tên chủ đầu tư"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputCustom
                          control={control}
                          name="address"
                          label="Địa chỉ"
                          placeholder="Nhập địa chỉ"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputMoney
                          control={control}
                          name="contractValue"
                          label="Giá trị hợp đồng"
                          placeholder="Nhập giá trị hợp đồng"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputMoney
                          control={control}
                          name="contractAdvance"
                          label="Tạm ứng hợp đồng"
                          placeholder="Hợp đồng đã tạm ứng"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputMoney
                          control={control}
                          name="remainingAmount"
                          label="Số tiền còn lại"
                          placeholder="Số tiền còn lại của hợp đồng"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreDatePicker
                          name="signDate"
                          control={control!}
                          label={"Ngày kí hợp đồng"}
                          required={!isView}
                          placeholder="Chọn ngày ký hợp đồng"
                          rules={{
                            required: "Bạn phải chọn ngày kí hợp đồng",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreDatePicker
                          name="deliveryDate"
                          control={control!}
                          label={"Ngày giao hồ sơ dự kiến"}
                          required={!isView}
                          placeholder="Chọn ngày giao hồ sơ dự kiến"
                          rules={{
                            required: "Bạn phải chọn giao hồ sơ dự kiến",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          Hạng mục
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreAutoCompleteAPI
                          control={control}
                          name="projectCategoryMaps"
                          label="Hạng mục"
                          placeholder="Chọn hạng mục"
                          fetchDataFn={getCategoryList}
                          multiple
                          params={{
                            isActive: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          Nhân sự dự án
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreAutoCompleteAPI
                          control={control}
                          name="creator"
                          label="Người tạo dự án"
                          placeholder=" "
                          fetchDataFn={getEmployeeList}
                          // multiple
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreAutoCompleteAPI
                          control={control}
                          name="manager"
                          label="Chủ nhiệm dự án"
                          placeholder=" "
                          fetchDataFn={getEmployeeList}
                          // multiple
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreAutoCompleteAPI
                          control={control}
                          name="supporter"
                          label="Nhân viên chăm sóc"
                          placeholder=" "
                          fetchDataFn={getEmployeeList}
                          // multiple
                        />
                      </Grid>
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        Thanh toán
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
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
                                              md={6}
                                              lg={6}
                                            >
                                              <CoreDatePicker
                                                name={`projectLines.${index}.paymentDate`}
                                                control={control}
                                                label="Ngày thanh toán"
                                                // required={!isView}
                                                placeholder="Chọn ngày thanh toán"
                                                // rules={{
                                                //   required:
                                                //     "Bạn phải chọn ngày thanh toán",
                                                // }}
                                              />
                                            </Grid>

                                            <Grid
                                              item
                                              xs={12}
                                              sm={12}
                                              md={6}
                                              lg={6}
                                            >
                                              <CoreInputMoney
                                                control={control}
                                                name={`projectLines.${index}.paymentAmount`}
                                                label={`Thanh toán lần ${
                                                  index + 1
                                                }`}
                                                placeholder="Nhập số tiền thanh toán"
                                                type="number"
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
                                                paymentDate: "",
                                                paymentNo: fields.length + 1,
                                                paymentAmount: 0,
                                              })
                                            }
                                            onRemoveAction={() => remove(index)}
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
                    <br />
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      {remainingAmount <= 0 && (
                        <RowBoxCommon
                          title="Trạng thái thanh toán"
                          data="Đã thanh toán đủ"
                          className="text-green-500"
                        />
                      )}
                      {remainingAmount > 0 && (
                        <RowBoxCommon
                          title="Trạng thái thanh toán"
                          data="Chưa thanh toán đủ"
                          className="text-red-500"
                        />
                      )}
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        Mô tả dự án
                      </Typography>
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <EditText
                        editorText={editorText}
                        setEditorText={setEditorText}
                        disabled={false}
                        error={
                          editorText.length === 0
                            ? "Vui lòng nhập nội dung"
                            : ""
                        }
                        height={300}
                      />
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        Ghi chú
                      </Typography>
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <CoreInputCustom
                        control={control}
                        name="note"
                        label="Ghi chú"
                        placeholder="Nhập ghi chú cho dự án"
                        rows={4}
                        multiline
                      />
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreAutocomplete
                        control={control}
                        name="state"
                        label="Trạng thái"
                        placeholder=" "
                        options={[
                          { label: "Chưa bắt đầu", value: "NOT_STARTED" },
                          { label: "Hoàn thành", value: "IN_PROGRESS" },
                          { label: "Đang thực hiện", value: "COMPLETED" },
                        ]}
                      />
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          marginBottom: 2,
                        }}
                      >
                        Hợp đồng dự án
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <UploadFilesAndImages nameDynamic={`contractFiles`} />
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          marginBottom: 2,
                        }}
                      >
                        Hình ảnh mẫu
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <UploadFilesAndImages nameDynamic={`sampleImages`} />
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          marginBottom: 2,
                        }}
                      >
                        Hình ảnh công trình
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <UploadFilesAndImages nameDynamic={`projectImages`} />
                    </Grid>
                    <div className="py-4 flex justify-center gap-4 items-center">
                      <CoreButton
                        onClick={() => {
                          router.push(ROUTES.PROJECT);
                        }}
                        theme="cancel"
                      >
                        {"Hủy bỏ"}
                      </CoreButton>
                      <CoreButton type="submit" theme="submit">
                        {"Lưu"}
                      </CoreButton>
                    </div>
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
