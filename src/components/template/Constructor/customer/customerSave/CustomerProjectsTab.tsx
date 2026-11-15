import {
  Box,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TimelineIcon from "@mui/icons-material/Timeline";
import { CoreButton } from "@/components/atoms/CoreButton";
import { CustomerProjectItem } from "@/service/constructor/Customer/getList/type";
import { ROUTES } from "@/routes";
import moment from "moment";
import router from "next/router";
import { useMemo } from "react";
import { formatVnd, PROJECT_STATE_META } from "../constants";

type Props = {
  customerId: number;
  projects: CustomerProjectItem[];
  canCreateProject: boolean;
};

export default function CustomerProjectsTab({
  customerId,
  projects,
  canCreateProject,
}: Props) {
  const summary = useMemo(() => {
    let totalValue = 0;
    let totalAdvance = 0;
    let totalRemaining = 0;
    for (const p of projects) {
      totalValue += Number(p.contractValue ?? 0);
      totalAdvance += Number(p.contractAdvance ?? 0);
      totalRemaining += Number(p.remainingAmount ?? 0);
    }
    return {
      count: projects.length,
      totalValue,
      totalAdvance,
      totalRemaining,
    };
  }, [projects]);

  return (
    <Box className="py-4">
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                SỐ DỰ ÁN LIÊN KẾT
              </Typography>
              <AccountTreeOutlinedIcon color="primary" fontSize="small" />
            </Stack>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {summary.count}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                TỔNG GIÁ TRỊ HỢP ĐỒNG
              </Typography>
              <PaidOutlinedIcon color="info" fontSize="small" />
            </Stack>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
              {formatVnd(summary.totalValue)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              ĐÃ TẠM ỨNG
            </Typography>
            <Typography
              variant="h6"
              fontWeight={700}
              color="success.main"
              sx={{ mt: 1 }}
            >
              {formatVnd(summary.totalAdvance)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              CÒN PHẢI THU
            </Typography>
            <Typography
              variant="h6"
              fontWeight={700}
              color={summary.totalRemaining > 0 ? "warning.main" : "text.primary"}
              sx={{ mt: 1 }}
            >
              {formatVnd(summary.totalRemaining)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Danh sách công trình / dự án của khách hàng ({projects.length})
        </Typography>

        {canCreateProject && (
          <CoreButton
            theme="submit"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() =>
              router.push({
                pathname: `${ROUTES.PROJECT}/addNew`,
                query: { customerId },
              })
            }
          >
            Tạo dự án cho khách hàng này
          </CoreButton>
        )}
      </Stack>

      {projects.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            color: "text.secondary",
            bgcolor: "#fafafa",
            borderRadius: 2,
          }}
        >
          Khách hàng này hiện chưa có dự án xây dựng nào liên kết.
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          <Table size="small">
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã DA</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên công trình</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Chủ nhiệm DA</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày ký HĐ</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Giá trị HĐ</TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 130 }}>
                  Tiến độ
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((proj) => {
                const stateMeta = PROJECT_STATE_META[proj.state || ""] || {
                  label: proj.state || "Chưa bắt đầu",
                  color: "default" as const,
                };
                const pct = Math.min(
                  100,
                  Math.max(0, Number(proj.progressPercent ?? 0))
                );
                return (
                  <TableRow key={proj.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{proj.code}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {proj.name}
                      </Typography>
                      {proj.address && (
                        <Typography variant="caption" color="text.secondary">
                          {proj.address}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{proj.manager?.name || "—"}</TableCell>
                    <TableCell>
                      {proj.signDate
                        ? moment(proj.signDate).format("DD/MM/YYYY")
                        : "—"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {formatVnd(proj.contractValue)}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" fontWeight={600}>
                          {pct.toFixed(0)}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={stateMeta.color}
                        label={stateMeta.label}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Xem chi tiết dự án">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            router.push({
                              pathname: `${ROUTES.PROJECT}/${proj.id}`,
                              query: { actionType: "VIEW" },
                            })
                          }
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xem tiến độ dự án">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() =>
                            router.push({
                              pathname: `${ROUTES.PROGRESS_PROJECT}/${proj.id}`,
                              query: { actionType: "VIEW" },
                            })
                          }
                        >
                          <TimelineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
