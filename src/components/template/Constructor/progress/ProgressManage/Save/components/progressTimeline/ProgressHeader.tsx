import { Box, Chip, Grid, Typography } from "@mui/material";
import { useState } from "react";
import CoreAutoCompleteAPI from "@/components/atoms/CoreAutoCompleteAPI";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { useForm } from "react-hook-form";
import { getProgressProjectList } from "@/service/constructor/ProgressProject/getList";

type Props = {
  value: any;
  onChange: (value: any) => void;
  isView?: boolean;
};

export default function ProgressHeader({ value, onChange, isView }: Props) {
  const { control } = useForm({
    defaultValues: {
      progress: value,
    },
  });

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CoreAutoCompleteAPI
            variant="standard"
            fetchDataFn={getProgressProjectList}
            control={control}
            name="progress"
            placeholder="Chọn tiến trình"
            valuePath="value"
            params={{ isActive: true }}
            disabled={isView}
            onChangeValue={(option) => {
              onChange(option);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
