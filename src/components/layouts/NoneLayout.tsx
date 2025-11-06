import { Box } from "@mui/material";
import login from "@/assets/svg/Login.svg";

export function NoneLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        // height: "400px",
        backgroundImage: `url(${login.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="flex items-center justify-center min-h-screen ">
        {children}
      </div>
    </Box>
  );
}
