import steel from "@/assets/png/steel.png";
import Can from "@/components/atoms/Can";
import CoreLoading from "@/components/molecules/CoreLoading";
import { PERMISSIONS } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import { SteelProjectOutput } from "@/service/constructor/SteelProject/type";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import router from "next/router";

interface ProjectCardListProps {
  items: SteelProjectOutput[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
}

export default function ProjectCardList({
  items,
  isLoading,
  onDelete,
}: ProjectCardListProps) {
  if (isLoading) {
    return (
      <Box className="py-12 flex justify-center">
        <CoreLoading />
      </Box>
    );
  }

  if (!items.length) {
    return (
      <Box className="py-12 text-center">
        <Typography variant="body1" color="text.secondary">
          Chưa có bảng thống kê thép nào. Nhấn &quot;Thêm mới&quot; để tạo bảng
          thống kê thép đầu tiên.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
      {items.map((item) => {
        const totalWeightKg = Number(item.totalWeight ?? 0);
        const totalLengthM = Number(item.totalLength ?? 0);
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <Box
                className="flex flex-col items-center pt-4 px-4 cursor-pointer"
                onClick={() =>
                  router.push({
                    pathname: `${ROUTES.STEELSTATISTICS}/${item.id}`,
                    query: { actionType: "VIEW" },
                  })
                }
              >
                <Image src={steel} alt="steel" width={140} height={140} />
              </Box>
              <CardContent sx={{ flex: 1, pb: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Chip
                    label={item.code}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                  {item.projectCode && (
                    <Chip
                      label={`DA: ${item.projectCode}`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Stack>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  className="line-clamp-2 cursor-pointer"
                  onClick={() =>
                    router.push({
                      pathname: `${ROUTES.STEELSTATISTICS}/${item.id}`,
                      query: { actionType: "VIEW" },
                    })
                  }
                >
                  {item.name}
                </Typography>
                {item.projectName && (
                  <Typography
                    variant="caption"
                    color="primary.main"
                    display="block"
                    sx={{ mt: 0.5 }}
                  >
                    Dự án chính: {item.projectName}
                  </Typography>
                )}
                {item.owner && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Chủ đầu tư: {item.owner}
                  </Typography>
                )}
                <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Cấu kiện
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {item.assemblyCount ?? 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Tổng dài
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {totalLengthM.toLocaleString("vi-VN", {
                        maximumFractionDigits: 2,
                      })}{" "}
                      m
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Tổng khối lượng
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="warning.dark"
                    >
                      {totalWeightKg.toLocaleString("vi-VN", {
                        maximumFractionDigits: 2,
                      })}{" "}
                      kg
                    </Typography>
                  </Box>
                </Stack>
                {(item.signDate || item.deliveryDate) && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 1 }}
                  >
                    {item.signDate
                      ? `Ký: ${moment(item.signDate).format("DD/MM/YYYY")}`
                      : ""}
                    {item.signDate && item.deliveryDate ? " • " : ""}
                    {item.deliveryDate
                      ? `Giao: ${moment(item.deliveryDate).format("DD/MM/YYYY")}`
                      : ""}
                  </Typography>
                )}
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: "flex-end", px: 1.5, py: 0.5 }}>
                <Tooltip title="Xem chi tiết">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() =>
                      router.push({
                        pathname: `${ROUTES.STEELSTATISTICS}/${item.id}`,
                        query: { actionType: "VIEW" },
                      })
                    }
                  >
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Can
                  permission={[
                    PERMISSIONS.MATERIAL_MANAGE,
                    PERMISSIONS.PROJECT_UPDATE,
                  ]}
                >
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() =>
                        router.push({
                          pathname: `${ROUTES.STEELSTATISTICS}/${item.id}`,
                          query: { actionType: "EDIT" },
                        })
                      }
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Xác nhận xóa bảng thống kê thép "${item.name}"?`
                          )
                        ) {
                          onDelete?.(item.id);
                        }
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Can>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
