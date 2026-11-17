import Can from "@/components/atoms/Can";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreLoading from "@/components/molecules/CoreLoading";
import { CoreTable } from "@/components/organism/CoreTable";
import PageContainer from "@/components/organism/PageContainer";
import { formatVnd } from "@/components/template/Constructor/customer/constants";
import { PERMISSIONS } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import { useCategoryTreeQuery } from "@/service/constructor/Category/getList";
import { CategoryList as CategoryNode } from "@/service/constructor/Category/getList/type";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import router from "next/router";
import React, { useMemo, useState } from "react";
import useCategoryList from "./useCategoryList";

type CategoryViewMode = "TREE" | "TABLE";

export default function CategoryList() {
  const [value, handle] = useCategoryList();
  const { columns, tableData, page, rowsPerPage } = value;
  const { setPage, setRowsPerPage } = handle;

  const [viewMode, setViewMode] = useState<CategoryViewMode>("TREE");
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});

  const { data: treeResp, isLoading: isTreeLoading } = useCategoryTreeQuery({
    enabled: viewMode === "TREE",
  });

  const treeData = treeResp?.data ?? [];

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  const filterTree = (nodes: CategoryNode[], q: string): CategoryNode[] => {
    if (!q) return nodes;
    const lower = q.toLowerCase();
    const res: CategoryNode[] = [];
    for (const node of nodes) {
      const matchedChildren = node.children
        ? filterTree(node.children, q)
        : [];
      const selfMatch =
        (node.code || "").toLowerCase().includes(lower) ||
        (node.name || "").toLowerCase().includes(lower);
      if (selfMatch || matchedChildren.length > 0) {
        res.push({
          ...node,
          children: matchedChildren,
        });
      }
    }
    return res;
  };

  const filteredTree = useMemo(
    () => filterTree(treeData, search.trim()),
    [treeData, search]
  );

  const renderTreeNode = (node: CategoryNode, depth = 0) => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = expandedIds[node.id] !== false;

    return (
      <Box key={node.id}>
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            mb: 1,
            ml: depth * 3.5,
            borderRadius: 2,
            bgcolor: depth === 0 ? "#f8fafc" : "#ffffff",
            borderLeft: depth > 0 ? "3px solid #3b82f6" : undefined,
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {hasChildren ? (
                <IconButton
                  size="small"
                  onClick={() => toggleExpand(node.id)}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              ) : depth > 0 ? (
                <SubdirectoryArrowRightIcon
                  fontSize="small"
                  sx={{ color: "text.disabled", ml: 0.5 }}
                />
              ) : (
                <FolderOutlinedIcon
                  fontSize="small"
                  sx={{ color: "primary.main", ml: 0.5 }}
                />
              )}

              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {node.code}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {node.name}
                  </Typography>
                  {hasChildren && (
                    <Chip
                      size="small"
                      label={`${node.children?.length} mục con`}
                      variant="outlined"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                  )}
                </Stack>
                {node.description && (
                  <Typography variant="caption" color="text.secondary">
                    {node.description}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {node.unit && (
                <Chip
                  size="small"
                  label={`ĐVT: ${node.unit}`}
                  variant="outlined"
                />
              )}
              {node.defaultUnitPrice && Number(node.defaultUnitPrice) > 0 ? (
                <Chip
                  size="small"
                  color="info"
                  variant="outlined"
                  label={`Đơn giá: ${formatVnd(node.defaultUnitPrice)}`}
                />
              ) : null}
              <Chip
                size="small"
                color={node.isActive ? "success" : "default"}
                label={node.isActive ? "Hoạt động" : "Ngưng hoạt động"}
              />

              <Can
                permission={[
                  PERMISSIONS.PROJECT_CREATE,
                  PERMISSIONS.PROJECT_UPDATE,
                ]}
              >
                <Tooltip title="Thêm hạng mục con">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() =>
                      router.push({
                        pathname: `${ROUTES.CATEGORY}/addNew`,
                        query: { parentId: node.id },
                      })
                    }
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Can>

              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  onClick={() =>
                    router.push({
                      pathname: `${ROUTES.CATEGORY}/${node.id}`,
                      query: { actionType: "VIEW" },
                    })
                  }
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Can permission={PERMISSIONS.PROJECT_UPDATE}>
                <Tooltip title="Chỉnh sửa">
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() =>
                      router.push({
                        pathname: `${ROUTES.CATEGORY}/${node.id}`,
                      })
                    }
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Can>
            </Stack>
          </Stack>
        </Paper>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {node.children?.map((child) => renderTreeNode(child, depth + 1))}
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <PageContainer
      title={
        <CoreBreadcrumbs
          breadcrumbs={[{ title: "Quản lý hạng mục công trình (Cây 2.18)" }]}
        />
      }
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        className="py-4"
      >
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <ToggleButtonGroup
            size="small"
            exclusive
            value={viewMode}
            onChange={(_, val: CategoryViewMode | null) => {
              if (val) setViewMode(val);
            }}
          >
            <ToggleButton value="TREE">
              <AccountTreeOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
              Cây hạng mục
            </ToggleButton>
            <ToggleButton value="TABLE">
              <ViewListOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
              Danh sách bảng
            </ToggleButton>
          </ToggleButtonGroup>

          {viewMode === "TREE" && (
            <TextField
              size="small"
              placeholder="Tìm theo mã hoặc tên hạng mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 260 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>

        <Can
          permission={[PERMISSIONS.PROJECT_CREATE, PERMISSIONS.PROJECT_UPDATE]}
        >
          <CoreButton
            startIcon={<AddIcon />}
            onClick={() => {
              router.push(ROUTES.CATEGORY + "/addNew");
            }}
            theme="submit"
          >
            Thêm mới hạng mục
          </CoreButton>
        </Can>
      </Stack>

      {viewMode === "TREE" ? (
        isTreeLoading ? (
          <CoreLoading />
        ) : filteredTree.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có hạng mục nào. Nhấn &quot;Thêm mới hạng mục&quot; để khởi tạo cây hạng mục.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ pb: 4 }}>{filteredTree.map((n) => renderTreeNode(n, 0))}</Box>
        )
      ) : (
        <CoreTable
          tableName="category-list"
          columns={columns ?? []}
          data={tableData ?? []}
          page={page ?? 0}
          size={rowsPerPage ?? 10}
          totalPages={10}
          onChangePageSize={(val) => {
            setPage?.(val.page ?? 0);
            setRowsPerPage?.(val.size ?? 10);
          }}
          onRowClick={(id) => {
            router.push({
              pathname: `${ROUTES.CATEGORY}/[id]`,
              query: { id: id, actionType: "VIEW" },
            });
          }}
          isShowColumnStt
        />
      )}
    </PageContainer>
  );
}
