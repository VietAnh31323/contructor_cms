import { useDialog } from "@/components/hooks/dialog/useDialog";
import EmptyIcon from "@/components/icons/EmptyIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { layoutType } from "@/components/layouts/MultipleLayouts/layoutTypeRecoil";
import CoreLoading from "@/components/molecules/CoreLoading";
import { ColumnProps } from "@/components/organism/CoreTable";
import { DialogTable } from "@/components/organism/CoreTable/components/DialogTable";
import CoreTablePagination from "@/components/organism/CoreTablePagination";
import { BACK_GROUND, WHITE } from "@/helper/colors";
import { useAppSelector } from "@/redux/hook";
import { TRANSLATE } from "@/routes";
import styled from "@emotion/styled";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { ReactElement, useId } from "react";
import { useRecoilValue } from "recoil";
import RowItem from "./RowItem";

type PaginationTableProps = {
  page?: number;
  size?: number;
};

type Props = {
  tableName?: string;
  className?: string;
  data: Record<string, any>[];
  columns: ColumnProps[];
  columnsChild: ColumnProps[];
  page?: number;
  size?: number;
  totalPages?: number;
  paginationHidden?: boolean;
  isLoading?: boolean;
  isShowColumnStt?: boolean;
  isShowDialogTable?: boolean;
  maxHeight?: number;
  showInfoText?: boolean;
  actionTable?: null | ReactElement;
  onChangePageSize?: (val: PaginationTableProps) => void;
  onRowClick?: (id: number, row?: any) => void;
  handleOpen?: (id: number, row?: any) => void;
  dataChild?: any[];
  isCheckCode?: boolean;
  fetchDataFn?: (val: any) => Promise<any>;
  params?: any;
  onChangData?: (data: any) => void;
};

export const TableHeadCommon = styled(TableHead)(
  ({ layout }: { layout: "Layout1" | "Layout2" }) => ({
    backgroundColor: layout === "Layout1" ? BACK_GROUND : WHITE,
    ...(layout === "Layout1" ? {} : { borderBottom: "2px solid #A7A7A7" }),
  })
);

export const TableContainerCommon = styled(TableContainer)(
  ({ layout }: { layout: "Layout1" | "Layout2" }) => ({
    boxShadow: "none!important",
    borderRadius: layout === "Layout1" ? "4px 4px 0px 0px" : "10px",
    ...(layout === "Layout1" ? { border: "1px solid #DFE0EB" } : {}),
  })
);

export const CoreTableCollapseCode = ({
  className,
  tableName,
  data,
  columns,
  columnsChild,
  page = 0,
  size = 20,
  totalPages,
  paginationHidden,
  isLoading,
  actionTable,
  isShowColumnStt = false,
  isShowDialogTable = true,
  isCheckCode = false,
  maxHeight,
  onChangePageSize,
  handleOpen,
  onRowClick,
  dataChild,
  fetchDataFn,
  onChangData,
  params,
}: Props) => {
  const { t } = useTranslation(TRANSLATE.COMMON);
  const { showDialog } = useDialog();
  const layout = useRecoilValue(layoutType);
  const key = useId();
  const dataColumn = isShowColumnStt
    ? [
        {
          header: t("table.no") ?? "No",
          fieldName: "index",
        },
        ...columns,
      ]
    : columns;

  if (isShowColumnStt) {
    data = data.map((item: any, index: number) => {
      const noNumber = page * size + index + 1;
      return {
        ...item,
        index: noNumber > 9 ? noNumber : `0${noNumber}`,
      };
    });
  }

  const listTableCache = useAppSelector((state) => state.tableConfigData);
  const tableCurrent = listTableCache.find(
    (item) => item.tableName === tableName
  );
  const columnsChecked = tableCurrent
    ? tableCurrent.columns.map((item) =>
        dataColumn.find((ele) => ele.fieldName === item)
      )
    : dataColumn;

  return (
    <div
      className={className}
      style={{
        position: "relative",
      }}
    >
      {isShowDialogTable && (
        <div className="absolute right-5 top-5">
          <PlusIcon
            onClick={() =>
              showDialog(
                <DialogTable
                  columns={dataColumn}
                  columnsChecked={columnsChecked}
                  tableName={tableName}
                />
              )
            }
          />
        </div>
      )}

      <TableContainerCommon
        layout={layout}
        style={{
          maxHeight: `${maxHeight}px`,
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHeadCommon layout={layout}>
            <TableRow>
              {_.map(columnsChecked, (column, index) => (
                <TableCell
                  variant="head"
                  key={index}
                  {...(column?.styleCell ?? {})}
                  style={{
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                    minWidth: index !== 0 ? 200 : 60,
                    fontWeight: 600,
                    backgroundColor: "#f0f3f7",
                    ...column?.styleCell?.style,
                  }}
                >
                  {column?.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeadCommon>
          {isLoading && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columnsChecked.length} variant="body">
                  <div className="flex justify-center min-h-[60px]">
                    <CoreLoading />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          )}

          {data.map((item, index) => {
            return (
              <RowItem
                key={`${key + index}`}
                index={index}
                rowParent={item}
                handleOpen={handleOpen}
                onRowClick={onRowClick}
                columnsChecked={columnsChecked}
                columnsChild={columnsChild}
                columns={columns}
                itemId={item?.id}
                dataChild={dataChild ?? []}
                isCheckCode={isCheckCode}
                fetchDataFn={fetchDataFn}
                params={params}
                onChangData={onChangData}
              />
            );
          })}
          {data.length === 0 && !isLoading && (
            <TableRow>
              <TableCell
                colSpan={columnsChecked.length}
                variant="body"
                align="center"
                className="py-8"
              >
                <div className="flex justify-center min-h-[60px] flex-col">
                  <EmptyIcon />
                  <Typography variant="body2">{t("table.no_data")}</Typography>
                </div>
              </TableCell>
            </TableRow>
          )}
          {actionTable && (
            <TableRow>
              <TableCell colSpan={columnsChecked.length}>
                {actionTable}
              </TableCell>
            </TableRow>
          )}
        </Table>
      </TableContainerCommon>
      {!paginationHidden && (
        <div className="py-5">
          <CoreTablePagination
            size={size ?? 1}
            page={page ?? 1}
            totalPages={totalPages ?? 1}
            onChangePagination={(val: any) =>
              onChangePageSize && onChangePageSize(val)
            }
          />
        </div>
      )}
    </div>
  );
};
