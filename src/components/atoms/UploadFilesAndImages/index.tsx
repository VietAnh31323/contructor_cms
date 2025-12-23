import { useDialog } from "@/components/hooks/dialog/useDialog";
import { DialogSwiper } from "@/components/molecules/ViewFile/DialogSwiper";
import { GREY, PRIMARY } from "@/helper/colors";
// import { downloadFileUpload } from '@/service/resource/dowloadFile'
import { fileUpload } from "@/service/upload";
import { toastError, toastSuccess } from "@/toast";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { CoreImage } from "../CoreImage";

type Props = {
  nameDynamic: string;
  isViewProp?: boolean;
};

const UploadFilesAndImages = ({ nameDynamic = "files", isViewProp }: Props) => {
  const router = useRouter();
  const { actionType } = router.query;
  const isView = isViewProp ?? actionType === "VIEW";
  const { showDialog, hideDialog } = useDialog();
  const { t } = useTranslation();

  const { control } = useFormContext<{
    [key: string]: { id?: number | null; name: string; url: string }[];
  }>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenFileInput = () => {
    inputRef.current && inputRef.current?.click();
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: nameDynamic,
    keyName: "key",
  });

  const [loading, setLoading] = useState(false);

  const { mutate } = useMutation({
    onSuccess: async (res: any, { nameDocument, handleCloseParent }) => {
      try {
        const blob = new Blob([res.data], {
          type: res.headers["content-type"],
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${nameDocument}`;
        link.click();
        toastSuccess("Tải xuống thành công");
        handleCloseParent?.();
      } catch (error) {
        toastError(error);
      }
    },
    onError: toastError,
  });

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target?.files;
    setLoading(true);
    if (selectedFiles?.length && selectedFiles?.length > 0) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFiles[0]);
        const res = await fileUpload(formData, {
          featureAlias: "resources_feature1",
        });

        if (res?.data) {
          append({
            id: res?.data?.data?.uploadFile?.id,
            name: selectedFiles[0]?.name,
            url: res?.data?.data?.url,
          });
        } else {
          toastError("Upload file thất bại");
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        toastError(e);
      }
    }
  };

  const fileList = fields
    .map((i, index) => ({ ...i, index }))
    .filter((x) =>
      ["pdf", "docx"].includes(
        x?.name.split(".").pop()?.toLowerCase() as string
      )
    );

  const imageList = fields
    .map((i, index) => ({ ...i, index }))
    .filter((x) =>
      ["jpeg", "jpg", "png"].includes(
        x?.name.split(".").pop()?.toLowerCase() as string
      )
    );

  const isHasFile = fileList.length > 0 || imageList.length > 0;

  return (
    <Box className="flex items-center">
      <Box>
        {!isView && (
          <div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "350px",
                height: "78px",
                bgcolor: "#E8F0FF",
                border: "1px dashed #3E74D0",
                borderRadius: "8px",
                mb: "10px",
                cursor: "pointer",
                color: "#1D4FA3",
                fontWeight: 500,
              }}
              onClick={handleOpenFileInput}
            >
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  <Image
                    src={require("@/assets/svg/ic_attach_file.svg")}
                    alt="attach"
                  />
                  Upload file
                  <input
                    ref={inputRef}
                    className="hidden"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                    onChange={handleFileUpload}
                    multiple
                  />
                </>
              )}
            </Box>
            <Typography
              variant="caption"
              color={GREY}
              fontSize={13}
              className="w-full"
            >
              Ghi chú: Upload file với các định dạng [jpg, jpeg, png, pdf]
            </Typography>
          </div>
        )}

        <div>
          {fileList.length > 0 ? (
            <Box>
              {fileList.map((item) => {
                const extension = item.name.split(".").pop()?.toLowerCase();
                const isPreviewable = ["pdf"].includes(extension || "");
                return (
                  <Box
                    key={item?.key}
                    className="flex items-center justify-between w-[350px] mb-5 cursor-pointer mt-3"
                    onClick={() => {
                      if (isPreviewable) {
                        showDialog(
                          <DialogSwiper
                            hideDialog={hideDialog}
                            mainIndex={item.index}
                            contents={fileList.map((f) => ({
                              name: f.name,
                              src: f.url,
                            }))}
                          />
                        );
                      } else {
                        mutate({
                          urlDownload: item.url,
                          nameDocument: item.name,
                        });
                      }
                    }}
                  >
                    <Box className="flex items-center space-x-4">
                      <Image src={require("@/assets/svg/pdf.svg")} alt="pdf" />
                      <Typography color={PRIMARY}>{item.name}</Typography>
                    </Box>
                    {!isView && (
                      <Image
                        src={require("@/assets/svg/icon_delete_image.svg")}
                        alt="delete"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(item.index);
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          ) : !isHasFile ? (
            <div className="flex mt-5">
              <Typography variant="caption" color={GREY} fontSize={13}>
                {"Không file hoặc ảnh nào được chọn"}
              </Typography>
            </div>
          ) : null}
        </div>
      </Box>

      {imageList.length > 0 && (
        <Box className={!isView ? "flex ml-20 gap-8" : "mt-5 "}>
          {imageList.map((i) => (
            <Box
              key={i?.key}
              className="mr-15 w-[100px] h-[100px] flex relative cursor-pointer "
              onClick={() =>
                showDialog(
                  <DialogSwiper
                    hideDialog={hideDialog}
                    mainIndex={i.index}
                    contents={imageList.map((img) => ({
                      name: img.name,
                      src: img.url,
                    }))}
                  />
                )
              }
            >
              <CoreImage
                src={i?.url}
                alt="img"
                width={100}
                height={100}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              {!isView && (
                <Image
                  src={require("@/assets/svg/icon_delete_image.svg")}
                  alt="delete"
                  className="absolute top-[-10px] right-[-10px] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(i.index);
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UploadFilesAndImages;
