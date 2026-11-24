import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { StateCountDto } from "@/service/constructor/Dashboard/type";

const STATE_COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#14b8a6",
  "#6366f1",
  "#64748b",
  "#f97316",
  "#ef4444",
];

function darkenHex(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = Math.max(0, Math.round(((num >> 16) & 0xff) * (1 - amount)));
  const g = Math.max(0, Math.round(((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.round((num & 0xff) * (1 - amount)));
  return `rgb(${r}, ${g}, ${b})`;
}

interface ProjectStatus3DDonutProps {
  states: StateCountDto[];
  totalProjects: number;
}

export const ProjectStatus3DDonut: React.FC<ProjectStatus3DDonutProps> = ({
  states,
  totalProjects,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ skewX: 0, scaleY: 0.72, shiftX: 0 });

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const totalStateCount = Math.max(
    1,
    states.reduce((s, item) => s + Number(item.count || 0), 0)
  );

  const donutSegments = useMemo(() => {
    const r = 64;
    const circumference = 2 * Math.PI * r;
    let offset = 0;
    return states.map((st, idx) => {
      const count = Number(st.count || 0);
      const len = (count / totalStateCount) * circumference;
      const color = STATE_COLORS[idx % STATE_COLORS.length];
      const seg = {
        ...st,
        color,
        sideColor: darkenHex(color, 0.32),
        deepColor: darkenHex(color, 0.48),
        dashArray: `${Math.max(0, len - 2)} ${circumference}`,
        dashOffset: -offset,
        pct: Math.round((count / totalStateCount) * 100),
      };
      offset += len;
      return seg;
    });
  }, [states, totalStateCount]);

  const visibleSegments = donutSegments.filter((s) => Number(s.count || 0) > 0);
  const activeHoveredSegment = donutSegments.find(
    (s) => s.state === hoveredState
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      skewX: nx * 8,
      scaleY: Math.max(0.62, Math.min(0.84, 0.72 - ny * 0.14)),
      shiftX: nx * 5,
    });
  };

  const resetTilt = () => setTilt({ skewX: 0, scaleY: 0.72, shiftX: 0 });

  // Extrusion offsets from bottom to top (14px 3D thickness)
  const depthOffsets = [14, 12, 10, 8, 6, 4, 2];

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={5} className="flex justify-center">
        <Box
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            resetTilt();
            setHoveredState(null);
          }}
          sx={{
            width: 210,
            height: 195,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <svg
            width={210}
            height={195}
            viewBox="0 0 210 195"
            style={{ overflow: "visible" }}
          >
            <defs>
              <radialGradient id="donut3DShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(15, 23, 42, 0.22)" />
                <stop offset="70%" stopColor="rgba(15, 23, 42, 0.08)" />
                <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
              </radialGradient>
            </defs>

            {/* Soft 3D floor shadow */}
            <ellipse
              cx={105 + tilt.shiftX * 0.6}
              cy={124}
              rx={78}
              ry={46}
              fill="url(#donut3DShadow)"
              style={{ transition: "cx 220ms ease-out" }}
            />

            {/* 3D Extruded Side Layers */}
            {depthOffsets.map((dy, layerIdx) => (
              <g
                key={dy}
                transform={`translate(105, ${88 + dy}) skewX(${
                  tilt.skewX
                }) scale(1, ${tilt.scaleY})`}
                style={{
                  transition: "transform 220ms ease-out",
                  pointerEvents: "none",
                }}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={64}
                  fill="transparent"
                  stroke={isDark ? "#1e293b" : "#e2e8f0"}
                  strokeWidth={22}
                />
                {visibleSegments.map((seg) => {
                  const isHovered = hoveredState === seg.state;
                  return (
                    <circle
                      key={`${seg.state}-layer-${dy}`}
                      cx={0}
                      cy={0}
                      r={64}
                      fill="transparent"
                      stroke={layerIdx < 3 ? seg.deepColor : seg.sideColor}
                      strokeWidth={isHovered ? 25 : 22}
                      strokeDasharray={mounted ? seg.dashArray : "0 500"}
                      strokeDashoffset={seg.dashOffset}
                      transform="rotate(-90)"
                      style={{
                        transition:
                          "stroke-dasharray 760ms cubic-bezier(0.22, 1, 0.36, 1), stroke-width 180ms ease",
                      }}
                    />
                  );
                })}
              </g>
            ))}

            {/* Top Glossy 3D Face */}
            <g
              transform={`translate(105, 88) skewX(${tilt.skewX}) scale(1, ${
                tilt.scaleY
              })`}
              style={{ transition: "transform 220ms ease-out" }}
            >
              <circle
                cx={0}
                cy={0}
                r={64}
                fill="transparent"
                stroke={isDark ? "#1e293b" : "#f1f5f9"}
                strokeWidth={22}
              />
              {visibleSegments.map((seg, idx) => {
                const isHovered = hoveredState === seg.state;
                return (
                  <g
                    key={seg.state}
                    transform={isHovered ? "translate(0, -4)" : "translate(0, 0)"}
                    style={{ transition: "transform 180ms ease" }}
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={64}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={isHovered ? 26 : 22}
                      strokeDasharray={mounted ? seg.dashArray : "0 500"}
                      strokeDashoffset={seg.dashOffset}
                      transform="rotate(-90)"
                      style={{
                        cursor: "pointer",
                        transition: `stroke-dasharray 800ms cubic-bezier(0.22, 1, 0.36, 1) ${
                          idx * 45
                        }ms, stroke-width 180ms ease`,
                      }}
                      onMouseEnter={() => setHoveredState(seg.state)}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                  </g>
                );
              })}

              {/* Subtle top highlight rim */}
              <circle
                cx={0}
                cy={0}
                r={73}
                fill="transparent"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={1.2}
                pointerEvents="none"
              />
            </g>

            {/* Un-squashed Center Metric */}
            <g style={{ pointerEvents: "none" }}>
              <text
                x={105}
                y={86}
                textAnchor="middle"
                fontSize="24"
                fontWeight="800"
                fill={isDark ? "#f1f5f9" : "#0f172a"}
              >
                {activeHoveredSegment
                  ? activeHoveredSegment.count
                  : totalProjects ?? 0}
              </text>
              <text
                x={105}
                y={104}
                textAnchor="middle"
                fontSize="11"
                fill={isDark ? "#94a3b8" : "#64748b"}
              >
                {activeHoveredSegment
                  ? `${activeHoveredSegment.label} (${activeHoveredSegment.pct}%)`
                  : "Tổng dự án"}
              </text>
            </g>
          </svg>
        </Box>
      </Grid>

      <Grid item xs={12} sm={7}>
        <Stack spacing={0.8}>
          {donutSegments.map((seg) => {
            const isHovered = hoveredState === seg.state;
            return (
              <Stack
                key={seg.state}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                onMouseEnter={() => setHoveredState(seg.state)}
                onMouseLeave={() => setHoveredState(null)}
                sx={{
                  px: 1.2,
                  py: 0.55,
                  borderRadius: 1.5,
                  cursor: "pointer",
                  bgcolor: isHovered
                    ? isDark
                      ? "#1e293b"
                      : "#f1f5f9"
                    : "transparent",
                  transform: isHovered ? "translateX(4px)" : "translateX(0)",
                  transition: "all 180ms ease",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: seg.color,
                      boxShadow: isHovered
                        ? `0 0 0 3px ${seg.color}33`
                        : "none",
                      transition: "box-shadow 180ms ease",
                    }}
                  />
                  <Typography variant="body2">{seg.label}</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={700}>
                  {seg.count}{" "}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                  >
                    ({seg.pct}%)
                  </Typography>
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Grid>
    </Grid>
  );
};
