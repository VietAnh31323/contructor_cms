import React from "react";
import { Box, Paper, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { ProjectState } from "@/service/constructor/Project/getList/type";
import { formatVnd } from "../../customer/constants";
import { PROJECT_KANBAN_STATES, PROJECT_STATE_META } from "../constants";

interface StageSummaryItem {
  state: string;
  projectCount: number;
  totalContractValue: number;
}

interface LifecycleSummary {
  totalProjects: number;
  activeProjects: number;
  totalContractValue: number;
  stages?: StageSummaryItem[];
}

interface ProjectLifecycleSummaryProps {
  lifecycleSummary: LifecycleSummary;
  activeStateFilter: ProjectState | "";
  onSelectStage: (state: ProjectState | "") => void;
}

export const ProjectLifecycleSummary: React.FC<
  ProjectLifecycleSummaryProps
> = ({ lifecycleSummary, activeStateFilter, onSelectStage }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const totalCount = Math.max(1, Number(lifecycleSummary.totalProjects || 0));

  const borderBase = isDark ? "#1e293b" : "#e2e8f0";
  const borderSubtle = isDark ? "#1e293b" : "#f1f5f9";
  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const mutedBg = isDark ? "#0b1120" : "#f8fafc";
  const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
  const textSecondary = isDark ? "#94a3b8" : "#64748b";
  const textMuted = isDark ? "#64748b" : "#94a3b8";

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 3,
        borderColor: borderBase,
        bgcolor: cardBg,
      }}
    >
      {/* Header row: Total anchor + segmented pipeline bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          pb: 1.75,
          mb: 1.75,
          borderBottom: `1px solid ${borderSubtle}`,
        }}
      >
        {/* All projects clickable summary */}
        <Box
          onClick={() => onSelectStage("")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 1.75,
            py: 1,
            borderRadius: 2.5,
            cursor: "pointer",
            border: "1px solid",
            borderColor:
              activeStateFilter === ""
                ? isDark
                  ? "#38bdf8"
                  : "#1e293b"
                : borderBase,
            bgcolor: activeStateFilter === "" ? mutedBg : cardBg,
            transition: "all 160ms ease",
            "&:hover": {
              borderColor: isDark ? "#475569" : "#94a3b8",
              bgcolor: mutedBg,
            },
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: textSecondary,
                fontWeight: 700,
                letterSpacing: "0.04em",
                fontSize: "11px",
              }}
            >
              TẤT CẢ DỰ ÁN
            </Typography>
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, color: textPrimary, lineHeight: 1.2 }}
              >
                {lifecycleSummary.totalProjects}
              </Typography>
              <Typography variant="caption" sx={{ color: textSecondary }}>
                dự án
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              height: 32,
              width: "1px",
              bgcolor: borderBase,
            }}
          />

          <Box>
            <Typography
              variant="caption"
              sx={{ color: textSecondary, display: "block", fontSize: "11px" }}
            >
              Đang chạy:{" "}
              <b style={{ color: textPrimary }}>
                {lifecycleSummary.activeProjects}
              </b>
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: textPrimary, fontSize: "13px" }}
            >
              {formatVnd(lifecycleSummary.totalContractValue)}
            </Typography>
          </Box>
        </Box>

        {/* Segmented distribution bar */}
        <Box sx={{ flex: 1, maxWidth: { md: 540 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.75 }}
          >
            <Typography
              variant="caption"
              sx={{ color: textSecondary, fontWeight: 600, fontSize: "11px" }}
            >
              Phân bổ theo giai đoạn vòng đời
            </Typography>
            {activeStateFilter && (
              <Typography
                variant="caption"
                onClick={() => onSelectStage("")}
                sx={{
                  color: isDark ? "#38bdf8" : "#2563eb",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "11px",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Xem tất cả
              </Typography>
            )}
          </Stack>

          <Box
            sx={{
              display: "flex",
              height: 8,
              borderRadius: 999,
              overflow: "hidden",
              bgcolor: isDark ? "#1e293b" : "#f1f5f9",
              gap: "2px",
            }}
          >
            {PROJECT_KANBAN_STATES.map((st) => {
              const meta = PROJECT_STATE_META[st];
              const stageSummary = lifecycleSummary.stages?.find(
                (s) => s.state === st
              );
              const count = stageSummary?.projectCount ?? 0;
              if (count <= 0) return null;
              const pct = (count / totalCount) * 100;
              const isSelected = activeStateFilter === st;

              return (
                <Tooltip
                  key={st}
                  title={`${meta.shortLabel}: ${count} dự án (${Math.round(
                    pct
                  )}%)`}
                  arrow
                >
                  <Box
                    onClick={() => onSelectStage(isSelected ? "" : st)}
                    sx={{
                      width: `${pct}%`,
                      minWidth: 8,
                      bgcolor: meta.accent,
                      cursor: "pointer",
                      opacity: !activeStateFilter || isSelected ? 1 : 0.35,
                      transition: "opacity 160ms ease, filter 160ms ease",
                      "&:hover": { filter: "brightness(1.08)" },
                    }}
                  />
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Responsive wrapping stage pills — zero horizontal scrollbar */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            md: "repeat(5, minmax(0, 1fr))",
            lg: "repeat(5, minmax(0, 1fr))",
          },
          gap: 1,
        }}
      >
        {PROJECT_KANBAN_STATES.map((st) => {
          const meta = PROJECT_STATE_META[st];
          const stageSummary = lifecycleSummary.stages?.find(
            (s) => s.state === st
          );
          const count = stageSummary?.projectCount ?? 0;
          const totalVal = stageSummary?.totalContractValue ?? 0;
          const isSelected = activeStateFilter === st;
          const hasData = count > 0;
          const selectedBg = isDark ? `${meta.accent}22` : meta.bg;

          return (
            <Box
              key={st}
              onClick={() => onSelectStage(isSelected ? "" : st)}
              sx={{
                px: 1.4,
                py: 1,
                borderRadius: 2,
                cursor: "pointer",
                border: "1px solid",
                borderColor: isSelected
                  ? meta.accent
                  : hasData
                  ? borderBase
                  : borderSubtle,
                bgcolor: isSelected
                  ? selectedBg
                  : hasData
                  ? cardBg
                  : mutedBg,
                opacity: isSelected || hasData ? 1 : isDark ? 0.55 : 0.68,
                transition: "all 150ms ease",
                "&:hover": {
                  opacity: 1,
                  borderColor: meta.accent,
                  bgcolor: selectedBg,
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={0.5}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.75}
                  sx={{ minWidth: 0 }}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: meta.accent,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      fontWeight: 600,
                      color: isSelected
                        ? meta.accent
                        : isDark
                        ? "#cbd5e1"
                        : "#334155",
                      fontSize: "11.5px",
                    }}
                  >
                    {meta.shortLabel}
                  </Typography>
                </Stack>

                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color: hasData ? textPrimary : textMuted,
                    fontSize: "12px",
                    flexShrink: 0,
                  }}
                >
                  {count}
                </Typography>
              </Stack>

              <Typography
                variant="caption"
                noWrap
                sx={{
                  display: "block",
                  mt: 0.35,
                  color: hasData
                    ? isDark
                      ? "#cbd5e1"
                      : "#475569"
                    : textMuted,
                  fontWeight: hasData ? 600 : 400,
                  fontSize: "11px",
                }}
              >
                {formatVnd(totalVal)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};
