import { Box, SxProps, Theme, Typography } from "@mui/material";
import { ReactNode } from "react";
type Props = {
  title: string;
  data: ReactNode;
  uom?: ReactNode;
  className?: string;
  dataStyle?: SxProps<Theme>;
  titleStyle?: SxProps<Theme>;
};
export const RowBoxCommon = ({
  title,
  data,
  uom,
  className,
  dataStyle,
  titleStyle,
}: Props) => {
  return (
    <Box
      sx={{
        marginBottom: "5px",
      }}
    >
      <div className={className}>
        <Typography
          sx={{
            fontSize: "10px",
            fontFamily: "Open Sans",
            color: "rgba(0, 0, 0, 0.6)",
            // marginBottom: "5px",
            ...titleStyle,
          }}
        >
          {title}
        </Typography>
        <Typography sx={dataStyle}>
          {data}&nbsp;{uom}
        </Typography>
      </div>
    </Box>
  );
};
