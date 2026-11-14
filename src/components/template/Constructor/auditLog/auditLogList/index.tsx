import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { CoreTable } from "@/components/organism/CoreTable";
import CoreLoading from "@/components/molecules/CoreLoading";
import useAuditLogList, {
  formatDateTime,
  safeParseJson,
} from "./useAuditLogList";

export default function AuditLogList() {
  const [value, handle] = useAuditLogList();
  const {
    control,
    columns,
    tableData,
    isLoading,
    page,
    size,
    totalPages,
    selectedId,
    activeDetail,
    isDetailLoading,
    moduleOptions,
    actionOptions,
  } = value;

  const { onSubmit, onReset, onChangePageSize, openDetail, closeDetail } =
    handle;

  const oldObj = safeParseJson(activeDetail?.oldValue);
  const newObj = safeParseJson(activeDetail?.newValue);
  const diffKeys = Array.from(
    new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})])
  );

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs
            breadcrumbs={[{ title: "Nhật ký hoạt động hệ thống (Audit Log)" }]}
          />
        }
      >
        <form className="flex flex-col py-6" onSubmit={onSubmit}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <CoreInputCustom
                control={control}
                name="search"
                label="Từ khóa"
                placeholder="Người thực hiện, mô tả, mã đối tượng..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <CoreAutocomplete
                options={moduleOptions}
                control={control}
                name="module"
                label="Phân hệ"
                placeholder="Tất cả phân hệ"
                valuePath="value"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <CoreAutocomplete
                options={actionOptions}
                control={control}
                name="action"
                label="Hành động"
                placeholder="Tất cả hành động"
                valuePath="value"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <CoreInputCustom
                control={control}
                name="fromDate"
                type="date"
                label="Từ ngày"
                placeholder="YYYY-MM-DD"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <CoreInputCustom
                control={control}
                name="toDate"
                type="date"
                label="Đến ngày"
                placeholder="YYYY-MM-DD"
              />
            </Grid>

            <Grid item xs={12}>
              <div className="pt-2 flex justify-end gap-3 items-center">
                <CoreButton onClick={onReset} theme="cancel">
                  Làm mới
                </CoreButton>
                <CoreButton theme="submit" type="submit">
                  Tra cứu
                </CoreButton>
              </div>
            </Grid>
          </Grid>
        </form>

        <CoreTable
          tableName="audit-log-table"
          columns={columns}
          data={tableData}
          page={page}
          size={size}
          totalPages={totalPages}
          isLoading={isLoading}
          isShowColumnStt
          onChangePageSize={onChangePageSize}
          onRowClick={(id: number, row?: any) => openDetail(id, row)}
        />

        {/* Modal chi tiết Audit Log (giá trị trước / sau) */}
        <Dialog
          open={Boolean(selectedId)}
          onClose={closeDetail}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Chi tiết nhật ký hoạt động #{activeDetail?.id}
          </DialogTitle>
          <DialogContent dividers>
            {isDetailLoading && !activeDetail ? (
              <CoreLoading />
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Người thực hiện
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {activeDetail?.username || "system"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Thời gian
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatDateTime(activeDetail?.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Hành động / Phân hệ
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {activeDetail?.action} — {activeDetail?.module}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Đối tượng
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {activeDetail?.entityName || "—"}
                      {activeDetail?.entityId
                        ? ` (#${activeDetail.entityId})`
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Địa chỉ IP
                    </Typography>
                    <Typography variant="body2">
                      {activeDetail?.ipAddress || "—"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Mô tả
                    </Typography>
                    <Typography variant="body2">
                      {activeDetail?.description || "—"}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider />

                {diffKeys.length > 0 ? (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 700 }}
                    >
                      So sánh dữ liệu Trước & Sau thay đổi
                    </Typography>
                    <Table size="small" sx={{ border: "1px solid #e5e7eb" }}>
                      <TableHead sx={{ bgcolor: "#f3f4f6" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, width: "26%" }}>
                            Trường dữ liệu
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, width: "37%" }}>
                            Giá trị trước
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, width: "37%" }}>
                            Giá trị sau
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {diffKeys.map((key) => {
                          const beforeVal =
                            oldObj && key in oldObj
                              ? JSON.stringify(oldObj[key])
                              : "—";
                          const afterVal =
                            newObj && key in newObj
                              ? JSON.stringify(newObj[key])
                              : "—";
                          const changed = beforeVal !== afterVal;
                          return (
                            <TableRow
                              key={key}
                              sx={{
                                bgcolor: changed ? "#fffbeb" : "inherit",
                              }}
                            >
                              <TableCell sx={{ fontFamily: "monospace" }}>
                                {key}{" "}
                                {changed && (
                                  <Chip
                                    label="Thay đổi"
                                    size="small"
                                    color="warning"
                                    sx={{ height: 18, fontSize: 10, ml: 0.5 }}
                                  />
                                )}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "monospace",
                                  fontSize: 12,
                                  wordBreak: "break-all",
                                  color: changed ? "#b91c1c" : "text.secondary",
                                }}
                              >
                                {beforeVal}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "monospace",
                                  fontSize: 12,
                                  wordBreak: "break-all",
                                  color: changed ? "#15803d" : "text.secondary",
                                }}
                              >
                                {afterVal}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Giá trị trước
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          bgcolor: "#f9fafb",
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid #e5e7eb",
                          fontSize: 12,
                          overflowX: "auto",
                        }}
                      >
                        {activeDetail?.oldValue || "Không có dữ liệu"}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Giá trị sau
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          bgcolor: "#f9fafb",
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid #e5e7eb",
                          fontSize: 12,
                          overflowX: "auto",
                        }}
                      >
                        {activeDetail?.newValue || "Không có dữ liệu"}
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <CoreButton theme="submit" onClick={closeDetail}>
              Đóng
            </CoreButton>
          </DialogActions>
        </Dialog>
      </PageContainer>
    </Grid>
  );
}
