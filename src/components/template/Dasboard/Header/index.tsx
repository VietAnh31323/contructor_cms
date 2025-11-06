import { ROUTES } from "@/routes";
import { Avatar, Typography } from "@mui/material";
import Link from "next/link";

export default function Header() {
  return (
    <div>
      <div className="bg-[#002C66] h-16 p-3 text-white flex justify-between">
        <Typography sx={{ textAlign: "center", margin: "auto 0" }}>
          Công ty cổ phần kiến trúc, xây dựng ABC
        </Typography>

        <Avatar className="w-full h-full">H</Avatar>
      </div>
    </div>
  );
}
