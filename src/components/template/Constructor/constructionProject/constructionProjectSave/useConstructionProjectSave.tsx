import { useFormCustom } from "@/lib/form";

import { useTranslation } from "next-i18next";
import { useParams, useSearchParams } from "next/navigation";
import router from "next/router";
import { useMemo, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { DropResult } from "react-beautiful-dnd";

const useConstructionProjectSave = () => {
  const [page, setPage] = useState(0);
  const searchParams = useSearchParams();
  const params = useParams();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";
  const methodForm = useFormCustom<any>({
    defaultValues: {
      valueFormalTypes: [
        {
          id: Date.now(),
          value: "",
        },
      ],
    },
  });

  const { handleSubmit, reset, setError, control, watch, setValue } =
    methodForm;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "valueFormalTypes",
  });
  const { t } = useTranslation();

  const handleDragEnd = (result: DropResult) => {
    if (isView) return;

    const { source, destination } = result;
    if (!destination) return;

    move(source.index, destination.index);
  };

  return {
    page,
    t,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    fields,
    append,
    remove,
    handleDragEnd,
    isView,
    control,
    methodForm,
  };
};

export default useConstructionProjectSave;
