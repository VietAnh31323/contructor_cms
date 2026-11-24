import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { MonthlyCashflowDto } from "@/service/constructor/Dashboard/type";
import { formatVnd } from "@/components/template/Constructor/customer/constants";

function formatCompactMoney(val: number): string {
  const n = Number(val || 0);
  if (Math.abs(n) >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toFixed(2)} tỷ`;
  }
  if (Math.abs(n) >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)} tr`;
  }
  return n.toLocaleString("vi-VN");
}

interface Prism3DBarProps {
  x: number;
  baseY: number;
  width: number;
  height: number;
  depthX: number;
  depthY: number;
  frontFill: string;
  topColor: string;
  sideColor: string;
  opacity: number;
  isHovered: boolean;
}

const Prism3DBar: React.FC<Prism3DBarProps> = ({
  x,
  baseY,
  width,
  height,
  depthX,
  depthY,
  frontFill,
  topColor,
  sideColor,
  opacity,
  isHovered,
}) => {
  const y = baseY - height;
  const frontPath = `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${baseY} L ${x} ${baseY} Z`;
  const topPath = `M ${x} ${y} L ${x + depthX} ${y - depthY} L ${
    x + width + depthX
  } ${y - depthY} L ${x + width} ${y} Z`;
  const sidePath = `M ${x + width} ${y} L ${x + width + depthX} ${
    y - depthY
  } L ${x + width + depthX} ${baseY - depthY} L ${x + width} ${baseY} Z`;

  return (
    <g
      style={{
        opacity,
        transform: isHovered ? "translateY(-3px)" : "translateY(0px)",
        transition: "transform 200ms ease, opacity 200ms ease",
      }}
    >
      {/* Floor shadow */}
      <polygon
        points={`${x + 2},${baseY} ${x + width + depthX + 3},${baseY - depthY} ${
          x + width + depthX + 5
        },${baseY - depthY + 3} ${x + width + 2},${baseY + 3}`}
        fill="rgba(15, 23, 42, 0.08)"
      />
      {/* Right 3D face */}
      <path d={sidePath} fill={sideColor} />
      {/* Top 3D face */}
      <path d={topPath} fill={topColor} />
      {/* Front face */}
      <path d={frontPath} fill={frontFill} />
      {/* Crisp top specular edge */}
      <line
        x1={x}
        y1={y}
        x2={x + width}
        y2={y}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1"
      />
    </g>
  );
};

interface Cashflow3DChartProps {
  cashflow: MonthlyCashflowDto[];
}

export const Cashflow3DChart: React.FC<Cashflow3DChartProps> = ({
  cashflow,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [tilt, setTilt] = useState({ x: 4, y: 0 });

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 780;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cashflow.length]);

  const maxCashflow = Math.max(
    1,
    ...cashflow.map((m) =>
      Math.max(Number(m.collectedAmount || 0), Number(m.plannedAmount || 0))
    )
  );

  const trendPath = useMemo(() => {
    if (!cashflow.length) return "";
    return cashflow
      .map((m, idx) => {
        const x = 76 + idx * 82 + 12;
        const h = (Number(m.collectedAmount || 0) / maxCashflow) * 140 * progress;
        const y = 175 - h - 6;
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [cashflow, maxCashflow, progress]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: 5 - ny * 6,
      y: nx * 7,
    });
  };

  return (
    <Box>
      <Box
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setTilt({ x: 4, y: 0 });
          setHoveredMonth(null);
        }}
        sx={{
          width: "100%",
          overflowX: "auto",
          perspective: "1100px",
        }}
      >
        <Box
          sx={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 260ms ease-out",
          }}
        >
          <svg width="100%" height={218} viewBox="0 0 580 218">
            <defs>
              <linearGradient id="col3DFront" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="plan3DFront" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <filter id="lineGlow" x="-10%" y="-20%" width="120%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="2.2"
                  floodColor="#0284c7"
                  floodOpacity="0.35"
                />
              </filter>
            </defs>

            {/* 3D Isometric back-plane gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((g) => {
              const y = 175 - g * 140;
              return (
                <g key={g}>
                  <line
                    x1="56"
                    y1={y}
                    x2="565"
                    y2={y}
                    stroke={
                      g === 0
                        ? isDark
                          ? "#334155"
                          : "#cbd5e1"
                        : isDark
                        ? "#1e293b"
                        : "#e2e8f0"
                    }
                    strokeDasharray={g === 0 ? undefined : "3 3"}
                  />
                  <text
                    x="48"
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill={isDark ? "#94a3b8" : "#64748b"}
                  >
                    {formatCompactMoney(maxCashflow * g)}
                  </text>
                </g>
              );
            })}

            {/* 3D Floor slab */}
            <polygon
              points="56,175 565,175 574,169 65,169"
              fill={isDark ? "#1e293b" : "#f1f5f9"}
              stroke={isDark ? "#334155" : "#e2e8f0"}
              strokeWidth="0.8"
            />

            {/* 3D Bars */}
            {cashflow.map((m, idx) => {
              const xBase = 76 + idx * 82;
              const colH = Math.max(
                4,
                (Number(m.collectedAmount || 0) / maxCashflow) * 140 * progress
              );
              const planH = Math.max(
                4,
                (Number(m.plannedAmount || 0) / maxCashflow) * 140 * progress
              );
              const isHovered = hoveredMonth === idx;
              const barOpacity =
                hoveredMonth === null || isHovered ? 1 : 0.42;

              return (
                <g
                  key={m.month}
                  onMouseEnter={() => setHoveredMonth(idx)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  style={{ cursor: "pointer" }}
                >
                  <Prism3DBar
                    x={xBase}
                    baseY={175}
                    width={20}
                    height={colH}
                    depthX={7}
                    depthY={5}
                    frontFill="url(#col3DFront)"
                    topColor="#34d399"
                    sideColor="#047857"
                    opacity={barOpacity}
                    isHovered={isHovered}
                  />

                  <Prism3DBar
                    x={xBase + 27}
                    baseY={175}
                    width={20}
                    height={planH}
                    depthX={7}
                    depthY={5}
                    frontFill="url(#plan3DFront)"
                    topColor="#fcd34d"
                    sideColor="#b45309"
                    opacity={barOpacity}
                    isHovered={isHovered}
                  />

                  <text
                    x={xBase + 25}
                    y={198}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isHovered ? "700" : "500"}
                    fill={
                      isHovered
                        ? isDark
                          ? "#f1f5f9"
                          : "#0f172a"
                        : isDark
                        ? "#94a3b8"
                        : "#475569"
                    }
                  >
                    {m.month}
                  </text>
                </g>
              );
            })}

            {/* Floating 3D trend ribbon */}
            {trendPath && (
              <path
                d={trendPath}
                fill="none"
                stroke="#0284c7"
                strokeWidth={2.3}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lineGlow)"
              />
            )}

            {cashflow.map((m, idx) => {
              const cx = 76 + idx * 82 + 12;
              const cy =
                175 -
                (Number(m.collectedAmount || 0) / maxCashflow) * 140 * progress -
                6;
              const isHovered = hoveredMonth === idx;
              return (
                <g key={`pt-${m.month}`} style={{ pointerEvents: "none" }}>
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={9}
                      fill="rgba(2, 132, 199, 0.16)"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 5 : 3.5}
                    fill="#ffffff"
                    stroke="#0284c7"
                    strokeWidth={2}
                    style={{ transition: "r 160ms ease" }}
                  />
                </g>
              );
            })}
          </svg>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 1,
          px: 1.5,
          py: 0.9,
          borderRadius: 1.5,
          bgcolor:
            hoveredMonth !== null
              ? "#0f172a"
              : isDark
              ? "#1e293b"
              : "#f8fafc",
          color:
            hoveredMonth !== null
              ? "#ffffff"
              : isDark
              ? "#cbd5e1"
              : "#64748b",
          transition: "background-color 200ms ease, color 200ms ease",
        }}
      >
        {hoveredMonth !== null && cashflow[hoveredMonth] ? (
          <Typography variant="caption">
            <b>Tháng {cashflow[hoveredMonth].month}</b> — Thực thu:{" "}
            <b style={{ color: "#34d399" }}>
              {formatVnd(cashflow[hoveredMonth].collectedAmount)}
            </b>{" "}
            • Kế hoạch:{" "}
            <b style={{ color: "#fbbf24" }}>
              {formatVnd(cashflow[hoveredMonth].plannedAmount)}
            </b>
          </Typography>
        ) : (
          <Typography variant="caption">
            Di chuột lên từng tháng trên biểu đồ 3D để xem đối chiếu Thực thu và
            Kế hoạch.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
