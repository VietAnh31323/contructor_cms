import { Box, Chip, Grid, Typography } from "@mui/material";
import { useState } from "react";
import CoreAutoCompleteAPI from "@/components/atoms/CoreAutoCompleteAPI";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { useForm } from "react-hook-form";
import { getProgressProjectList } from "@/service/constructor/ProgressProject/getList";

export default function ProgressHeader({
  status,
}: {
  status: "DONE" | "PROCESSING";
}) {
  const [progress, setProgress] = useState<any>(null);
  const { control } = useForm();
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
    >
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <CoreAutoCompleteAPI
            variant="standard"
            fetchDataFn={getProgressProjectList}
            control={control}
            name="progress"
            label=""
            placeholder="Chọn tiến trình"
            valuePath="value"
            params={{
              isActive: true,
            }}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={2} lg={2}>
        <Typography
          fontWeight={200}
          color={status === "DONE" ? "success.main" : "info.main"}
        >
          {status === "DONE" ? "Hoàn thành" : "Đang thực hiện"}
        </Typography>
      </Grid>
    </Box>
  );
}
