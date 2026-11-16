import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import CoreAutoCompleteAPI from "@/components/atoms/CoreAutoCompleteAPI";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import Can from "@/components/atoms/Can";
import CoreLoading from "@/components/molecules/CoreLoading";
import { CoreTable } from "@/components/organism/CoreTable";
import PageContainer from "@/components/organism/PageContainer";
import { PERMISSIONS } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import { getCustomerList } from "@/service/constructor/Customer/getList";
import { ProjectState } from "@/service/constructor/Project/getList/type";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import router from "next/router";
import { formatVnd } from "../../customer/constants";
import {
  getAllowedNextProjectStates,
  normalizeProjectState,
  PROJECT_FILTER_STATE_OPTIONS,
  PROJECT_KANBAN_STATES,
  PROJECT_STATE_META,
} from "../constants";
import ProjectTransitionDialog from "../ProjectTransitionDialog";
import useConstructionProjectList, {
  ProjectViewMode,
} from "./useConstructionProjectList";

export default function ConstructionProjectList() {
  const [value, handle] = useConstructionProjectList();

  const {
    control,
    columns,
    tableData,
    rawProjects,
    lifecycleSummary,
    activeStateFilter,
    viewMode,
    canUpdateProject,
    canDeleteProject,
    isLoading,
    page,
    size,
    totalPages,
    totalElements,
    transitionModal,
    isTransitioning,
  } = value;

  const {
    onSubmit,
    onReset,
    onChangePageSize,
    onRowClick,
    setViewMode,
    handleSelectStageCard,
    handleKanbanDragEnd,
    openTransitionForItem,
    closeTransitionModal,
    confirmTransition,
    handleDeleteProject,
  } = handle;

  return (
    <PageContainer
      title={
        <CoreBreadcrumbs
          breadcrumbs={[{ title: "Quản lý dự án & Vòng đời thi công" }]}
        />
      }
    >
      {/* ================= BẢNG TỔNG QUAN VÒNG ĐỜI DỰ ÁN (2.09) ================= */}
      {lifecycleSummary && (
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            overflowX: "auto",
            pb: 1.5,
            pt: 1,
          }}
        >
          <Paper
            variant="outlined"
            onClick={() => handleSelectStageCard("")}
            sx={{
              minWidth: 165,
              p: 1.5,
              borderRadius: 2,
              cursor: "pointer",
              borderColor:
                activeStateFilter === "" ? "primary.main" : "#e2e8f0",
              borderWidth: activeStateFilter === "" ? 2 : 1,
              bgcolor: activeStateFilter === "" ? "#eff6ff" : "#ffffff",
              flexShrink: 0,
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              TẤT CẢ DỰ ÁN
            </Typography>
            <Typography variant="h6" fontWeight={800} sx={{ mt: 0.25 }}>
              {lifecycleSummary.totalProjects}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Đang chạy: {lifecycleSummary.activeProjects} •{" "}
              {formatVnd(lifecycleSummary.totalContractValue)}
            </Typography>
          </Paper>

          {PROJECT_KANBAN_STATES.map((st) => {
            const meta = PROJECT_STATE_META[st];
            const stageSummary = lifecycleSummary.stages?.find(
              (s) => s.state === st
            );
            const count = stageSummary?.projectCount ?? 0;
            const totalVal = stageSummary?.totalContractValue ?? 0;
            const isSelected = activeStateFilter === st;

            return (
              <Paper
                key={st}
                variant="outlined"
                onClick={() =>
                  handleSelectStageCard(isSelected ? "" : st)
                }
                sx={{
                  minWidth: 150,
                  p: 1.5,
                  borderRadius: 2,
                  cursor: "pointer",
                  borderTop: `3px solid ${meta.accent}`,
                  borderColor: isSelected ? meta.accent : undefined,
                  bgcolor: isSelected ? meta.bg : "#ffffff",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: meta.bg,
                  },
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: meta.accent }}
                  noWrap
                >
                  {meta.shortLabel}
                </Typography>
                <Typography variant="h6" fontWeight={800} sx={{ mt: 0.25 }}>
                  {count} DA
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                  noWrap
                >
                  {formatVnd(totalVal)}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      )}

      {/* ================= BỘ LỌC TÌM KIẾM ================= */}
      <form onSubmit={onSubmit} className="flex flex-col py-3">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={4}>
            <CoreInputCustom
              control={control}
              name="search"
              label="Tìm kiếm dự án"
              placeholder="Mã dự án, tên công trình hoặc tên khách hàng..."
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <CoreAutoCompleteAPI
              control={control}
              name="customer"
              label="Khách hàng / Chủ đầu tư"
              placeholder="Chọn khách hàng"
              fetchDataFn={getCustomerList}
              labelPath="name"
              labelPathDisplay={["code", "name"]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <CoreAutocomplete
              options={PROJECT_FILTER_STATE_OPTIONS}
              control={control}
              name="state"
              label="Giai đoạn vòng đời"
              placeholder="Chọn giai đoạn"
              valuePath="value"
              labelPath="label"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <CoreButton onClick={onReset} theme="cancel">
                Đặt lại
              </CoreButton>
              <CoreButton theme="submit" type="submit">
                Tìm kiếm
              </CoreButton>
            </Stack>
          </Grid>
        </Grid>
      </form>

      {/* ================= CHẾ ĐỘ XEM & THÊM MỚI ================= */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        className="py-3"
      >
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <ToggleButtonGroup
            size="small"
            exclusive
            value={viewMode}
            onChange={(_, val: ProjectViewMode | null) => {
              if (val) setViewMode(val);
            }}
          >
            <ToggleButton value="TABLE">
              <ViewListOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
              Danh sách bảng
            </ToggleButton>
            <ToggleButton value="KANBAN">
              <ViewKanbanOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
              Bảng Vòng đời (Kanban)
            </ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="body2" color="text.secondary">
            Tổng số: <strong>{totalElements}</strong> công trình / dự án
          </Typography>
        </Stack>

        <Can permission={PERMISSIONS.PROJECT_CREATE}>
          <CoreButton
            startIcon={<AddIcon />}
            onClick={() => {
              router.push(ROUTES.PROJECT + "/addNew");
            }}
            theme="submit"
          >
            Tiếp nhận / Thêm dự án mới
          </CoreButton>
        </Can>
      </Stack>

      {/* ================= HIỂN THỊ BẢNG HOẶC KANBAN VÒNG ĐỜI ================= */}
      {viewMode === "TABLE" ? (
        <CoreTable
          tableName="construction-project-list"
          columns={columns}
          data={tableData}
          page={page}
          size={size}
          totalPages={totalPages}
          isLoading={isLoading}
          onChangePageSize={onChangePageSize}
          onRowClick={onRowClick}
          isShowColumnStt
        />
      ) : isLoading ? (
        <CoreLoading />
      ) : (
        <DragDropContext onDragEnd={handleKanbanDragEnd}>
          {canUpdateProject && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1.5 }}
            >
              Mẹo: Kéo & thả thẻ dự án sang bước kế tiếp để kiểm tra điều kiện và
              ghi nhật ký chuyển trạng thái vòng đời.
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
            {PROJECT_KANBAN_STATES.map((stage) => {
              const meta = PROJECT_STATE_META[stage];
              const columnItems = rawProjects.filter(
                (p) => normalizeProjectState(p.state) === stage
              );

              return (
                <Paper
                  key={stage}
                  variant="outlined"
                  sx={{
                    minWidth: 285,
                    maxWidth: 285,
                    bgcolor: "#f8fafc",
                    borderRadius: 2,
                    borderTop: `4px solid ${meta.accent}`,
                    flexShrink: 0,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: meta.bg,
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      sx={{ color: meta.accent }}
                    >
                      {meta.shortLabel}
                    </Typography>
                    <Chip
                      size="small"
                      label={columnItems.length}
                      sx={{
                        height: 22,
                        fontWeight: 700,
                        bgcolor: meta.accent,
                        color: "#ffffff",
                      }}
                    />
                  </Stack>

                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          p: 1.25,
                          minHeight: 160,
                          maxHeight: "68vh",
                          overflowY: "auto",
                          transition: "background-color 0.15s ease",
                          bgcolor: snapshot.isDraggingOver
                            ? `${meta.accent}14`
                            : "transparent",
                        }}
                      >
                        <Stack spacing={1.25}>
                          {columnItems.length === 0 &&
                            !snapshot.isDraggingOver && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  textAlign: "center",
                                  py: 3,
                                  display: "block",
                                }}
                              >
                                Chưa có dự án ở bước này
                              </Typography>
                            )}

                          {columnItems.map((proj, index) => {
                            const currentState = normalizeProjectState(
                              proj.state
                            );
                            const allowedNext =
                              proj.allowedNextStates &&
                              proj.allowedNextStates.length > 0
                                ? proj.allowedNextStates.map((s) =>
                                    normalizeProjectState(s)
                                  )
                                : getAllowedNextProjectStates(
                                    currentState,
                                    proj.previousState
                                  );
                            const pct = Math.min(
                              100,
                              Math.max(0, Number(proj.progressPercent ?? 0))
                            );
                            const customerLabel =
                              proj.customer?.name || proj.owner || "—";

                            return (
                              <Draggable
                                key={proj.id}
                                draggableId={`project-${proj.id}`}
                                index={index}
                                isDragDisabled={!canUpdateProject}
                              >
                                {(dragProvided, dragSnapshot) => (
                                  <Paper
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    variant="outlined"
                                    sx={{
                                      p: 1.5,
                                      borderRadius: 2,
                                      bgcolor: "#ffffff",
                                      cursor: canUpdateProject
                                        ? "grab"
                                        : "pointer",
                                      boxShadow: dragSnapshot.isDragging
                                        ? "0 10px 24px rgba(15,23,42,0.18)"
                                        : "none",
                                      borderColor: dragSnapshot.isDragging
                                        ? meta.accent
                                        : "#e2e8f0",
                                      "&:hover": {
                                        borderColor: meta.accent,
                                      },
                                    }}
                                  >
                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                    >
                                      <Typography
                                        variant="caption"
                                        fontWeight={700}
                                        color="primary.main"
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => onRowClick(proj.id)}
                                      >
                                        {proj.code}
                                      </Typography>
                                      {canUpdateProject && (
                                        <DragIndicatorIcon
                                          sx={{
                                            fontSize: 16,
                                            color: "text.disabled",
                                          }}
                                        />
                                      )}
                                    </Stack>

                                    <Typography
                                      variant="body2"
                                      fontWeight={700}
                                      sx={{
                                        mt: 0.25,
                                        cursor: "pointer",
                                        "&:hover": {
                                          textDecoration: "underline",
                                        },
                                      }}
                                      onClick={() => onRowClick(proj.id)}
                                    >
                                      {proj.name}
                                    </Typography>

                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ display: "block", mt: 0.25 }}
                                      noWrap
                                    >
                                      CĐT: {customerLabel}
                                    </Typography>

                                    {proj.manager?.name && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block" }}
                                        noWrap
                                      >
                                        CNDA: {proj.manager.name}
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
                                        fontWeight={700}
                                        color="text.primary"
                                      >
                                        {formatVnd(proj.contractValue)}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        fontWeight={600}
                                        color="text.secondary"
                                      >
                                        {pct.toFixed(0)}%
                                      </Typography>
                                    </Stack>

                                    <LinearProgress
                                      variant="determinate"
                                      value={pct}
                                      sx={{
                                        height: 5,
                                        borderRadius: 3,
                                        mt: 0.5,
                                      }}
                                    />

                                    {proj.stateReason && (
                                      <Typography
                                        variant="caption"
                                        color="warning.dark"
                                        sx={{
                                          display: "block",
                                          mt: 0.75,
                                          fontStyle: "italic",
                                        }}
                                        noWrap
                                      >
                                        Ghi chú: {proj.stateReason}
                                      </Typography>
                                    )}

                                    {canUpdateProject &&
                                      allowedNext.length > 0 && (
                                        <Box
                                          sx={{ mt: 1.25 }}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Select
                                            size="small"
                                            fullWidth
                                            displayEmpty
                                            value=""
                                            onChange={(e) => {
                                              const nextVal = e.target
                                                .value as ProjectState;
                                              if (nextVal) {
                                                openTransitionForItem(
                                                  proj,
                                                  nextVal
                                                );
                                              }
                                            }}
                                            sx={{
                                              fontSize: "0.75rem",
                                              height: 30,
                                              bgcolor: "#f8fafc",
                                            }}
                                          >
                                            <MenuItem
                                              value=""
                                              disabled
                                              sx={{ fontSize: "0.75rem" }}
                                            >
                                              Chuyển bước tiếp theo...
                                            </MenuItem>
                                            {allowedNext.map((nextSt) => (
                                              <MenuItem
                                                key={nextSt}
                                                value={nextSt}
                                                sx={{ fontSize: "0.78rem" }}
                                              >
                                                →{" "}
                                                {PROJECT_STATE_META[nextSt]
                                                  ?.shortLabel || nextSt}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                        </Box>
                                      )}

                                    <Stack
                                      direction="row"
                                      justifyContent="flex-end"
                                      alignItems="center"
                                      spacing={0.5}
                                      sx={{
                                        mt: 1,
                                        pt: 0.75,
                                        borderTop: "1px dashed #e2e8f0",
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Tooltip title="Xem biểu đồ Gantt tiến độ">
                                        <IconButton
                                          size="small"
                                          color="primary"
                                          onClick={() =>
                                            router.push({
                                              pathname: `${ROUTES.PROJECT}/${proj.id}`,
                                              query: {
                                                actionType: "VIEW",
                                                tab: "gantt",
                                              },
                                            })
                                          }
                                        >
                                          <TimelineOutlinedIcon
                                            sx={{ fontSize: 18 }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Xem chi tiết dự án">
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            router.push({
                                              pathname: `${ROUTES.PROJECT}/${proj.id}`,
                                              query: { actionType: "VIEW" },
                                            })
                                          }
                                        >
                                          <VisibilityOutlinedIcon
                                            sx={{ fontSize: 18 }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                      {canUpdateProject && (
                                        <Tooltip title="Chỉnh sửa thông tin">
                                          <IconButton
                                            size="small"
                                            color="warning"
                                            onClick={() =>
                                              router.push({
                                                pathname: `${ROUTES.PROJECT}/${proj.id}`,
                                                query: { actionType: "EDIT" },
                                              })
                                            }
                                          >
                                            <EditOutlinedIcon
                                              sx={{ fontSize: 18 }}
                                            />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                      {canDeleteProject && (
                                        <Tooltip title="Xóa dự án">
                                          <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() =>
                                              handleDeleteProject(proj)
                                            }
                                          >
                                            <DeleteOutlineIcon
                                              sx={{ fontSize: 18 }}
                                            />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                    </Stack>
                                  </Paper>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </Stack>
                      </Box>
                    )}
                  </Droppable>
                </Paper>
              );
            })}
          </Box>
        </DragDropContext>
      )}

      {/* ================= DIALOG KIỂM TRA ĐIỀU KIỆN & GHI LOG CHUYỂN TRẠNG THÁI ================= */}
      <ProjectTransitionDialog
        open={transitionModal.open}
        targetState={transitionModal.targetState}
        snapshot={transitionModal.snapshot}
        submitting={isTransitioning}
        onClose={closeTransitionModal}
        onConfirm={confirmTransition}
        onOpenEditProject={(projectId) =>
          router.push({
            pathname: `${ROUTES.PROJECT}/${projectId}`,
            query: { actionType: "EDIT" },
          })
        }
      />
    </PageContainer>
  );
}
