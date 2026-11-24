import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

interface MessageProps {
  title?: string;
  message: string;
}

export const ErrorMessage = ({ message, title }: MessageProps) => {
  return (
    <div className="flex items-start gap-3 pr-2">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
        <ErrorRoundedIcon sx={{ fontSize: 20 }} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="text-[13.5px] font-semibold leading-snug text-slate-900 dark:text-slate-100">
          {title ?? "Thất bại"}
        </div>
        <div className="mt-0.5 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-400 break-words">
          {message}
        </div>
      </div>
    </div>
  );
};
