import {
  DiameterSummaryDto,
  SteelBarDto,
  SteelCategoryOutput,
  SteelProjectAssemblyMapDto,
} from "@/service/constructor/SteelProject/type";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
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
import React from "react";
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
                const nextName = `L${lines.length + 1}`;
                return {
                  ...b,
                  steelLines: [...lines, { paramName: nextName, value: 0 }],
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
              steels: (a.steels ?? []).map((b, bi) => {
                if (bi !== barIdx) return b;
                return {
                  ...b,
                  steelLines: (b.steelLines ?? []).filter(
                    (_, li) => li !== lineIdx
                  ),
                };
              }),
            }
      )
    );
  };

  return (
    <Box className="px-2 py-2">
      {/* KPI Tổng quan */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafc" }}>
            <Typography variant="caption" color="text.secondary">
              Tổng số cấu kiện
            </Typography>
            <Typography variant="h6" fontWeight={800}>
              {assemblies.length} cấu kiện
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: "#f0fdf4" }}>
            <Typography variant="caption" color="text.secondary">
              Tổng chiều dài cắt
            </Typography>
            <Typography variant="h6" fontWeight={800} color="success.dark">
              {summary.totalLength.toLocaleString("vi-VN", {
                maximumFractionDigits: 2,
              })}{" "}
              m
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: "#fffbeb" }}>
            <Typography variant="caption" color="text.secondary">
              Tổng khối lượng thép (Ø² × 0.00617 × L)
            </Typography>
            <Typography variant="h6" fontWeight={800} color="warning.dark">
              {summary.totalWeight.toLocaleString("vi-VN", {
                maximumFractionDigits: 2,
              })}{" "}
              kg (
              {(summary.totalWeight / 1000).toLocaleString("vi-VN", {
                maximumFractionDigits: 3,
              })}{" "}
              tấn)
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Danh sách Cấu kiện & Thanh thép */}
      <Stack spacing={3}>
        {assemblies.map((assembly, aIdx) => {
          const sameQty = Math.max(1, Number(assembly.sameQuantity || 1));
          const aTotal = summary.assemblyTotals[aIdx] ?? {
            totalLength: 0,
            totalWeight: 0,
          };

          return (
            <Paper
              key={aIdx}
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 2, borderColor: "#cbd5e1" }}
            >
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={12} sm={5} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    disabled={isView}
                    label={`Tên cấu kiện #${aIdx + 1}`}
                    value={assembly.assemblyName}
                    onChange={(e) =>
                      updateAssemblyField(aIdx, {
                        assemblyName: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    disabled={isView}
                    label="SL cấu kiện giống nhau"
                    value={assembly.sameQuantity}
                    inputProps={{ min: 1 }}
                    onChange={(e) =>
                      updateAssemblyField(aIdx, {
                        sameQuantity: Math.max(1, Number(e.target.value || 1)),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    disabled={isView}
                    label="Ghi chú cấu kiện"
                    value={assembly.note ?? ""}
                    onChange={(e) =>
                      updateAssemblyField(aIdx, { note: e.target.value })
                    }
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
                    gap: 1,
                  }}
                >
                  <Chip
                    label={`Tổng CK: ${aTotal.totalWeight.toLocaleString(
                      "vi-VN",
                      { maximumFractionDigits: 2 }
                    )} kg`}
                    color="warning"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                  {!isView && (
                    <Tooltip title="Xóa cấu kiện">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => removeAssembly(aIdx)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f1f5f9" }}>
                      <TableCell sx={{ fontWeight: 700, minWidth: 80 }}>
                        Số hiệu
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>
                        Hình dạng thép
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, minWidth: 95 }}>
                        Ø (mm)
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, minWidth: 220 }}>
                        Kích thước các đoạn (mm)
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, minWidth: 95 }}>
                        Nối chồng (mm)
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, minWidth: 95 }}>
                        Trừ uốn (mm)
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, minWidth: 90 }} align="right">
                        L cắt (m)
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, minWidth: 85 }}>
                        SL/1 CK
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, minWidth: 80 }} align="right">
                        Tổng thanh
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, minWidth: 100 }} align="right">
                        Tổng dài (m)
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, minWidth: 105 }} align="right">
                        Khối lượng (kg)
                      </TableCell>
                      {!isView && <TableCell align="center" width={48} />}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(assembly.steels ?? []).map((bar, bIdx) => {
                      const m = computeBarMetrics(bar, sameQty);
                      const shapeImg =
                        bar.images?.[0]?.url ||
                        steelCategories.find(
                          (c) => c.id === bar.steelCategoryId
                        )?.images?.[0]?.url;

                      return (
                        <TableRow key={bIdx} hover>
                          <TableCell>
                            <TextField
                              size="small"
                              disabled={isView}
                              value={bar.barLabel ?? ""}
                              onChange={(e) =>
                                updateBar(aIdx, bIdx, {
                                  barLabel: e.target.value,
                                })
                              }
                            />
                          </TableCell>

                          <TableCell>
                            <Stack spacing={0.5}>
                              <TextField
                                select
                                size="small"
                                disabled={isView}
                                value={bar.steelCategoryId ?? ""}
                                onChange={(e) => {
                                  const val = e.target.value
                                    ? Number(e.target.value)
                                    : null;
                                  onSelectCategoryForBar(aIdx, bIdx, val);
                                }}
                              >
                                <MenuItem value="">Tùy chỉnh đoạn</MenuItem>
                                {steelCategories.map((cat) => (
                                  <MenuItem key={cat.id} value={cat.id}>
                                    {cat.code} - {cat.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                              {shapeImg && (
                                <img
                                  src={shapeImg}
                                  alt="Hình dạng"
                                  style={{
                                    maxHeight: 34,
                                    objectFit: "contain",
                                    alignSelf: "flex-start",
                                  }}
                                />
                              )}
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <TextField
                              select
                              size="small"
                              disabled={isView}
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
                          </TableCell>

                          <TableCell>
                            <Stack spacing={0.5}>
                              {(bar.steelLines ?? []).map((line, lIdx) => (
                                <Stack
                                  key={lIdx}
                                  direction="row"
                                  spacing={0.5}
                                  alignItems="center"
                                >
                                  <TextField
                                    size="small"
                                    disabled={isView}
                                    sx={{ width: 62 }}
                                    value={line.paramName}
                                    onChange={(e) =>
                                      updateLineValue(aIdx, bIdx, lIdx, {
                                        paramName: e.target.value,
                                      })
                                    }
                                  />
                                  <TextField
                                    size="small"
                                    type="number"
                                    disabled={isView}
                                    sx={{ width: 105 }}
                                    value={line.value}
                                    onChange={(e) =>
                                      updateLineValue(aIdx, bIdx, lIdx, {
                                        value: Number(e.target.value || 0),
                                      })
                                    }
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
                                  sx={{
                                    alignSelf: "flex-start",
                                    textTransform: "none",
                                    p: 0,
                                    minWidth: 0,
                                  }}
                                  onClick={() => addLineSegment(aIdx, bIdx)}
                                >
                                  + Thêm đoạn
                                </Button>
                              )}
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              disabled={isView}
                              value={bar.spliceLength ?? 0}
                              onChange={(e) =>
                                updateBar(aIdx, bIdx, {
                                  spliceLength: Number(e.target.value || 0),
                                })
                              }
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              disabled={isView}
                              value={bar.bendDeduction ?? 0}
                              onChange={(e) =>
                                updateBar(aIdx, bIdx, {
                                  bendDeduction: Number(e.target.value || 0),
                                })
                              }
                            />
                          </TableCell>

                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            {m.cutLengthMeter.toLocaleString("vi-VN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 3,
                            })}
                          </TableCell>

                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              disabled={isView}
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
                          </TableCell>

                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            {m.totalBars}
                          </TableCell>

                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            {m.totalLength.toLocaleString("vi-VN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>

                          <TableCell
                            align="right"
                            sx={{ fontWeight: 700, color: "warning.dark" }}
                          >
                            {m.totalWeight.toLocaleString("vi-VN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>

                          {!isView && (
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeBar(aIdx, bIdx)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {!isView && (
                <Box sx={{ mt: 1.5 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addBar(aIdx)}
                  >
                    Thêm thanh thép
                  </Button>
                </Box>
              )}
            </Paper>
          );
        })}
      </Stack>

      {!isView && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addAssembly}
          >
            Thêm cấu kiện mới
          </Button>
        </Box>
      )}

      {/* Bảng tổng hợp theo Đường kính (Ø) */}
      <Paper variant="outlined" sx={{ p: 2.5, mt: 3, borderRadius: 2 }}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.diameterSummaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                    Chưa có dữ liệu thanh thép
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {summary.diameterSummaries.map((row) => (
                    <TableRow key={row.barDiameter} hover>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Ø{row.barDiameter}
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
                    </TableRow>
                  ))}
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
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
