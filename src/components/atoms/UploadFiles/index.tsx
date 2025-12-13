// import { authHrmApi, authTaskApi, authWarehouseApi } from '@/config/auth'
import { GREY, PRIMARY } from "@/helper/colors";
import { toastError } from "@/toast";
import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { CoreImage } from "@/components/atoms/CoreImage";

export const fileUploadTask = (data: any) => {
  // return authTaskApi({
  // // return authHrmApi({
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  //   url: '/api/v1/upload-file',
  //   data,
  // })
};

type Props = {
  nameDynamic: string;
  isView?: boolean;
  control: any;
  styles?: any;
};

const UploadFiles = (props: Props) => {
  const { nameDynamic, isView, control, styles } = props;
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
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target?.files;
    console.log(selectedFiles, "selectedFiles");
    setLoading(true);

    if (selectedFiles?.length && selectedFiles?.length > 0) {
      try {
        // Convert FileList to array and process each file
        const filesArray = Array.from(selectedFiles);

        // Process each file sequentially or in parallel
        for (const file of filesArray) {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fileUploadTask(formData);
          console.log("Upload response:", res);
          // if (res?.data) {
          //   append({
          //     name: file.name,
          //     url: res?.data?.data?.url,
          //   });
          // } else {
          //   toastError(`Upload thất bại cho file: ${file.name}`);
          // }
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        toastError(e);
      }
    }
  };

  const fileList = fields
    ?.map((i, index) => ({ ...i, index }))
    ?.filter((x: any) => {
      return ["pdf"].includes(
        x?.name?.split(".").pop()?.toLowerCase() as string
      );
    });
  const imageList = fields
    ?.map((i, index) => ({ ...i, index }))
    ?.filter((x: any) =>
      ["jpeg", "jpg", "png"].includes(
        x?.name?.split(".").pop()?.toLowerCase() as string
      )
    );

  return (
    <Box className="flex items-center">
      <Box>
        {!isView && (
          <Box sx={{ ...styles }}>
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
              Ghi chú: Upload file định dạng với các định dạng [jpg, jpeg, png,
              pdf]
            </Typography>
          </Box>
        )}

        <Box className="my-5">
          {fileList.length > 0 ? (
            <Box>
              {fileList?.map((item: any, index) => {
                return (
                  <Box
                    key={item?.key}
                    className="flex items-center justify-between w-[350px] mb-5 cursor-pointer"
                    onClick={() => window.open(item?.url)}
                  >
                    <Box className="flex items-center space-x-4">
                      <Image src={require("@/assets/svg/pdf.svg")} alt="pdf" />
                      <Typography color={PRIMARY}>{item?.name}</Typography>
                    </Box>
                    {!isView && (
                      <Image
                        src={require("@/assets/svg/icon_delete_image.svg")}
                        alt="attach"
                        className="cursor-pointer"
                        onClick={() => remove(item?.index)}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          ) : // <Typography variant="caption" color={GREY} fontSize={13}>
          //   No file chosen
          // </Typography>
          null}
        </Box>
      </Box>
      {imageList?.length > 0 && (
        <Box className="flex my-10 ml-20">
          {imageList?.map((i: any) => (
            <Box key={i?.key} className="mr-15 w-[100px] h-[100px] relative">
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
                  alt="attach"
                  className="absolute top-[-10px] right-[-10px] cursor-pointer"
                  onClick={() => remove(i?.index)}
                />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UploadFiles;
