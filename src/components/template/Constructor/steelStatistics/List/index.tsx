import Can from "@/components/atoms/Can";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreNavbar from "@/components/organism/CoreNavbar";
import PageContainer from "@/components/organism/PageContainer";
import { PERMISSIONS } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import {
  Autocomplete,
  Box,
  Grid,
  TablePagination,
  TextField,
} from "@mui/material";
import router from "next/router";
import ProjectCardList from "./components/ProjectCardList";
import useSteelStatisticsList from "./useSteelStatisticsList";

export default function SteelStatisticsList() {
  const [value, handle] = useSteelStatisticsList();
  const {
    items,
    totalElements,
    page,
    rowsPerPage,
    search,
    projectId,
    projects,
    isLoading,
  } = value;
  const { setSearch, setProjectId, setPage, setRowsPerPage, onDelete } = handle;

  const selectedProject =
    projects.find((p) => p.id === projectId) ?? null;

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      sx={{
        minHeight: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs
            breadcrumbs={[{ title: "Danh sách dự án thống kê thép" }]}
          />
        }
      >
        <div className="flex flex-col py-6">
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Tìm kiếm"
                placeholder="Tìm theo mã hoặc tên công trình"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                size="small"
                options={projects}
                value={selectedProject}
                getOptionLabel={(opt) =>
                  opt.code ? `${opt.code} - ${opt.name}` : opt.name
                }
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                onChange={(_, val) => setProjectId(val ? val.id : null)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lọc theo dự án chính"
                    placeholder="Tất cả dự án"
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              className="flex justify-end items-center"
            >
              <Can
                permission={[
                  PERMISSIONS.MATERIAL_MANAGE,
                  PERMISSIONS.PROJECT_CREATE,
                  PERMISSIONS.PROJECT_UPDATE,
                ]}
              >
                <CoreButton
                  onClick={() => {
                    router.push(
                      projectId
                        ? {
                            pathname: ROUTES.STEELSTATISTICSNEW,
                            query: { projectId },
                          }
                        : ROUTES.STEELSTATISTICSNEW
                    );
                  }}
                  theme="submit"
                >
                  Thêm mới
                </CoreButton>
              </Can>
            </Grid>
          </Grid>
        </div>

        <CoreNavbar
          breadcrumbs={[
            {
              title: `Danh sách (${totalElements})`,
              content: (
                <Box>
                  <ProjectCardList
                    items={items}
                    isLoading={isLoading}
                    onDelete={onDelete}
                  />
                  {totalElements > 0 && (
                    <TablePagination
                      component="div"
                      count={totalElements}
                      page={page}
                      onPageChange={(_, newPage) => setPage(newPage)}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={(e) =>
                        setRowsPerPage(parseInt(e.target.value, 10))
                      }
                      rowsPerPageOptions={[8, 12, 24, 48]}
                      labelRowsPerPage="Số mục mỗi trang:"
                    />
                  )}
                </Box>
              ),
            },
          ]}
        />
      </PageContainer>
    </Grid>
  );
}
