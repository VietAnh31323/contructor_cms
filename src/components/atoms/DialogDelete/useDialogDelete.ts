import { useDialog } from "@/components/hooks/dialog/useDialog";
import { toastError, toastSuccess } from "@/toast";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

export const useDeleteDialog = (
  id: number,
  fetchDataFn: any,
  URL: string,
  params?: any
) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { hideDialog } = useDialog();
  const { handleSubmit } = useForm({
    defaultValues: { id, ...params },
  });

  const deleteBrandApi = useMutation(fetchDataFn, {
    onSuccess: () => {
      toastSuccess(t("message.success"));
      hideDialog();
      router.push(URL);
    },
    onError: (error: any) => {
      toastError(error);
    },
  });

  const onSubmit = handleSubmit((input?: any) => {
    deleteBrandApi.mutate(input);
  });

  return [{}, { onSubmit }] as const;
};
