"use client";

import { useDialog } from "@/components/hooks/dialog/useDialog";
import { DialogSwiper } from "@/components/molecules/ViewFile/DialogSwiper";
import { GREY, PRIMARY } from "@/helper/colors";
import { fileUpload } from "@/service/upload";
import { toastError, toastSuccess } from "@/toast";
import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { CoreImage } from "../CoreImage";

/* ================= TYPES ================= */

type UploadItem = {
  name: string;
  url: string;
  type: string;
};

type Props = {
  nameDynamic: string;
  isViewProp?: boolean;
};

/* ================= HELPERS ================= */

const safeText = (v: unknown): string =>
  typeof v === "string" || typeof v === "number" ? String(v) : "";

/* ================= COMPONENT ================= */

const UploadFilesAndImagesCustom = ({
  nameDynamic = "images",
  isViewProp,
}: Props) => {
  const router = useRouter();
  const { actionType } = router.query;
  const isView = isViewProp ?? actionType === "VIEW";

  const { showDialog, hideDialog } = useDialog();

  const { control } = useFormContext<Record<string, UploadItem[]>>();

  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  /* ================= FIELD ARRAY ================= */

  const { fields, append, remove } = useFieldArray({
    control,
    name: nameDynamic,
    keyName: "key",
  }) as {
    fields: (UploadItem & { key: string })[];
    append: (value: UploadItem) => void;
    remove: (index: number) => void;
  };

  /* ================= DOWNLOAD ================= */

  const { mutate } = useMutation({
    mutationFn: async ({
      urlDownload,
      nameDocument,
    }: {
      urlDownload: string;
      nameDocument: string;
    }) => {
      const res = await fetch(urlDownload);
      const blob = await res.blob();
      return { blob, nameDocument };
    },
    onSuccess: ({ blob, nameDocument }) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = nameDocument;
      link.click();
      toastSuccess("Tải xuống thành công");
    },
    onError: toastError,
  });

  /* ================= UPLOAD ================= */

  const handleOpenFileInput = () => {
    inputRef.current?.click();
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setLoading(true);
    try {
      const file = selectedFiles[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fileUpload(formData, {
        featureAlias: "resources_feature1",
      });

      append({
        name: file.name,
        url: String(res?.data?.data?.url ?? ""),
        type: String(res?.data?.data?.type ?? ""),
      });
    } catch (e) {
      toastError(e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DATA PROCESS ================= */

  const fileList = fields
    .map((f, index) => ({ ...f, index }))
    .filter((f) =>
      ["pdf", "docx"].includes(f.name?.split(".").pop()?.toLowerCase() ?? "")
    );

  const imageList = fields
    .map((f, index) => ({ ...f, index }))
    .filter((f) =>
      ["jpg", "jpeg", "png"].includes(
        f.name?.split(".").pop()?.toLowerCase() ?? ""
      )
    );

  const isHasFile = fileList.length > 0 || imageList.length > 0;

  /* ================= RENDER ================= */

  return (
    <Box className="flex items-start">
      <Box>
        {!isView && (
          <>
            <Box
              onClick={handleOpenFileInput}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 350,
                height: 78,
                bgcolor: "#E8F0FF",
                border: "1px dashed #3E74D0",
                borderRadius: 2,
                mb: 1,
                cursor: "pointer",
                color: "#1D4FA3",
                fontWeight: 500,
              }}
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
                    hidden
                    type="file"
                    accept="image/png,image/jpeg,application/pdf"
                    onChange={handleFileUpload}
                  />
                </>
              )}
            </Box>

            <Typography variant="caption" color={GREY} fontSize={13}>
              Ghi chú: jpg, jpeg, png, pdf
            </Typography>
          </>
        )}

        {/* FILE LIST */}
        {fileList.length > 0 ? (
          <Box mt={2}>
            {fileList.map((item) => (
              <Box
                key={item.key}
                className="flex justify-between items-center w-[350px] mb-3 cursor-pointer"
                onClick={() =>
                  mutate({
                    urlDownload: item.url,
                    nameDocument: item.name,
                  })
                }
              >
                <Box className="flex items-center gap-3">
                  <Image src={require("@/assets/svg/pdf.svg")} alt="pdf" />
                  <Typography color={PRIMARY}>{safeText(item.name)}</Typography>
                </Box>

                {!isView && (
                  <Image
                    src={require("@/assets/svg/icon_delete_image.svg")}
                    alt="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(item.index);
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        ) : !isHasFile ? (
          <Typography mt={2} variant="caption" color={GREY}>
            Không có file hoặc ảnh
          </Typography>
        ) : null}
      </Box>

      {/* IMAGE LIST */}
      {imageList.length > 0 && (
        <Box className="flex ml-10 gap-4">
          {imageList.map((img) => (
            <Box
              key={img.key}
              className="relative w-[100px] h-[100px] cursor-pointer"
              onClick={() =>
                showDialog(
                  <DialogSwiper
                    hideDialog={hideDialog}
                    mainIndex={img.index}
                    contents={imageList.map((i) => ({
                      name: safeText(i.name),
                      src: safeText(i.url),
                    }))}
                  />
                )
              }
            >
              <CoreImage
                src={safeText(img.url)}
                alt={safeText(img.name)}
                width={100}
                height={100}
              />

              {!isView && (
                <Image
                  src={require("@/assets/svg/icon_delete_image.svg")}
                  alt="delete"
                  className="absolute -top-2 -right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(img.index);
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

export default UploadFilesAndImagesCustom;
