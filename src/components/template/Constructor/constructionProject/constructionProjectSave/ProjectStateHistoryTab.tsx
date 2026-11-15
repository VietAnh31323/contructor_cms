import CoreLoading from "@/components/molecules/CoreLoading";
import { ProjectDetail } from "@/service/constructor/Project/getDetail/type";
import { useProjectStateLogsQuery } from "@/service/constructor/Project/lifecycle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HistoryIcon from "@mui/icons-material/History";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import moment from "moment";
import { normalizeProjectState, PROJECT_STATE_META } from "../constants";

type Props = {
  projectId: number;
  projectDetail?: ProjectDetail | null;
};

export default function ProjectStateHistoryTab({
  projectId,
  projectDetail,
}: Props) {
  const { data, isLoading } = useProjectStateLogsQuery(projectId, {
    enabled: Boolean(projectId),
  });

  if (isLoading) {
    return <CoreLoading />;
  }

  const logs = data?.data ?? [];
  const currentState = normalizeProjectState(projectDetail?.state);
  const currentMeta =
    PROJECT_STATE_META[currentState] || PROJECT_STATE_META.RECEIVED;

  return (
    <Box className="py-4">
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          bgcolor: currentMeta.bg,
          borderColor: `${currentMeta.accent}45`,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="caption" color="text.secondary">
              Giai đoạn hiện tại
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <Chip
                color={currentMeta.color}
                label={currentMeta.shortLabel}
                sx={{ fontWeight: 700 }}
              />
              {projectDetail?.previousState && currentState === "PAUSED" && (
                <Typography variant="caption" color="text.secondary">
                  (Trước tạm dừng:{" "}
                  {PROJECT_STATE_META[projectDetail.previousState]?.label ||
                    projectDetail.previousState}
                  )
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Cập nhật trạng thái gần nhất
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
              {projectDetail?.stateChangedAt
                ? moment(projectDetail.stateChangedAt).format("DD/MM/YYYY HH:mm")
                : "—"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Mốc bàn giao / Bảo hành
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
              {projectDetail?.actualHandoverDate
                ? `BG: ${moment(projectDetail.actualHandoverDate).format(
                    "DD/MM/YYYY"
                  )}`
                : "Chưa bàn giao"}
              {projectDetail?.warrantyEndDate
                ? ` • BH đến: ${moment(projectDetail.warrantyEndDate).format(
                    "DD/MM/YYYY"
                  )}`
                : ""}
            </Typography>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="caption" color="text.secondary">
              Tổng số lần chuyển bước
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {logs.length} lần
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <HistoryIcon color="primary" fontSize="small" />
        <Typography variant="subtitle1" fontWeight={700}>
          Nhật ký chuyển trạng thái vòng đời ({logs.length})
        </Typography>
      </Stack>

      {logs.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{ p: 4, textAlign: "center", borderRadius: 2, bgcolor: "#f8fafc" }}
        >
          <Typography variant="body2" color="text.secondary">
            Chưa có bản ghi lịch sử chuyển trạng thái nào cho dự án này.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {logs.map((log, index) => {
            const fromMeta = log.fromState
              ? PROJECT_STATE_META[normalizeProjectState(log.fromState)]
              : null;
            const toMeta =
              PROJECT_STATE_META[normalizeProjectState(log.toState)] ||
              PROJECT_STATE_META.RECEIVED;
            const actorLabel = log.changedByStaff
              ? `${log.changedByStaff.code ? `${log.changedByStaff.code} - ` : ""}${
                  log.changedByStaff.name
                }`
              : log.changedByUsername || "Hệ thống";

            return (
              <Paper
                key={log.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderLeft: `4px solid ${toMeta.accent}`,
                  bgcolor: index === 0 ? "#ffffff" : "#fcfcfd",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    {fromMeta ? (
                      <>
                        <Chip
                          size="small"
                          variant="outlined"
                          color={fromMeta.color}
                          label={log.fromStateLabel || fromMeta.label}
                        />
                        <ArrowForwardIcon fontSize="small" color="action" />
                      </>
                    ) : (
                      <Chip
                        size="small"
                        variant="outlined"
                        label="Khởi tạo dự án"
                      />
                    )}
                    <Chip
                      size="small"
                      color={toMeta.color}
                      label={log.toStateLabel || toMeta.label}
                      sx={{ fontWeight: 700 }}
                    />
                    {index === 0 && (
                      <Chip
                        size="small"
                        color="info"
                        variant="outlined"
                        label="Mới nhất"
                        sx={{ height: 22, fontSize: "0.7rem" }}
                      />
                    )}
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <PersonOutlineIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="caption" fontWeight={600}>
                        {actorLabel}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <ScheduleIcon
                        sx={{ fontSize: 15, color: "text.secondary" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {log.createdAt
                          ? moment(log.createdAt).format("DD/MM/YYYY HH:mm:ss")
                          : "—"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                {log.reason && (
                  <>
                    <Divider sx={{ my: 1.25 }} />
                    <Typography variant="body2" color="text.primary">
                      <strong>Nội dung / Lý do:</strong> {log.reason}
                    </Typography>
                  </>
                )}
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
