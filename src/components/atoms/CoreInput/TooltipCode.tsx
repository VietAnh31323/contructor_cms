import TurnedInIcon from "@mui/icons-material/TurnedIn";
import { IconButton, Tooltip } from "@mui/material";
import { ReactNode } from "react";

export const TooltipCode = ({ label }: { label: ReactNode }) => {
  return (
    <Tooltip
      title="Mã không nhập sẽ được sinh tự động bởi hệ thống"
      placement="top"
      componentsProps={{
        tooltip: {
          style: {
            color: "#000",
          },
        },
      }}
    >
      <div className="flex justify-center items-center gap-1">
        <span>{label}</span>
        <IconButton>
          <TurnedInIcon sx={{ width: 13 }} />
        </IconButton>
      </div>
    </Tooltip>
  );
};
