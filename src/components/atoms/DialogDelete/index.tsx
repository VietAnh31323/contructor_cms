import { useState, useEffect } from "react";
import { CoreButton } from "@/components/atoms/CoreButton";
import { CoreDialog } from "@/components/organism/CoreDialog";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { useDeleteDialog } from "./useDialogDelete";

export const DialogDelete = ({
  id,
  name,
  fetchDataFn,
  URL,
  params,
}: {
  id: number;
  name: string;
  fetchDataFn: any;
  URL: string;
  params?: any;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // chỉ mount hook sau khi component đã render
  }, []);

  if (!mounted) return null; // tránh hook chạy quá sớm

  return (
    <ActualDialogDelete
      id={id}
      name={name}
      fetchDataFn={fetchDataFn}
      URL={URL}
      params={params}
    />
  );
};

const ActualDialogDelete = ({ id, name, fetchDataFn, URL, params }: any) => {
  const { t } = useTranslation();
  const { hideDialog } = useDialog();
  const [{}, { onSubmit }] = useDeleteDialog(id, fetchDataFn, URL, params);

  return (
    <CoreDialog
      title={t("common:btn.confirm")}
      onClose={hideDialog}
      width={500}
    >
      <Box className="flex justify-center max-w-[350px] m-auto align-middle text-center">
        <Typography
          variant="subtitle1"
          style={{ lineHeight: 1.5, marginTop: 12 }}
        >
          {t("common:dialog.deleteMessage", { name })}
        </Typography>
      </Box>
      <div className="flex justify-center gap-8 py-10">
        <CoreButton theme="cancel" onClick={hideDialog}>
          {t("common:btn.cancel")}
        </CoreButton>
        <CoreButton theme="submit" onClick={onSubmit}>
          {t("common:btn.agree")}
        </CoreButton>
      </div>
    </CoreDialog>
  );
};
