import { useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import { ProgressTimelineItem } from "./ProgressTimelineItem";
import ProgressHeader from "./ProgressHeader";
import MainTaskSection from "./MainTaskSection";
import { CoreButton } from "@/components/atoms/CoreButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type TimelineItemType = {
  id: number;
};

export default function ProgressTimeline() {
  const [items, setItems] = useState<TimelineItemType[]>([{ id: 1 }]);

  const handleAddTimeline = () => {
    setItems((prev) => [...prev, { id: Date.now() }]);
  };

  const handleRemoveTimeline = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Box>
      <Timeline
        sx={{
          p: 0,
          [`& .MuiTimelineItem-root:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {items.map((item, index) => (
          <ProgressTimelineItem key={item.id} index={index + 1}>
            {/* HEADER */}
            <Box display="flex" alignItems="center">
              <Box flex={1}>
                <ProgressHeader status="DONE" />
              </Box>

              {/* DELETE BUTTON */}
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveTimeline(item.id)}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>

            <MainTaskSection />
          </ProgressTimelineItem>
        ))}
      </Timeline>

      {/* ADD BUTTON */}
      <Box display="flex" justifyContent="start" mt={2}>
        <CoreButton variant="outlined" onClick={handleAddTimeline}>
          Thêm tiến trình
        </CoreButton>
      </Box>
    </Box>
  );
}
