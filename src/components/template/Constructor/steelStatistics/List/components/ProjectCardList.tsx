import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import steel from "@/assets/png/steel.png";

export default function ProjectCardList() {
  const items = [
    "Anh Thành - Tuyên Quang",
    "Anh Huy - Nam Định",
    "Chị Hoa - Hải Dương",
    "Cô Tâm - Nam Định",
    "Chú Tuấn - Biệt thự sân vườn",
    "Nhà phố Nam Định",
  ];

  return (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid item xs={6} sm={4} md={3} lg={3} key={index}>
          <div className="flex flex-col items-center p-4  transition cursor-pointer">
            <Image src={steel} alt="steel" width={200} height={200} />
            <Typography className="text-center mt-2 text-sm font-medium font-bold">
              {item}
            </Typography>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
