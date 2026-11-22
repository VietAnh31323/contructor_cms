import {
  DiameterSummaryDto,
  SteelBarDto,
  SteelCategoryOutput,
  SteelProjectAssemblyMapDto,
} from "@/service/constructor/SteelProject/type";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { computeBarMetrics } from "../../useSteelStatisticsSave";

const COMMON_DIAMETERS = [6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32];

interface Step2Props {
  assemblies: SteelProjectAssemblyMapDto[];
  setAssemblies: React.Dispatch<
    React.SetStateAction<SteelProjectAssemblyMapDto[]>
  >;
  steelCategories: SteelCategoryOutput[];
  summary: {
    totalLength: number;
    totalWeight: number;
    assemblyTotals: { totalLength: number; totalWeight: number }[];
    diameterSummaries: DiameterSummaryDto[];
  };
  isView?: boolean;
  onSelectCategoryForBar: (
    assemblyIdx: number,
    barIdx: number,
    steelCategoryId: number | null
  ) => void;
}

export default function Step2({
  assemblies,
  setAssemblies,
  steelCategories,
  summary,
  isView,
  onSelectCategoryForBar,
}: Step2Props) {
  const [collapsedMap, setCollapsedMap] = useState<Record<number, boolean>>({});

  const toggleCollapse = (idx: number) => {
    setCollapsedMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const addAssembly = () => {
    setAssemblies((prev) => [
      ...prev,
      {
        assemblyName: `Cấu kiện ${prev.length + 1}`,
        sameQuantity: 1,
        steels: [
          {
            barLabel: "1",
            barDiameter: 16,
            barQuantity: 1,
            spliceLength: 0,
            bendDeduction: 0,
            steelLines: [{ paramName: "L", value: 6000 }],
          },
        ],
      },
    ]);
  };

  const duplicateAssembly = (idx: number) => {
    setAssemblies((prev) => {
      const target = prev[idx];
      if (!target) return prev;
      const copy: SteelProjectAssemblyMapDto = {
        ...target,
        id: undefined,
        assemblyName: `${target.assemblyName} (Bản sao)`,
        steels: (target.steels ?? []).map((b) => ({
          ...b,
          id: undefined,
          steelLines: (b.steelLines ?? []).map((l) => ({ ...l, id: undefined })),
        })),
      };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };

  const removeAssembly = (idx: number) => {
    setAssemblies((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateAssemblyField = (
    idx: number,
    patch: Partial<SteelProjectAssemblyMapDto>
  ) => {
    setAssemblies((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, ...patch } : a))
    );
  };

  const addBar = (assemblyIdx: number) => {
    setAssemblies((prev) =>
      prev.map((a, ai) => {
        if (ai !== assemblyIdx) return a;
        const current = a.steels ?? [];
        const newBar: SteelBarDto = {
          barLabel: String(current.length + 1),
          barDiameter: 16,
          barQuantity: 1,
          spliceLength: 0,
          bendDeduction: 0,
          steelLines: [{ paramName: "L", value: 6000 }],
        };
        return { ...a, steels: [...current, newBar] };
      })
    );
  };

  const removeBar = (assemblyIdx: number, barIdx: number) => {
    setAssemblies((prev) =>
      prev.map((a, ai) =>
        ai !== assemblyIdx
          ? a
          : { ...a, steels: (a.steels ?? []).filter((_, bi) => bi !== barIdx) }
      )
    );
  };

  const updateBar = (
    assemblyIdx: number,
    barIdx: number,
    patch: Partial<SteelBarDto>
  ) => {
    setAssemblies((prev) =>
      prev.map((a, ai) =>
        ai !== assemblyIdx
          ? a
          : {
              ...a,
              steels: (a.steels ?? []).map((b, bi) =>
                bi === barIdx ? { ...b, ...patch } : b
              ),
            }
      )
    );
  };

  const updateLineValue = (
    assemblyIdx: number,
    barIdx: number,
    lineIdx: number,
    patch: { paramName?: string; value?: number }
  ) => {
    setAssemblies((prev) =>
      prev.map((a, ai) =>
        ai !== assemblyIdx
          ? a
          : {
              ...a,
              steels: (a.steels ?? []).map((b, bi) => {
                if (bi !== barIdx) return b;
                const lines = (b.steelLines ?? []).map((l, li) =>
                  li === lineIdx ? { ...l, ...patch } : l
                );
                return { ...b, steelLines: lines };
              }),
            }
      )
    );
  };

  const addLineSegment = (assemblyIdx: number, barIdx: number) => {
    setAssemblies((prev) =>
      prev.map((a, ai) =>
        ai !== assemblyIdx
          ? a
          : {
              ...a,
              steels: (a.steels ?? []).map((b, bi) => {
                if (bi !== barIdx) return b;
                const lines = b.steelLines ?? [];
                return {
                  ...b,
                  steelLines: [
                    ...lines,
                    { paramName: `L${lines.length + 1}`, value: 0 },
                  ],
                };
              }),
            }
      )
    );
  };

  const removeLineSegment = (
    assemblyIdx: number,
    barIdx: number,
    lineIdx: number
  ) => {
    setAssemblies((prev) =>
      prev.map((a, ai) =>
        ai !== assemblyIdx
          ? a
          : {
              ...a,
              steels: (a.steels ?? []).map((b, bi) =>
                bi !== barIdx
                  ? b
                  : {
                      ...b,
                      steelLines: (b.steelLines ?? []).filter(
                        (_, li) => li !== lineIdx
                      ),
                    }
              ),
            }
      )
    );
  };

  return (
    <Stack spacing={3}>
      {/* Danh sách Cấu kiện */}
      {assemblies.map((assembly, aIdx) => {
        const sameQty = Math.max(1, Number(assembly.sameQuantity || 1));
        const aTotal = summary.assemblyTotals[aIdx] ?? {
          totalLength: 0,
          totalWeight: 0,
        };
        const isCollapsed = Boolean(collapsedMap[aIdx]);

        return (
          <Paper
            key={aIdx}
            elevation={0}
            sx={{
              borderRadius: 2.5,
              border: "1px solid #cbd5e1",
              overflow: "hidden",
              bgcolor: "#ffffff",
            }}
          >
            {/* Assembly Header Bar */}
            <Box
              sx={{
                px: 2.5,
                py: 1.8,
                bgcolor: "#f8fafc",
                borderBottom: isCollapsed ? "none" : "1px solid #e2e8f0",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: 13,
                        fontWeight: 800,
                        bgcolor: "#2563eb",
                      }}
                    >
                      #{aIdx + 1}
                    </Avatar>
                    <TextField
                      fullWidth
                      size="small"
                      disabled={isView}
                      label="Tên cấu kiện"
                      value={assembly.assemblyName}
                      onChange={(e) =>
                        updateAssemblyField(aIdx, {
                          assemblyName: e.target.value,
                        })
                      }
                      sx={{ bgcolor: "#ffffff" }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={6} sm={4} md={2}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    disabled={isView}
                    label="SL cấu kiện"
                    value={assembly.sameQuantity}
                    inputProps={{ min: 1 }}
                    onChange={(e) =>
                      updateAssemblyField(aIdx, {
                        sameQuantity: Math.max(1, Number(e.target.value || 1)),
                      })
                    }
                    sx={{ bgcolor: "#ffffff" }}
                  />
                </Grid>

                <Grid item xs={6} sm={8} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    disabled={isView}
                    label="Ghi chú cấu kiện"
                    value={assembly.note ?? ""}
                    onChange={(e) =>
                      updateAssemblyField(aIdx, { note: e.target.value })
                    }
                    sx={{ bgcolor: "#ffffff" }}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 0.8,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    size="small"
                    color="warning"
                    label={`${aTotal.totalLength.toLocaleString("vi-VN", {
                      maximumFractionDigits: 1,
                    })} m • ${aTotal.totalWeight.toLocaleString("vi-VN", {
                      maximumFractionDigits: 1,
                    })} kg`}
                    sx={{ fontWeight: 700 }}
                  />
                  {!isView && (
                    <>
                      <Tooltip title="Nhân bản cấu kiện">
                        <IconButton
                          size="small"
                          onClick={() => duplicateAssembly(aIdx)}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa cấu kiện">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeAssembly(aIdx)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  <IconButton size="small" onClick={() => toggleCollapse(aIdx)}>
                    {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </IconButton>
                </Grid>
              </Grid>
            </Box>

            {/* Bars List (Airy Card Rows instead of crammed table) */}
            <Collapse in={!isCollapsed}>
              <Box sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  {(assembly.steels ?? []).map((bar, bIdx) => {
                    const m = computeBarMetrics(bar, sameQty);
                    const shapeImg =
                      bar.images?.[0]?.url ||
                      steelCategories.find((c) => c.id === bar.steelCategoryId)
                        ?.images?.[0]?.url;

                    return (
                      <Paper
                        key={bIdx}
                        variant="outlined"
                        sx={{
                          p: 1.8,
                          borderRadius: 2,
                          borderColor: "#e2e8f0",
                          bgcolor: "#fcfcfd",
                          "&:hover": { borderColor: "#93c5fd" },
                        }}
                      >
                        <Grid container spacing={1.5} alignItems="center">
                          <Grid item xs={4} sm={2} md={1.1}>
                            <TextField
                              fullWidth
                              size="small"
                              disabled={isView}
                              label="Số hiệu"
                              value={bar.barLabel ?? ""}
                              onChange={(e) =>
                                updateBar(aIdx, bIdx, {
                                  barLabel: e.target.value,
                                })
                              }
                            />
                          </Grid>

                          <Grid item xs={12} sm={5} md={2.7}>
                            <TextField
                              fullWidth
                              select
                              size="small"
                              disabled={isView}
                              label="Hình dạng thép"
                              value={bar.steelCategoryId ?? ""}
                              SelectProps={{
                                MenuProps: {
                                  PaperProps: {
                                    sx: { maxHeight: 420, width: 380 },
                                  },
                                },
                                renderValue: (selected) => {
                                  const cat = steelCategories.find(
                                    (c) => c.id === Number(selected)
                                  );
                                  if (!cat) {
                                    return (
                                      <Typography variant="body2" color="text.secondary">
                                        Tùy chỉnh đoạn
                                      </Typography>
                                    );
                                  }
                                  const img = cat.images?.[0]?.url || shapeImg;
                                  return (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      {img && (
                                        <Box
                                          sx={{
                                            width: 44,
                                            height: 24,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: 0.8,
                                            bgcolor: "#ffffff",
                                            flexShrink: 0,
                                            overflow: "hidden",
                                          }}
                                        >
                                          <img
                                            src={img}
                                            alt={cat.code}
                                            style={{
                                              maxWidth: "100%",
                                              maxHeight: "100%",
                                              objectFit: "contain",
                                            }}
                                          />
                                        </Box>
                                      )}
                                      <Typography variant="body2" fontWeight={600} noWrap>
                                        {cat.code} - {cat.name}
                                      </Typography>
                                    </Stack>
                                  );
                                },
                              }}
                              onChange={(e) => {
                                const val = e.target.value
                                  ? Number(e.target.value)
                                  : null;
                                onSelectCategoryForBar(aIdx, bIdx, val);
                              }}
                            >
                              <MenuItem value="">
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <Box
                                    sx={{
                                      width: 72,
                                      height: 36,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      border: "1px dashed #cbd5e1",
                                      borderRadius: 1,
                                      bgcolor: "#f8fafc",
                                      color: "text.secondary",
                                      fontSize: 11,
                                      flexShrink: 0,
                                    }}
                                  >
                                    Tự nhập
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Tùy chỉnh đoạn
                                  </Typography>
                                </Stack>
                              </MenuItem>
                              {steelCategories.map((cat) => {
                                const imgUrl = cat.images?.[0]?.url;
                                return (
                                  <MenuItem key={cat.id} value={cat.id} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: "100%" }}>
                                      <Box
                                        sx={{
                                          width: 72,
                                          height: 36,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          border: "1px solid #e2e8f0",
                                          borderRadius: 1,
                                          bgcolor: "#ffffff",
                                          p: 0.4,
                                          flexShrink: 0,
                                        }}
                                      >
                                        {imgUrl ? (
                                          <img
                                            src={imgUrl}
                                            alt={cat.name}
                                            style={{
                                              maxWidth: "100%",
                                              maxHeight: "100%",
                                              objectFit: "contain",
                                            }}
                                          />
                                        ) : (
                                          <Typography variant="caption" color="text.disabled">
                                            No img
                                          </Typography>
                                        )}
                                      </Box>
                                      <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography variant="body2" fontWeight={700} noWrap>
                                          {cat.code}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          display="block"
                                          noWrap
                                        >
                                          {cat.name}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  </MenuItem>
                                );
                              })}
                            </TextField>
                          </Grid>

                          <Grid item xs={4} sm={2.5} md={1.2}>
                            <TextField
                              fullWidth
                              select
                              size="small"
                              disabled={isView}
                              label="Đường kính"
                              value={bar.barDiameter ?? 16}
                              onChange={(e) =>
                                updateBar(aIdx, bIdx, {
                                  barDiameter: Number(e.target.value),
                                })
                              }
                            >
                              {COMMON_DIAMETERS.map((d) => (
                                <MenuItem key={d} value={d}>
                                  Ø{d}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>

                          <Grid item xs={4} sm={2.5} md={1.2}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              disabled={isView}
                              label="SL / 1 CK"
                              value={bar.barQuantity ?? 0}
                              inputProps={{ min: 0 }}
                              onChange={(e) =>
                                updateBar(aIdx, bIdx, {
                                  barQuantity: Math.max(
                                    0,
                                    Number(e.target.value || 0)
                                  ),
                                })
                              }
                            />
                          </Grid>

                          <Grid item xs={6} sm={3} md={1.3}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              disabled={isView}
                              label="Nối chồng (mm)"
                              value={bar.spliceLength ?? 0}
                              onChange={(e) =>
                                updateBar(aIdx, bIdx, {
                                  spliceLength: Number(e.target.value || 0),
                                })
                              }
                            />
                          </Grid>

                          <Grid item xs={6} sm={3} md={1.2}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              disabled={isView}
                              label="Trừ uốn (mm)"
                              value={bar.bendDeduction ?? 0}
                              onChange={(e) =>
                                updateBar(aIdx, bIdx, {
                                  bendDeduction: Number(e.target.value || 0),
                                })
                              }
                            />
                          </Grid>

                          {/* Live Computed Result Pill */}
                          <Grid item xs={12} sm={6} md={3.3}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{
                                px: 1.5,
                                py: 0.8,
                                borderRadius: 1.5,
                                bgcolor: "#eff6ff",
                                border: "1px solid #bfdbfe",
                              }}
                            >
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  L cắt:{" "}
                                  <b>
                                    {m.cutLengthMeter.toLocaleString("vi-VN", {
                                      maximumFractionDigits: 3,
                                    })}{" "}
                                    m
                                  </b>{" "}
                                  • {m.totalBars} thanh
                                </Typography>
                                <Typography
                                  variant="body2"
                                  fontWeight={800}
                                  color="primary.dark"
                                >
                                  {m.totalLength.toLocaleString("vi-VN", {
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  m •{" "}
                                  <span style={{ color: "#b45309" }}>
                                    {m.totalWeight.toLocaleString("vi-VN", {
                                      maximumFractionDigits: 2,
                                    })}{" "}
                                    kg
                                  </span>
                                </Typography>
                              </Box>
                              {!isView && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => removeBar(aIdx, bIdx)}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Stack>
                          </Grid>

                          {/* Segments Row */}
                          <Grid item xs={12}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              flexWrap="wrap"
                              gap={1}
                              sx={{ pt: 0.5 }}
                            >
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                color="text.secondary"
                              >
                                Kích thước đoạn (mm):
                              </Typography>
                              {(bar.steelLines ?? []).map((line, lIdx) => (
                                <Stack
                                  key={lIdx}
                                  direction="row"
                                  spacing={0.5}
                                  alignItems="center"
                                  sx={{
                                    p: 0.5,
                                    borderRadius: 1.5,
                                    bgcolor: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                  }}
                                >
                                  <TextField
                                    size="small"
                                    disabled={isView}
                                    value={line.paramName}
                                    onChange={(e) =>
                                      updateLineValue(aIdx, bIdx, lIdx, {
                                        paramName: e.target.value,
                                      })
                                    }
                                    sx={{ width: 58 }}
                                  />
                                  <TextField
                                    size="small"
                                    type="number"
                                    disabled={isView}
                                    value={line.value}
                                    onChange={(e) =>
                                      updateLineValue(aIdx, bIdx, lIdx, {
                                        value: Number(e.target.value || 0),
                                      })
                                    }
                                    sx={{ width: 92 }}
                                  />
                                  {!isView &&
                                    (bar.steelLines ?? []).length > 1 && (
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                          removeLineSegment(aIdx, bIdx, lIdx)
                                        }
                                      >
                                        <DeleteOutlineIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                </Stack>
                              ))}
                              {!isView && (
                                <Button
                                  size="small"
                                  variant="text"
                                  startIcon={<AddIcon />}
                                  onClick={() => addLineSegment(aIdx, bIdx)}
                                  sx={{ textTransform: "none", fontWeight: 600 }}
                                >
                                  Thêm đoạn
                                </Button>
                              )}
                            </Stack>
                          </Grid>
                        </Grid>
                      </Paper>
                    );
                  })}
                </Stack>

                {!isView && (
                  <Box sx={{ mt: 1.5 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => addBar(aIdx)}
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      Thêm thanh thép vào cấu kiện
                    </Button>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Paper>
        );
      })}

      {!isView && (
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addAssembly}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
          >
            Thêm cấu kiện mới
          </Button>
        </Box>
      )}

      {/* Bảng tổng hợp theo Đường kính (Ø) */}
      <Paper
        elevation={0}
        sx={{ p: 2.5, borderRadius: 2.5, border: "1px solid #e2e8f0" }}
      >
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
          Bảng tổng hợp thép theo đường kính (Ø)
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700 }}>Đường kính</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Tổng số thanh
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Tổng chiều dài (m)
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Tổng khối lượng (kg)
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Quy đổi (tấn)
                </TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>
                  Tỷ trọng khối lượng
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.diameterSummaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    Chưa có dữ liệu thanh thép
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {summary.diameterSummaries.map((row) => {
                    const share =
                      summary.totalWeight > 0
                        ? Math.round(
                            (row.totalWeightKg / summary.totalWeight) * 100
                          )
                        : 0;
                    return (
                      <TableRow key={row.barDiameter} hover>
                        <TableCell>
                          <Chip
                            size="small"
                            label={`Ø${row.barDiameter}`}
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 800 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {row.totalBars.toLocaleString("vi-VN")}
                        </TableCell>
                        <TableCell align="right">
                          {row.totalLengthMeter.toLocaleString("vi-VN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          {row.totalWeightKg.toLocaleString("vi-VN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell align="right">
                          {(row.totalWeightKg / 1000).toLocaleString("vi-VN", {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                          })}
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <LinearProgress
                              variant="determinate"
                              color="warning"
                              value={share}
                              sx={{ flex: 1, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" fontWeight={700}>
                              {share}%
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow sx={{ bgcolor: "#fffbeb" }}>
                    <TableCell colSpan={2} sx={{ fontWeight: 800 }}>
                      TỔNG CỘNG
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>
                      {summary.totalLength.toLocaleString("vi-VN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 800, color: "warning.dark" }}
                    >
                      {summary.totalWeight.toLocaleString("vi-VN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 800, color: "warning.dark" }}
                    >
                      {(summary.totalWeight / 1000).toLocaleString("vi-VN", {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3,
                      })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>100%</TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}
