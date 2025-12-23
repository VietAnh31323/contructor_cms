import { Box, Paper } from "@mui/material";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineConnector from "@mui/lab/TimelineConnector";

export function ProgressTimelineItem({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <Box
          sx={{
            width: 40,
            height: 40,
            border: "1px solid #d0d5dd",
            borderRadius: 1,
            fontWeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fff",
          }}
        >
          {index}
        </Box>
        <TimelineConnector />
      </TimelineSeparator>

      <TimelineContent sx={{ pt: 0, pb: 3, width: "95%" }}>
        <Paper variant="outlined" sx={{ border: "none" }}>
          {children}
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );
}
