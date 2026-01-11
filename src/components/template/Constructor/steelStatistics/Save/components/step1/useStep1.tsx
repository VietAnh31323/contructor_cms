import { useRouter } from "next/router";
import { useFormContext } from "react-hook-form";

export default function useStep1() {
  const methods = useFormContext<any>();
  const router = useRouter();
  const { actionType } = router.query;
  const isView = actionType === "VIEW";
  const { control, watch, setValue } = methods;
  return [
    {
      methods,
      isView,
      control,
      watch,
      setValue,
    },
    {},
  ] as const;
}
