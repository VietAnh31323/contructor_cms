import { CoreButton } from "@/components/atoms/CoreButton";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { formatVnd } from "@/components/template/Constructor/customer/constants";
import {
  addContractAddendum,
  createContract,
  deleteContract,
  deleteContractAddendum,
  updateContract,
  updateContractAddendum,
} from "@/service/constructor/Project/memberContract";
import {
  ADDENDUM_ADJUSTMENT_TYPE_OPTIONS,
  AddendumAdjustmentType,
  CONTRACT_STATUS_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  ContractAddendumItem,
  ContractItem,
  ContractStatus,
  ContractType,
} from "@/service/constructor/Project/memberContract/type";
import { toastError, toastSuccess } from "@/toast";
import AddIcon from "@mui/icons-material/Add";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
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
import moment from "moment";
import React, { useMemo, useState } from "react";

interface ProjectContractsTabProps {
  projectId: number;
  contracts: ContractItem[];
  isView?: boolean;
  onRefresh: () => void;
}

export default function ProjectContractsTab({
  projectId,
  contracts,
  isView = false,
  onRefresh,
}: ProjectContractsTabProps) {
  const { showDialog, hideDialog } = useDialog();

  // Contract dialog states
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractItem | null>(null);
  const [contractNumber, setContractNumber] = useState("");
  const [contractName, setContractName] = useState("");
  const [contractType, setContractType] = useState<ContractType>("MAIN");
  const [contractStatus, setContractStatus] = useState<ContractStatus>("SIGNED");
  const [signDate, setSignDate] = useState(moment().format("YYYY-MM-DD"));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [valueBeforeTax, setValueBeforeTax] = useState<number | string>("");
  const [vatPercent, setVatPercent] = useState<number | string>(10);
  const [advanceAmount, setAdvanceAmount] = useState<number | string>("");
  const [warrantyMonths, setWarrantyMonths] = useState<number | string>(12);
  const [warrantyPercent, setWarrantyPercent] = useState<number | string>(5);
  const [terms, setTerms] = useState("");
  const [note, setNote] = useState("");
  const [submittingContract, setSubmittingContract] = useState(false);

  // Addendum dialog states
  const [addendumDialogOpen, setAddendumDialogOpen] = useState(false);
  const [targetContract, setTargetContract] = useState<ContractItem | null>(null);
  const [editingAddendum, setEditingAddendum] = useState<ContractAddendumItem | null>(null);
  const [addendumNumber, setAddendumNumber] = useState("");
  const [addendumName, setAddendumName] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<AddendumAdjustmentType>("INCREASE");
  const [addendumSignDate, setAddendumSignDate] = useState(moment().format("YYYY-MM-DD"));
  const [effectiveDate, setEffectiveDate] = useState(moment().format("YYYY-MM-DD"));
  const [adjustedDays, setAdjustedDays] = useState<number | string>(0);
  const [newEndDate, setNewEndDate] = useState("");
  const [addendumValueBeforeTax, setAddendumValueBeforeTax] = useState<number | string>("");
  const [addendumVatPercent, setAddendumVatPercent] = useState<number | string>(10);
  const [addendumReason, setAddendumReason] = useState("");
  const [addendumContent, setAddendumContent] = useState("");
  const [submittingAddendum, setSubmittingAddendum] = useState(false);

  // Calculate live values for contract
  const calculatedContractValAfter = useMemo(() => {
    const vBefore = Number(valueBeforeTax) || 0;
    const vVatPct = Number(vatPercent) || 0;
    return vBefore + (vBefore * vVatPct) / 100;
  }, [valueBeforeTax, vatPercent]);

  // Calculate live values for addendum
  const calculatedAddendumValAfter = useMemo(() => {
    const vBefore = Number(addendumValueBeforeTax) || 0;
    const vVatPct = Number(addendumVatPercent) || 0;
    return vBefore + (vBefore * vVatPct) / 100;
  }, [addendumValueBeforeTax, addendumVatPercent]);

  // Contract dialog handlers
  const handleOpenAddContract = () => {
    setEditingContract(null);
    setContractNumber(`HD-${projectId}-${moment().format("YYMM")}`);
    setContractName("Hợp đồng thi công xây dựng");
    setContractType("MAIN");
    setContractStatus("SIGNED");
    setSignDate(moment().format("YYYY-MM-DD"));
    setStartDate(moment().format("YYYY-MM-DD"));
    setEndDate(moment().add(6, "months").format("YYYY-MM-DD"));
    setValueBeforeTax("");
    setVatPercent(10);
    setAdvanceAmount("");
    setWarrantyMonths(12);
    setWarrantyPercent(5);
    setTerms("");
    setNote("");
    setContractDialogOpen(true);
  };

  const handleOpenEditContract = (c: ContractItem) => {
    setEditingContract(c);
    setContractNumber(c.contractNumber);
    setContractName(c.name);
    setContractType(c.contractType);
    setContractStatus(c.status);
    setSignDate(c.signDate || "");
    setStartDate(c.startDate || "");
    setEndDate(c.endDate || "");
    setValueBeforeTax(c.valueBeforeTax ?? "");
    setVatPercent(c.vatPercent ?? 10);
    setAdvanceAmount(c.advanceAmount ?? "");
    setWarrantyMonths(c.warrantyMonths ?? 12);
    setWarrantyPercent(c.warrantyPercent ?? 5);
    setTerms(c.terms || "");
    setNote(c.note || "");
    setContractDialogOpen(true);
  };

  const handleSaveContract = async () => {
    if (!contractNumber.trim()) {
      toastError("Vui lòng nhập Số hợp đồng");
      return;
    }
    if (!contractName.trim()) {
      toastError("Vui lòng nhập Tên hợp đồng");
      return;
    }
    setSubmittingContract(true);
    try {
      const payload: ContractItem = {
        projectId,
        contractNumber: contractNumber.trim(),
        name: contractName.trim(),
        contractType,
        status: contractStatus,
        signDate: signDate || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        valueBeforeTax: Number(valueBeforeTax) || 0,
        vatPercent: Number(vatPercent) || 0,
        advanceAmount: advanceAmount ? Number(advanceAmount) : 0,
        warrantyMonths: warrantyMonths ? Number(warrantyMonths) : 12,
        warrantyPercent: warrantyPercent ? Number(warrantyPercent) : 5,
        terms: terms.trim() || undefined,
        note: note.trim() || undefined,
      };

      if (editingContract?.id) {
        await updateContract(projectId, editingContract.id, payload);
        toastSuccess("Cập nhật hợp đồng thành công");
      } else {
        await createContract(projectId, payload);
        toastSuccess("Tạo mới hợp đồng thành công");
      }
      setContractDialogOpen(false);
      onRefresh();
    } catch (err: any) {
      toastError(err?.message || "Không thể lưu hợp đồng");
    } finally {
      setSubmittingContract(false);
    }
  };

  const handleDeleteContract = (item: ContractItem) => {
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle sx={{ fontWeight: 700 }}>Xóa hợp đồng</DialogTitle>
        <DialogContent>
          Bạn có chắc muốn xóa hợp đồng &quot;{item.contractNumber} - {item.name}&quot; cùng tất cả các phụ lục đi kèm?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <CoreButton theme="cancel" onClick={hideDialog}>
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={async () => {
              hideDialog();
              try {
                if (item.id) {
                  await deleteContract(projectId, item.id);
                  toastSuccess("Đã xóa hợp đồng thành công");
                  onRefresh();
                }
              } catch (err: any) {
                toastError(err?.message || "Không thể xóa hợp đồng");
              }
            }}
          >
            Đồng ý xóa
          </CoreButton>
        </DialogActions>
      </Dialog>
    );
  };

  // Addendum dialog handlers
  const handleOpenAddAddendum = (c: ContractItem) => {
    setTargetContract(c);
    setEditingAddendum(null);
    const existingCount = c.addendums?.length || 0;
    setAddendumNumber(`PL-${c.contractNumber}-${existingCount + 1}`);
    setAddendumName(`Phụ lục số 0${existingCount + 1} - Bổ sung khối lượng`);
    setAdjustmentType("INCREASE");
    setAddendumSignDate(moment().format("YYYY-MM-DD"));
    setEffectiveDate(moment().format("YYYY-MM-DD"));
    setAdjustedDays(0);
    setNewEndDate(c.endDate || "");
    setAddendumValueBeforeTax("");
    setAddendumVatPercent(10);
    setAddendumReason("");
    setAddendumContent("");
    setAddendumDialogOpen(true);
  };

  const handleOpenEditAddendum = (c: ContractItem, a: ContractAddendumItem) => {
    setTargetContract(c);
    setEditingAddendum(a);
    setAddendumNumber(a.addendumNumber);
    setAddendumName(a.name);
    setAdjustmentType(a.adjustmentType);
    setAddendumSignDate(a.signDate || "");
    setEffectiveDate(a.effectiveDate || "");
    setAdjustedDays(a.adjustedDays ?? 0);
    setNewEndDate(a.newEndDate || "");
    setAddendumValueBeforeTax(a.valueBeforeTax ?? "");
    setAddendumVatPercent(a.vatPercent ?? 10);
    setAddendumReason(a.reason || "");
    setAddendumContent(a.content || "");
    setAddendumDialogOpen(true);
  };

  const handleSaveAddendum = async () => {
    if (!targetContract?.id) return;
    if (!addendumNumber.trim()) {
      toastError("Vui lòng nhập Số phụ lục");
      return;
    }
    if (!addendumName.trim()) {
      toastError("Vui lòng nhập Tên phụ lục");
      return;
    }
    setSubmittingAddendum(true);
    try {
      const payload: ContractAddendumItem = {
        contractId: targetContract.id,
        projectId,
        addendumNumber: addendumNumber.trim(),
        name: addendumName.trim(),
        adjustmentType,
        signDate: addendumSignDate || undefined,
        effectiveDate: effectiveDate || undefined,
        adjustedDays: adjustedDays ? Number(adjustedDays) : 0,
        newEndDate: newEndDate || undefined,
        valueBeforeTax: Number(addendumValueBeforeTax) || 0,
        vatPercent: Number(addendumVatPercent) || 0,
        reason: addendumReason.trim() || undefined,
        content: addendumContent.trim() || undefined,
      };

      if (editingAddendum?.id) {
        await updateContractAddendum(projectId, targetContract.id, editingAddendum.id, payload);
        toastSuccess("Cập nhật phụ lục hợp đồng thành công");
      } else {
        await addContractAddendum(projectId, targetContract.id, payload);
        toastSuccess("Thêm phụ lục hợp đồng thành công");
      }
      setAddendumDialogOpen(false);
      onRefresh();
    } catch (err: any) {
      toastError(err?.message || "Không thể lưu phụ lục hợp đồng");
    } finally {
      setSubmittingAddendum(false);
    }
  };

  const handleDeleteAddendum = (contractId: number, addendumId: number) => {
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle sx={{ fontWeight: 700 }}>Xóa phụ lục hợp đồng</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa phụ lục hợp đồng này?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <CoreButton theme="cancel" onClick={hideDialog}>
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={async () => {
              hideDialog();
              try {
                await deleteContractAddendum(projectId, contractId, addendumId);
                toastSuccess("Đã xóa phụ lục thành công");
                onRefresh();
              } catch (err: any) {
                toastError(err?.message || "Không thể xóa phụ lục");
              }
            }}
          >
            Đồng ý xóa
          </CoreButton>
        </DialogActions>
      </Dialog>
    );
  };

  // Summaries
  const totalBaseValue = contracts.reduce((acc, c) => acc + (c.valueAfterTax || 0), 0);
  const totalAdjustedValue = contracts.reduce((acc, c) => acc + (c.totalAdjustedValue || c.valueAfterTax || 0), 0);
  const totalAddendumCount = contracts.reduce((acc, c) => acc + (c.addendums?.length || 0), 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Banner giới thiệu mục 2.11 */}
      <Alert severity="success" sx={{ borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Mục 2.11: Quản trị Hợp đồng & Phụ lục điều chỉnh phát sinh (Tăng / Giảm / Tiến độ)
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Hệ thống cho phép quản lý chi tiết từng hợp đồng (HĐ chính, tư vấn thiết kế, thầu phụ), điều khoản VAT, tiền tạm ứng, bảo hành và theo dõi minh bạch các phụ lục phát sinh tăng giảm chi phí hoặc gia hạn ngày kết thúc dự án.
        </Typography>
      </Alert>

      {/* Thống kê tài chính hợp đồng */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#f8fafc" }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Số lượng hợp đồng
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#0284c7" }}>
                {contracts.length} hợp đồng
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#f0fdf4" }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Giá trị hợp đồng gốc (sau thuế)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#16a34a" }}>
                {formatVnd(totalBaseValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#fffbeb" }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Tổng giá trị sau phụ lục (+/-)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#d97706" }}>
                {formatVnd(totalAdjustedValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          {!isView && (
            <CoreButton
              theme="submit"
              onClick={handleOpenAddContract}
              sx={{ px: 2.5, py: 1, height: 40, borderRadius: 2 }}
            >
              <PostAddOutlinedIcon sx={{ mr: 1, fontSize: 18 }} />
              Thêm hợp đồng mới
            </CoreButton>
          )}
        </Grid>
      </Grid>

      {/* Danh sách các hợp đồng */}
      {contracts.length === 0 ? (
        <Card variant="outlined" sx={{ borderRadius: 2, p: 4, textAlign: "center" }}>
          <AssignmentOutlinedIcon sx={{ fontSize: 44, color: "#94a3b8", mb: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Dự án chưa có hồ sơ hợp đồng nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Nhấn &quot;Thêm hợp đồng mới&quot; để thiết lập hợp đồng thi công chính hoặc hợp đồng tư vấn.
          </Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {contracts.map((contract, cIdx) => {
            const addendums = contract.addendums || [];
            const hasAddendums = addendums.length > 0;
            return (
              <Accordion
                key={contract.id || cIdx}
                defaultExpanded={cIdx === 0}
                variant="outlined"
                sx={{ borderRadius: "8px !important", overflow: "hidden", "&:before": { display: "none" } }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ bgcolor: "#f8fafc", px: 2.5, py: 1 }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%", pr: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Chip
                        label={contract.contractType === "MAIN" ? "Hợp đồng chính" : "Hợp đồng phụ"}
                        color={contract.contractType === "MAIN" ? "primary" : "default"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {contract.contractNumber} - {contract.name}
                      </Typography>
                      <Chip
                        label={contract.statusLabel || contract.status}
                        color={contract.status === "SIGNED" ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" color="text.secondary">
                          Giá trị sau phụ lục:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#b45309" }}>
                          {formatVnd(contract.totalAdjustedValue || contract.valueAfterTax || 0)}
                        </Typography>
                      </Box>
                      {!isView && (
                        <Stack direction="row" spacing={0.5} onClick={(e) => e.stopPropagation()}>
                          <Tooltip title="Thêm phụ lục hợp đồng">
                            <IconButton size="small" color="primary" onClick={() => handleOpenAddAddendum(contract)}>
                              <NoteAddOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sửa hợp đồng">
                            <IconButton size="small" onClick={() => handleOpenEditContract(contract)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa hợp đồng">
                            <IconButton size="small" color="error" onClick={() => handleDeleteContract(contract)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 2.5 }}>
                  {/* Chi tiết điều khoản hợp đồng */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Giá trị trước thuế (VAT):
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatVnd(contract.valueBeforeTax || 0)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Thuế VAT ({contract.vatPercent ?? 10}%):
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatVnd(contract.vatAmount || 0)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Tạm ứng hợp đồng:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#0284c7" }}>
                        {formatVnd(contract.advanceAmount || 0)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Thời hạn bảo hành:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {contract.warrantyMonths || 12} tháng ({contract.warrantyPercent || 5}% - {formatVnd(contract.warrantyAmount || 0)})
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Ngày ký kết:
                      </Typography>
                      <Typography variant="body2">
                        {contract.signDate ? moment(contract.signDate).format("DD/MM/YYYY") : "--"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Ngày bắt đầu / Ngày bàn giao:
                      </Typography>
                      <Typography variant="body2">
                        {contract.startDate ? moment(contract.startDate).format("DD/MM/YYYY") : "--"} →{" "}
                        {contract.endDate ? moment(contract.endDate).format("DD/MM/YYYY") : "--"}
                      </Typography>
                    </Grid>
                    {contract.terms && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Điều khoản chính:
                        </Typography>
                        <Typography variant="body2" sx={{ bgcolor: "#f8fafc", p: 1, borderRadius: 1 }}>
                          {contract.terms}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  {/* Bảng các Phụ Lục Hợp Đồng Đi Kèm */}
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#334155" }}>
                      Danh sách Phụ lục hợp đồng ({addendums.length})
                    </Typography>
                    {!isView && (
                      <CoreButton
                        theme="draft"
                        onClick={() => handleOpenAddAddendum(contract)}
                        sx={{ height: 30, fontSize: 12, px: 1.5 }}
                      >
                        <AddIcon sx={{ mr: 0.5, fontSize: 16 }} />
                        Thêm phụ lục phát sinh
                      </CoreButton>
                    )}
                  </Stack>

                  <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 1.5 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#f1f5f9" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, width: 50 }}>STT</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Số phụ lục / Tên</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Loại điều chỉnh</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Giá trị phát sinh (+/-)</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Ngày ký / Hiệu lực</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Gia hạn tiến độ</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Lý do phát sinh</TableCell>
                          {!isView && (
                            <TableCell align="center" sx={{ fontWeight: 700, width: 90 }}>
                              Thao tác
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!hasAddendums ? (
                          <TableRow>
                            <TableCell colSpan={isView ? 7 : 8} align="center" sx={{ py: 2.5, color: "text.secondary" }}>
                              Chưa có phụ lục phát sinh nào cho hợp đồng này.
                            </TableCell>
                          </TableRow>
                        ) : (
                          addendums.map((addendum, aIdx) => {
                            const adjOpt = ADDENDUM_ADJUSTMENT_TYPE_OPTIONS.find((o) => o.value === addendum.adjustmentType);
                            const isIncrease = addendum.adjustmentType === "INCREASE";
                            const isDecrease = addendum.adjustmentType === "DECREASE";
                            return (
                              <TableRow key={addendum.id || aIdx} hover>
                                <TableCell>{aIdx + 1}</TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {addendum.addendumNumber}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {addendum.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={adjOpt?.label || addendum.adjustmentType}
                                    color={adjOpt?.color || "default"}
                                    size="small"
                                    sx={{ fontWeight: 500 }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 700,
                                      color: isIncrease ? "#16a34a" : isDecrease ? "#dc2626" : "inherit",
                                    }}
                                  >
                                    {isIncrease ? "+ " : isDecrease ? "- " : ""}
                                    {formatVnd(addendum.valueAfterTax || 0)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" display="block">
                                    Ký: {addendum.signDate ? moment(addendum.signDate).format("DD/MM/YYYY") : "--"}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    HL: {addendum.effectiveDate ? moment(addendum.effectiveDate).format("DD/MM/YYYY") : "--"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {addendum.adjustedDays && addendum.adjustedDays > 0 ? (
                                    <Box>
                                      <Typography variant="caption" sx={{ fontWeight: 600, color: "#0284c7" }}>
                                        +{addendum.adjustedDays} ngày
                                      </Typography>
                                      {addendum.newEndDate && (
                                        <Typography variant="caption" display="block" color="text.secondary">
                                          → {moment(addendum.newEndDate).format("DD/MM/YYYY")}
                                        </Typography>
                                      )}
                                    </Box>
                                  ) : (
                                    "--"
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" color="text.secondary">
                                    {addendum.reason || "--"}
                                  </Typography>
                                </TableCell>
                                {!isView && (
                                  <TableCell align="center">
                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                      <Tooltip title="Sửa phụ lục">
                                        <IconButton size="small" onClick={() => handleOpenEditAddendum(contract, addendum)}>
                                          <EditOutlinedIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Xóa phụ lục">
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => contract.id && addendum.id && handleDeleteAddendum(contract.id, addendum.id)}
                                        >
                                          <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Stack>
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      )}

      {/* Modal Thêm/Sửa Hợp Đồng */}
      <Dialog open={contractDialogOpen} onClose={() => setContractDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingContract ? "Chỉnh sửa hợp đồng" : "Thêm mới hợp đồng dự án"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số hợp đồng *"
                size="small"
                fullWidth
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên hợp đồng *"
                size="small"
                fullWidth
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Loại hợp đồng</InputLabel>
                <Select
                  value={contractType}
                  label="Loại hợp đồng"
                  onChange={(e) => setContractType(e.target.value as ContractType)}
                >
                  {CONTRACT_TYPE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={contractStatus}
                  label="Trạng thái"
                  onChange={(e) => setContractStatus(e.target.value as ContractStatus)}
                >
                  {CONTRACT_STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Giá trị trước VAT (VNĐ) *"
                type="number"
                size="small"
                fullWidth
                value={valueBeforeTax}
                onChange={(e) => setValueBeforeTax(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Thuế suất VAT (%)"
                type="number"
                size="small"
                fullWidth
                value={vatPercent}
                onChange={(e) => setVatPercent(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Giá trị sau thuế (VAT)"
                size="small"
                fullWidth
                disabled
                value={formatVnd(calculatedContractValAfter)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Tạm ứng ban đầu (VNĐ)"
                type="number"
                size="small"
                fullWidth
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Thời gian bảo hành (tháng)"
                type="number"
                size="small"
                fullWidth
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Tỷ lệ giữ lại bảo hành (%)"
                type="number"
                size="small"
                fullWidth
                value={warrantyPercent}
                onChange={(e) => setWarrantyPercent(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Ngày ký hợp đồng"
                type="date"
                size="small"
                fullWidth
                value={signDate}
                onChange={(e) => setSignDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Ngày bắt đầu hiệu lực"
                type="date"
                size="small"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Ngày dự kiến hoàn thành"
                type="date"
                size="small"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Điều khoản chính / Ghi chú hợp đồng"
                multiline
                rows={3}
                size="small"
                fullWidth
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <CoreButton theme="cancel" onClick={() => setContractDialogOpen(false)} disabled={submittingContract}>
            Hủy
          </CoreButton>
          <CoreButton theme="submit" onClick={handleSaveContract} loading={submittingContract}>
            Lưu hợp đồng
          </CoreButton>
        </DialogActions>
      </Dialog>

      {/* Modal Thêm/Sửa Phụ Lục Hợp Đồng */}
      <Dialog open={addendumDialogOpen} onClose={() => setAddendumDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingAddendum ? "Chỉnh sửa phụ lục hợp đồng" : `Thêm phụ lục phát sinh cho HĐ ${targetContract?.contractNumber}`}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số phụ lục hợp đồng *"
                size="small"
                fullWidth
                value={addendumNumber}
                onChange={(e) => setAddendumNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên phụ lục điều chỉnh *"
                size="small"
                fullWidth
                value={addendumName}
                onChange={(e) => setAddendumName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Loại điều chỉnh phát sinh *</InputLabel>
                <Select
                  value={adjustmentType}
                  label="Loại điều chỉnh phát sinh *"
                  onChange={(e) => setAdjustmentType(e.target.value as AddendumAdjustmentType)}
                >
                  {ADDENDUM_ADJUSTMENT_TYPE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày ký phụ lục"
                type="date"
                size="small"
                fullWidth
                value={addendumSignDate}
                onChange={(e) => setAddendumSignDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Giá trị phát sinh trước VAT (VNĐ)"
                type="number"
                size="small"
                fullWidth
                value={addendumValueBeforeTax}
                onChange={(e) => setAddendumValueBeforeTax(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="VAT (%)"
                type="number"
                size="small"
                fullWidth
                value={addendumVatPercent}
                onChange={(e) => setAddendumVatPercent(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Tổng giá trị phát sinh sau VAT"
                size="small"
                fullWidth
                disabled
                value={formatVnd(calculatedAddendumValAfter)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Số ngày gia hạn tiến độ (+ ngày)"
                type="number"
                size="small"
                fullWidth
                value={adjustedDays}
                onChange={(e) => setAdjustedDays(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày kết thúc mới (nếu gia hạn)"
                type="date"
                size="small"
                fullWidth
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Lý do điều chỉnh / Nội dung phát sinh *"
                multiline
                rows={3}
                size="small"
                fullWidth
                placeholder="Nêu rõ lý do phát sinh tăng/giảm khối lượng hoặc nguyên nhân điều chỉnh tiến độ..."
                value={addendumReason}
                onChange={(e) => setAddendumReason(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <CoreButton theme="cancel" onClick={() => setAddendumDialogOpen(false)} disabled={submittingAddendum}>
            Hủy
          </CoreButton>
          <CoreButton theme="submit" onClick={handleSaveAddendum} loading={submittingAddendum}>
            Lưu phụ lục
          </CoreButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
