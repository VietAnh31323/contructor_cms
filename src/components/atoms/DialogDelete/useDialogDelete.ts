import { useDialog } from "@/components/hooks/dialog/useDialog";
import { TRANSLATE } from "@/routes";
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
  const { t } = useTranslation(TRANSLATE.COMMON);

  const router = useRouter();
  const { hideDialog } = useDialog();
  const { handleSubmit } = useForm({
    defaultValues: {
      id,
      ...params,
    },
  });

  const deleteBrandApi = useMutation(fetchDataFn, {
    onSuccess: () => {
      toastSuccess(t("message.success"));
      router.push({
        pathname: `${URL}`,
      });
    },
    onError: (error: any) => {
      toastError(error);
    },
  });

  const onSubmit = handleSubmit(async (input?: any) => {
    deleteBrandApi.mutate(input);
    hideDialog();
  });

  return [{}, { onSubmit }] as const;
};
