import { Box, IconButton } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CoreButton } from "@/components/atoms/CoreButton";
import { ProgressTimelineItem } from "./ProgressTimelineItem";
import ProgressHeader from "./ProgressHeader";
import MainTaskSection from "./MainTaskSection";
import { ProjectProgress } from "@/service/constructor/Progress/getDetail/type";

type Props = {
  value: ProjectProgress[];
  onChange: (data: ProjectProgress[]) => void;
  isView?: boolean;
};

export default function ProgressTimeline({
  value = [],
  onChange,
  isView,
}: Props) {
  const handleAddProgress = () => {
    onChange([
      ...value,
      {
        id: 0,
        progress: { id: Date.now(), code: "", name: "" },
        tasks: [],
      },
    ]);
  };

  const updateProgress = (index: number, data: ProjectProgress) => {
    onChange(value.map((p, i) => (i === index ? data : p)));
  };

  return (
    <>
      {value.map((item, index) => (
        <ProgressTimelineItem key={index} index={index + 1}>
          <ProgressHeader
            value={item.progress}
            onChange={(progress) =>
              updateProgress(index, { ...item, progress })
            }
            isView={isView}
          />

          <MainTaskSection
            value={item.tasks ?? []}
            onChange={(tasks) => updateProgress(index, { ...item, tasks })}
            isView={isView}
          />
        </ProgressTimelineItem>
      ))}

      {!isView && (
        <CoreButton onClick={handleAddProgress}>Thêm tiến trình</CoreButton>
      )}
    </>
  );
}
