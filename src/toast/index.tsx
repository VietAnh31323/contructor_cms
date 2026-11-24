import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { CloseButtonProps, toast } from "react-toastify";
import { ErrorMessage } from "@/toast/componets/error";
import { SuccessMessage } from "@/toast/componets/success";

const ToastCloseButton = ({ closeToast }: CloseButtonProps) => (
  <button
    type="button"
    onClick={closeToast}
    aria-label="Đóng thông báo"
    className="ml-1 flex h-6 w-6 flex-shrink-0 items-center justify-center self-start rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
  >
    <CloseRoundedIcon sx={{ fontSize: 16 }} />
  </button>
);

export const toastSuccess = (
  msg: string,
  title?: string,
  onClick?: () => void
) => {
  if (msg)
    toast(<SuccessMessage message={msg} title={title} />, {
      closeButton: ToastCloseButton,
      className: "vds-toast vds-toast__success",
      progressClassName: "vds-toast__progress--success",
      autoClose: onClick ? 99999 : 3500,
    });
};

export const toastError = (error: any, setError?: any) => {
  if (Array.isArray(error) && error.length > 0) {
    error.forEach((item) => {
      if (item && Array.isArray(item.fields) && setError) {
        item.fields.forEach((ele: any) => {
          if (ele !== "orgId")
            setError(ele, {
              type: "be",
              message: "Thất bại",
            });
        });
      } else toastError("Không thành công");
    });
  } else if (typeof error === "string") {
    toast(<ErrorMessage message={error} />, {
      closeButton: ToastCloseButton,
      className: "vds-toast vds-toast__error",
      progressClassName: "vds-toast__progress--error",
    });
  } else {
    const resolvedMsg =
      typeof error?.message === "string" && error.message.trim()
        ? error.message
        : "Có lỗi xảy ra";
    toast(<ErrorMessage message={resolvedMsg} />, {
      closeButton: ToastCloseButton,
      className: "vds-toast vds-toast__error",
      progressClassName: "vds-toast__progress--error",
    });
  }
};
