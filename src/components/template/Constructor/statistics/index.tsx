import { Grid } from "@mui/material";
import Image from "next/image";
import statistics from "@/assets/svg/statistics.svg";

export default function StatisticsPage() {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "100vh",
        overflowY: "hidden",
        overflowX: "hidden",
        p: 2,
      }}
    >
      <Image src={statistics} alt="Statistics" className="h-100vh" />
    </Grid>
  );
}
