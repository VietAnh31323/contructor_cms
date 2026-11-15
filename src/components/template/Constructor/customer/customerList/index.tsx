import {
  Box,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { CoreTable } from "@/components/organism/CoreTable";
import CoreLoading from "@/components/molecules/CoreLoading";
import Can from "@/components/atoms/Can";
import { PERMISSIONS } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import { CustomerPipelineStage } from "@/service/constructor/Customer/getList/type";
import router from "next/router";
import {
  CONTACT_STATUS_OPTIONS,
  CUSTOMER_TYPE_OPTIONS,
  formatVnd,
  PIPELINE_STAGE_META,
  PIPELINE_STAGE_OPTIONS,
} from "../constants";
import useCustomerList, { CustomerViewMode } from "./useCustomerList";

const KANBAN_STAGES: CustomerPipelineStage[] = [
  "LEAD",
  "QUOTED",
  "CONTRACT_SIGNED",
  "IN_CONSTRUCTION",
  "WARRANTY",
  "LOST",
];

export default function CustomerList() {
  const [value, handle] = useCustomerList();
  const {
    columns,
    tableData,
    rawCustomers,
    pipelineSummary,
    activeStageFilter,
    viewMode,
    page,
    size,
    totalPages,
    isLoading,
    control,
    canManageCustomer,
  } = value;

  const {
    setViewMode,
    onSubmit,
    onReset,
    onSelectStageFilter,
    onChangePageSize,
    handleQuickChangeStage,
    handleKanbanDragEnd,
  } = handle;

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
          <CoreBreadcrumbs breadcrumbs={[{ title: "Quản lý khách hàng" }]} />
        }
      >
        {/* ================= 2.08: THANH TỔNG QUAN PIPELINE KHÁCH HÀNG ================= */}
        {pipelineSummary && (
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={1.5}>
              <Grid item xs={6} sm={4} md={2}>
                <Paper
                  variant="outlined"
                  onClick={() => onSelectStageFilter("")}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    cursor: "pointer",
                    borderWidth: activeStageFilter === "" ? 2 : 1,
                    borderColor:
                      activeStageFilter === "" ? "primary.main" : "divider",
                    bgcolor: activeStageFilter === "" ? "#f0f7ff" : "#fff",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    TẤT CẢ KHÁCH HÀNG
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {pipelineSummary.totalCustomers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    CN: {pipelineSummary.individualCustomers} • DN:{" "}
                    {pipelineSummary.businessCustomers}
                  </Typography>
                </Paper>
              </Grid>

              {(pipelineSummary.stages || [])
                .filter((st) => st.stage !== "LOST")
                .map((st) => {
                  const meta = PIPELINE_STAGE_META[st.stage];
                  const selected = activeStageFilter === st.stage;
                  return (
                    <Grid item xs={6} sm={4} md={2} key={st.stage}>
                      <Paper
                        variant="outlined"
                        onClick={() =>
                          onSelectStageFilter(selected ? "" : st.stage)
                        }
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          cursor: "pointer",
                          borderWidth: selected ? 2 : 1,
                          borderColor: selected ? meta.accent : "divider",
                          bgcolor: selected ? meta.bg : "#fff",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: meta.accent, fontWeight: 700 }}
                        >
                          {st.stepOrder}. {meta.label.toUpperCase()}
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {st.customerCount} KH
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {st.projectCount} DA • {formatVnd(st.totalContractValue)}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        )}

        {/* ================= BỘ LỌC TÌM KIẾM ================= */}
        <form className="flex flex-col py-5" onSubmit={onSubmit}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 2.5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <CoreInputCustom
                control={control}
                name="search"
                label="Tìm kiếm"
                placeholder="Mã, tên KH, SĐT, MST, người đại diện..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CoreAutocomplete
                options={CUSTOMER_TYPE_OPTIONS}
                control={control}
                name="customerType"
                label="Phân loại khách hàng"
                placeholder="Tất cả (Cá nhân / Doanh nghiệp)"
                valuePath="value"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CoreAutocomplete
                options={PIPELINE_STAGE_OPTIONS}
                control={control}
                name="pipelineStage"
                label="Giai đoạn Pipeline"
                placeholder="Tất cả giai đoạn"
                valuePath="value"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CoreAutocomplete
                options={CONTACT_STATUS_OPTIONS}
                control={control}
                name="contactStatus"
                label="Trạng thái phản hồi"
                placeholder="Tất cả trạng thái"
                valuePath="value"
              />
            </Grid>

            <Grid item xs={12}>
              <div className="pt-2 flex justify-center gap-4 items-center">
                <CoreButton onClick={onReset} theme="cancel">
                  Làm mới
                </CoreButton>
                <CoreButton theme="submit" type="submit">
                  Tìm kiếm
                </CoreButton>
              </div>
            </Grid>
          </Grid>
        </form>

        {/* ================= THANH CÔNG CỤ CHẾ ĐỘ XEM & THÊM MỚI ================= */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ pb: 3 }}
        >
          <ToggleButtonGroup
            size="small"
            exclusive
            value={viewMode}
            onChange={(_, val: CustomerViewMode | null) => {
              if (val) setViewMode(val);
            }}
          >
            <ToggleButton value="TABLE">
              <ViewListOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
              Danh sách bảng
            </ToggleButton>
            <ToggleButton value="PIPELINE">
              <ViewKanbanOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
              Bảng Pipeline (Kanban)
            </ToggleButton>
          </ToggleButtonGroup>

          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            <CoreButton
              theme="cancel"
              startIcon={<LanguageOutlinedIcon fontSize="small" />}
              onClick={() => {
                window.open(ROUTES.LANDING, "_blank");
              }}
            >
              Mở Landing Page (Form Web)
            </CoreButton>

            <Can permission={PERMISSIONS.CUSTOMER_MANAGE}>
              <CoreButton
                onClick={() => {
                  router.push(ROUTES.CUSTOMER + "/addNew");
                }}
                theme="submit"
              >
                Thêm mới khách hàng
              </CoreButton>
            </Can>
          </Stack>
        </Stack>

        {/* ================= HIỂN THỊ BẢNG HOẶC KANBAN PIPELINE (2.08) ================= */}
        {viewMode === "TABLE" ? (
          <CoreTable
            tableName="customer-table"
            columns={columns || []}
            data={tableData || []}
            page={page}
            size={size}
            totalPages={totalPages}
            isLoading={isLoading}
            onChangePageSize={onChangePageSize}
            isShowColumnStt
            onRowClick={(id: number) => {
              router.push({
                pathname: `${ROUTES.CUSTOMER}/${id}`,
                query: { actionType: "VIEW" },
              });
            }}
          />
        ) : isLoading ? (
          <CoreLoading />
        ) : (
          <DragDropContext onDragEnd={handleKanbanDragEnd}>
            {canManageCustomer && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1.5 }}
              >
                Mẹo: Giữ chuột kéo & thả thẻ khách hàng sang cột bất kỳ để chuyển
                nhanh trạng thái Pipeline.
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                pb: 3,
                alignItems: "flex-start",
              }}
            >
              {KANBAN_STAGES.map((stage) => {
                const meta = PIPELINE_STAGE_META[stage];
                const cards = rawCustomers.filter(
                  (c) => (c.pipelineStage || "LEAD") === stage
                );
                return (
                  <Droppable
                    key={stage}
                    droppableId={stage}
                    isDropDisabled={!canManageCustomer}
                  >
                    {(provided, snapshot) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        variant="outlined"
                        sx={{
                          minWidth: 285,
                          maxWidth: 310,
                          flexShrink: 0,
                          bgcolor: snapshot.isDraggingOver
                            ? meta.bg
                            : "#f8fafc",
                          borderRadius: 2,
                          p: 1.5,
                          borderTop: `4px solid ${meta.accent}`,
                          borderColor: snapshot.isDraggingOver
                            ? meta.accent
                            : undefined,
                          transition:
                            "background-color 0.18s ease, border-color 0.18s ease",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 1.5 }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            sx={{ color: meta.accent }}
                          >
                            {meta.label}
                          </Typography>
                          <Chip
                            size="small"
                            color={meta.chipColor}
                            label={cards.length}
                          />
                        </Stack>

                        <Stack spacing={1.5} sx={{ minHeight: 150 }}>
                          {cards.length === 0 && !snapshot.isDraggingOver && (
                            <Box
                              sx={{
                                py: 4,
                                px: 1,
                                textAlign: "center",
                                border: "1px dashed #cbd5e1",
                                borderRadius: 1.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {canManageCustomer
                                  ? "Kéo thả thẻ khách hàng vào đây"
                                  : "Không có khách hàng"}
                              </Typography>
                            </Box>
                          )}

                          {cards.map((cust, index) => {
                            const isBiz = cust.customerType === "BUSINESS";
                            return (
                              <Draggable
                                key={cust.id}
                                draggableId={String(cust.id)}
                                index={index}
                                isDragDisabled={!canManageCustomer}
                              >
                                {(dragProvided, dragSnapshot) => (
                                  <Paper
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    variant="outlined"
                                    onClick={() => {
                                      if (dragSnapshot.isDragging) return;
                                      router.push({
                                        pathname: `${ROUTES.CUSTOMER}/${cust.id}`,
                                        query: { actionType: "VIEW" },
                                      });
                                    }}
                                    sx={{
                                      p: 1.5,
                                      borderRadius: 1.5,
                                      bgcolor: "#fff",
                                      cursor: canManageCustomer
                                        ? "grab"
                                        : "pointer",
                                      boxShadow: dragSnapshot.isDragging
                                        ? 6
                                        : 0,
                                      borderColor: dragSnapshot.isDragging
                                        ? meta.accent
                                        : undefined,
                                      "&:active": {
                                        cursor: canManageCustomer
                                          ? "grabbing"
                                          : "pointer",
                                      },
                                      "&:hover": { boxShadow: 2 },
                                    }}
                                  >
                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                    >
                                      <Stack
                                        direction="row"
                                        spacing={0.5}
                                        alignItems="center"
                                      >
                                        {canManageCustomer && (
                                          <DragIndicatorIcon
                                            sx={{
                                              fontSize: 16,
                                              color: "text.disabled",
                                              ml: -0.5,
                                            }}
                                          />
                                        )}
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          fontWeight={600}
                                        >
                                          {cust.code}
                                        </Typography>
                                      </Stack>
                                      <Chip
                                        size="small"
                                        icon={
                                          isBiz ? (
                                            <BusinessOutlinedIcon fontSize="small" />
                                          ) : (
                                            <PersonOutlineIcon fontSize="small" />
                                          )
                                        }
                                        label={isBiz ? "DN" : "Cá nhân"}
                                        variant="outlined"
                                        color={isBiz ? "secondary" : "info"}
                                      />
                                    </Stack>

                                    <Typography
                                      variant="body2"
                                      fontWeight={700}
                                      sx={{ mt: 0.5 }}
                                    >
                                      {cust.name}
                                    </Typography>

                                    {cust.phone && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                      >
                                        SĐT: {cust.phone}
                                      </Typography>
                                    )}

                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                      sx={{ mt: 1 }}
                                    >
                                      <Typography
                                        variant="caption"
                                        color="primary.main"
                                        fontWeight={600}
                                      >
                                        {cust.projectCount ?? 0} DA •{" "}
                                        {cust.careLogCount ?? 0} CS
                                      </Typography>
                                      {cust.assignedStaff?.name && (
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {cust.assignedStaff.name}
                                        </Typography>
                                      )}
                                    </Stack>

                                    {canManageCustomer && (
                                      <Box
                                        sx={{ mt: 1 }}
                                        onClick={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                      >
                                        <Select
                                          fullWidth
                                          size="small"
                                          value={cust.pipelineStage || "LEAD"}
                                          onChange={(e) =>
                                            handleQuickChangeStage(
                                              cust.id,
                                              e.target
                                                .value as CustomerPipelineStage
                                            )
                                          }
                                          sx={{ fontSize: "0.75rem" }}
                                        >
                                          {PIPELINE_STAGE_OPTIONS.map((opt) => (
                                            <MenuItem
                                              key={opt.value}
                                              value={opt.value}
                                            >
                                              Chuyển: {opt.label}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </Box>
                                    )}
                                  </Paper>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </Stack>
                      </Paper>
                    )}
                  </Droppable>
                );
              })}
            </Box>
          </DragDropContext>
        )}
      </PageContainer>
    </Grid>
  );
}
