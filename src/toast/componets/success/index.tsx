import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

interface MessageProps {
  title?: string;
  message: string;
}

export const SuccessMessage = ({ message, title }: MessageProps) => {
  return (
    <div className="flex items-start gap-3 pr-2">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
        <CheckCircleRoundedIcon sx={{ fontSize: 20 }} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="text-[13.5px] font-semibold leading-snug text-slate-900 dark:text-slate-100">
          {title ?? "Thành công"}
        </div>
        <div className="mt-0.5 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-400 break-words">
          {message}
        </div>
      </div>
    </div>
  );
};
