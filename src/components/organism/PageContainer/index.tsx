import { Box } from "@mui/material";
import { ReactNode } from "react";

const PageContainer = ({
  title,
  children,
}: {
  title?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <Box className="w-full h-full">
      {title && <Box className="mb-3">{title}</Box>}

      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
          p: { xs: 2, md: 3 },
          minHeight: title ? "calc(100vh - 140px)" : "calc(100vh - 110px)",
        }}
      >
        <Box>{children}</Box>
      </Box>
    </Box>
  );
};

export default PageContainer;
