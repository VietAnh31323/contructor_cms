import { CoreButton } from "@/components/atoms/CoreButton";
import { usePermission } from "@/components/hooks/permission/usePermission";
import CoreLoading from "@/components/molecules/CoreLoading";
import { formatVnd } from "@/components/template/Constructor/customer/constants";
import { ConsApi } from "@/config/axios";
import { PERMISSIONS } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import { useCategoryListQuery } from "@/service/constructor/Category/getList";
import { CategoryList } from "@/service/constructor/Category/getList/type";
import {
  ProjectCategoryMapDto,
  ProjectDetail,
} from "@/service/constructor/Project/getDetail/type";
import { saveProjectCategories } from "@/service/constructor/Project/save";
import { toastError, toastSuccess } from "@/toast";
import AddIcon from "@mui/icons-material/Add";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import router from "next/router";
import React, { useMemo, useState } from "react";

interface ProjectMaterialsTabProps {
  projectId: number;
  projectDetail?: ProjectDetail | null;
  onRefreshProject?: () => void;
}

type BoqDraftRow = {
  category: CategoryList | null;
  unit: string;
  quantity: string;
  unitPrice: string;
  note: string;
};

export default function ProjectMaterialsTab({
  projectId,
  projectDetail,
  onRefreshProject,
}: ProjectMaterialsTabProps) {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canUpdateProject = hasPermission(PERMISSIONS.PROJECT_UPDATE);

  const searchKey = projectDetail?.code || projectDetail?.name || "";

  const { data: steelResp, isLoading } = useQuery({
    queryKey: ["project-steel-materials", projectId, searchKey],
    queryFn: async () => {
      const res = await ConsApi.get("/api/v1/steel-project/list", {
        params: {
          search: searchKey || undefined,
          page: 0,
          size: 20,
        },
      });
      return res.data;
    },
    enabled: Boolean(projectId),
  });

  const { data: allCategoriesResp } = useCategoryListQuery({
    page: 0,
    size: 500,
  });
  const allCategories = allCategoriesResp?.data?.content ?? [];

  const [boqDialogOpen, setBoqDialogOpen] = useState(false);
  const [boqRows, setBoqRows] = useState<BoqDraftRow[]>([]);
  const [savingBoq, setSavingBoq] = useState(false);

  const categories = projectDetail?.projectCategoryMaps ?? [];
  const steelProjects: any[] = steelResp?.data?.content ?? [];

  const totalBoqAmount = useMemo(
    () =>
      categories.reduce((sum, item) => {
        const t =
          item.totalAmount !== null && item.totalAmount !== undefined
            ? Number(item.totalAmount)
            : Number(item.quantity ?? 1) * Number(item.unitPrice ?? 0);
        return sum + (Number.isFinite(t) ? t : 0);
      }, 0),
    [categories]
  );

  const openBoqEditor = () => {
    const initial: BoqDraftRow[] =
      categories.length > 0
        ? categories.map((m) => {
            const matched = allCategories.find((c) => c.id === m.category?.id);
            return {
              category:
                matched ||
                (m.category
                  ? {
                      id: m.category.id,
                      code: m.category.code || "",
                      name: m.category.name || "",
                      description: "",
                      isActive: true,
                    }
                  : null),
              unit: m.unit || matched?.unit || "",
              quantity:
                m.quantity !== null && m.quantity !== undefined
                  ? String(m.quantity)
                  : "1",
              unitPrice:
                m.unitPrice !== null && m.unitPrice !== undefined
                  ? String(m.unitPrice)
                  : matched?.defaultUnitPrice !== null &&
                    matched?.defaultUnitPrice !== undefined
                  ? String(matched.defaultUnitPrice)
                  : "0",
              note: m.note || "",
            };
          })
        : [
            {
              category: null,
              unit: "",
              quantity: "1",
              unitPrice: "0",
              note: "",
            },
          ];
    setBoqRows(initial);
    setBoqDialogOpen(true);
  };

  const draftTotalAmount = useMemo(
    () =>
      boqRows.reduce((sum, r) => {
        const q = Number(r.quantity || 0) || 0;
        const p = Number(r.unitPrice || 0) || 0;
        return sum + q * p;
      }, 0),
    [boqRows]
  );

  const handleSaveBoq = async () => {
    const validRows = boqRows.filter((r) => r.category?.id);
    if (validRows.length === 0) {
      toastError("Vui lòng chọn ít nhất 1 hạng mục công trình");
      return;
    }

    const payload: ProjectCategoryMapDto[] = validRows.map((r) => ({
      category: {
        id: r.category!.id,
        code: r.category!.code,
        name: r.category!.name,
      },
      unit: r.unit?.trim() || undefined,
      quantity: Number(r.quantity || 1) || 1,
      unitPrice: Number(r.unitPrice || 0) || 0,
      note: r.note?.trim() || undefined,
    }));

    try {
      setSavingBoq(true);
      await saveProjectCategories(projectId, payload);
      toastSuccess("Cập nhật khối lượng & đơn giá hạng mục thành công");
      setBoqDialogOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["project-detail", projectId],
      });
      onRefreshProject?.();
    } catch (err) {
      toastError(err);
    } finally {
      setSavingBoq(false);
    }
  };

  return (
    <Box className="py-4">
      {/* ================= KHỐI LƯỢNG & ĐƠN GIÁ HẠNG MỤC (2.19) ================= */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <CategoryOutlinedIcon color="primary" />
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Khối lượng & Đơn giá hạng mục công trình (2.19)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Bảng dự toán chi tiết theo hạng mục ({categories.length} hạng mục) • Tổng giá trị:{" "}
                <strong>{formatVnd(totalBoqAmount)}</strong>
              </Typography>
            </Box>
          </Stack>

          {canUpdateProject && (
            <CoreButton
              theme="draft"
              startIcon={<EditOutlinedIcon />}
              onClick={openBoqEditor}
            >
              Cập nhật Khối lượng & Đơn giá
            </CoreButton>
          )}
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700 }}>Mã HM</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên hạng mục</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đơn vị tính</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Khối lượng
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Đơn giá (VNĐ)
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Thành tiền (VNĐ)
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Dự án chưa có hạng mục công trình nào.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((item, idx) => {
                  const qty = Number(item.quantity ?? 1);
                  const price = Number(item.unitPrice ?? 0);
                  const total =
                    item.totalAmount !== null && item.totalAmount !== undefined
                      ? Number(item.totalAmount)
                      : qty * price;

                  return (
                    <TableRow key={item.id ?? idx} hover>
                      <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                        {item.category?.code || "—"}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {item.category?.name || "—"}
                      </TableCell>
                      <TableCell>
                        {item.unit ? (
                          <Chip size="small" variant="outlined" label={item.unit} />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {qty.toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell align="right">{formatVnd(price)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {formatVnd(total)}
                      </TableCell>
                      <TableCell>{item.note || "—"}</TableCell>
                    </TableRow>
                  );
                })
              )}
              {categories.length > 0 && (
                <TableRow sx={{ bgcolor: "#eff6ff" }}>
                  <TableCell colSpan={5} align="right" sx={{ fontWeight: 700 }}>
                    Tổng cộng giá trị dự toán hạng mục:
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 800, color: "primary.main" }}
                  >
                    {formatVnd(totalBoqAmount)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ================= THỐNG KÊ THÉP & VẬT TƯ KẾT CẤU ================= */}
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <ConstructionOutlinedIcon color="warning" />
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Bảng thống kê thép & vật tư kết cấu
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Dữ liệu tra cứu theo mã/tên dự án từ phân hệ Thống kê thép
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              endIcon={<OpenInNewIcon fontSize="small" />}
              onClick={() => router.push(ROUTES.STEELSTATISTICS)}
            >
              Mở Thống kê thép
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => router.push(ROUTES.STEELSTATISTICSNEW)}
            >
              + Tạo bảng thống kê thép
            </Button>
          </Stack>
        </Stack>

        {isLoading ? (
          <CoreLoading />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Mã bảng thép</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tên công trình</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Chủ đầu tư</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ngày ký</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ngày giao dự kiến</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">
                    Chi tiết
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {steelProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Chưa có bảng thống kê thép nào khớp với dự án này. Bạn có thể tạo mới hoặc mở phân hệ Thống kê thép để xem toàn bộ.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  steelProjects.map((sp) => (
                    <TableRow key={sp.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                        {sp.code}
                      </TableCell>
                      <TableCell>{sp.name}</TableCell>
                      <TableCell>{sp.owner || "—"}</TableCell>
                      <TableCell>
                        {sp.signDate
                          ? moment(sp.signDate).format("DD/MM/YYYY")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {sp.deliveryDate
                          ? moment(sp.deliveryDate).format("DD/MM/YYYY")
                          : "—"}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          endIcon={<OpenInNewIcon fontSize="small" />}
                          onClick={() =>
                            router.push({
                              pathname: `${ROUTES.STEELSTATISTICS}/${sp.id}`,
                              query: { actionType: "VIEW" },
                            })
                          }
                        >
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ================= DIALOG CHỈNH SỬA KHỐI LƯỢNG & ĐƠN GIÁ (2.19) ================= */}
      <Dialog
        open={boqDialogOpen}
        onClose={() => !savingBoq && setBoqDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Cập nhật Khối lượng & Đơn giá hạng mục (2.19)</DialogTitle>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 2 }}>
            Tổng giá trị dự toán hạng mục:{" "}
            <strong>{formatVnd(draftTotalAmount)}</strong>
          </Alert>

          <Stack spacing={2}>
            {boqRows.map((row, idx) => {
              const rowTotal =
                (Number(row.quantity || 0) || 0) *
                (Number(row.unitPrice || 0) || 0);
              return (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafc" }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3.5}>
                      <Autocomplete
                        size="small"
                        options={allCategories}
                        value={row.category}
                        getOptionLabel={(opt) => `${opt.code} - ${opt.name}`}
                        isOptionEqualToValue={(a, b) => a.id === b.id}
                        onChange={(_, val) => {
                          setBoqRows((prev) =>
                            prev.map((r, i) =>
                              i === idx
                                ? {
                                    ...r,
                                    category: val,
                                    unit: r.unit || val?.unit || "",
                                    unitPrice:
                                      r.unitPrice && Number(r.unitPrice) > 0
                                        ? r.unitPrice
                                        : val?.defaultUnitPrice
                                        ? String(val.defaultUnitPrice)
                                        : "0",
                                  }
                                : r
                            )
                          );
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Hạng mục công trình" />
                        )}
                      />
                    </Grid>

                    <Grid item xs={6} sm={3} md={1.5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Đơn vị tính"
                        placeholder="m³, m²..."
                        value={row.unit}
                        onChange={(e) =>
                          setBoqRows((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, unit: e.target.value } : r
                            )
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={6} sm={3} md={1.5}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Khối lượng"
                        value={row.quantity}
                        onChange={(e) =>
                          setBoqRows((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, quantity: e.target.value } : r
                            )
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={6} sm={3} md={2}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Đơn giá (VNĐ)"
                        value={row.unitPrice}
                        onChange={(e) =>
                          setBoqRows((prev) =>
                            prev.map((r, i) =>
                              i === idx
                                ? { ...r, unitPrice: e.target.value }
                                : r
                            )
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={6} sm={3} md={1.5}>
                      <Typography variant="caption" color="text.secondary">
                        Thành tiền
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="primary.main">
                        {formatVnd(rowTotal)}
                      </Typography>
                    </Grid>

                    <Grid item xs={10} md={1.5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Ghi chú"
                        value={row.note}
                        onChange={(e) =>
                          setBoqRows((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, note: e.target.value } : r
                            )
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={2} md={0.5} sx={{ textAlign: "right" }}>
                      <IconButton
                        color="error"
                        onClick={() =>
                          setBoqRows((prev) => prev.filter((_, i) => i !== idx))
                        }
                        disabled={boqRows.length <= 1}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                setBoqRows((prev) => [
                  ...prev,
                  {
                    category: null,
                    unit: "",
                    quantity: "1",
                    unitPrice: "0",
                    note: "",
                  },
                ])
              }
            >
              Thêm hạng mục
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <CoreButton
            theme="cancel"
            onClick={() => setBoqDialogOpen(false)}
            disabled={savingBoq}
          >
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={handleSaveBoq}
            loading={savingBoq}
          >
            Lưu khối lượng & đơn giá
          </CoreButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
