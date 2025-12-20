import EmptyIcon from "@/components/icons/EmptyIcon";
import { layoutType } from "@/components/layouts/MultipleLayouts/layoutTypeRecoil";
import CoreLoading from "@/components/molecules/CoreLoading";
import PaginationCustom from "@/components/organism/PaginationCustom";
import { BACK_GROUND, WHITE } from "@/helper/colors";
import { useAppSelector } from "@/redux/hook";
// import { TRANSLATE } from '@/routes'
import styled from "@emotion/styled";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { ReactElement, ReactNode, useId } from "react";
import { useRecoilValue } from "recoil";
import RowLine from "./RowLine";

export type ColumnProps = {
  header: ReactNode;
  fieldName: string;
  render?: (val: any, index?: number) => ReactNode;
  styleCell?: TableCellProps;
  isNameCheck?: (row: any) => boolean;
};

type PaginationTableProps = {
  page?: number;
  size?: number;
};

type Props = {
  tableName?: string;
  className?: string;
  data: Record<string, any>[];
  columns: ColumnProps[];
  page?: number;
  size?: number;
  totalPages?: number;
  paginationHidden?: boolean;
  isLoading?: boolean;
  isShowColumnStt?: boolean;
  maxHeight?: number;
  showInfoText?: boolean;
  actionTable?: null | ReactElement;
  nameCheck?: string;
  returnValueCheckbox?: string;
  checkedValue?: Array<any>;
  onChangeChecked?: (val: any) => void;
  onChangePageSize?: (val: PaginationTableProps) => void;
  onRowClick?: (id: number, row?: any) => void;
  renderCollapse?: (item: any) => JSX.Element;
  onDisabledChecked?: (val: any, index: number) => boolean;
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

export const TableCollapse = ({
  className,
  tableName,
  data,
  columns,
  page = 0,
  size = 20,
  totalPages,
  paginationHidden,
  isLoading,
  isShowColumnStt = true,
  maxHeight,
  nameCheck,
  checkedValue = [],
  returnValueCheckbox = "",
  onChangeChecked = () => {},
  onChangePageSize,
  onRowClick,
  renderCollapse,
  onDisabledChecked,
  actionTable,
}: Props) => {
  // const { t } = useTranslation(TRANSLATE.COMMON)
  const layout = useRecoilValue(layoutType);
  const key = useId();
  let dataColumn = isShowColumnStt
    ? [
        {
          header: "STT",
          fieldName: "index",
        },
        ...columns,
      ]
    : columns;

  // Ensure data is always an array
  data = Array.isArray(data) ? data : [];

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

  if (returnValueCheckbox) {
    dataColumn = [
      {
        header: (
          <Checkbox
            checked={
              checkedValue.filter((item) =>
                data.some(
                  (item2) =>
                    item2[`${returnValueCheckbox}`] ===
                    item[`${returnValueCheckbox}`]
                )
              ).length === data.length
            }
            onChange={(e, checked) => {
              if (checked) {
                if (!!onDisabledChecked) {
                  onChangeChecked(
                    data.filter((item, index) => onDisabledChecked(item, index))
                  );
                } else {
                  onChangeChecked(data);
                }
              } else {
                onChangeChecked([]);
              }
            }}
            size="small"
          />
        ),
        fieldName: "checkbox",
        styleCell: { style: { width: 100 } },
      },
      ...dataColumn,
    ];
    data = data.map((row: any, index: number) => {
      return {
        ...row,
        checkbox: (
          <Checkbox
            checked={checkedValue.some(
              (item) =>
                row[`${returnValueCheckbox}`] === item[`${returnValueCheckbox}`]
            )}
            onChange={(e, checked) => {
              checked
                ? onChangeChecked(checkedValue.concat(row))
                : onChangeChecked(
                    checkedValue.filter(
                      (item) =>
                        row[`${returnValueCheckbox}`] !==
                        item[`${returnValueCheckbox}`]
                    )
                  );
            }}
            disabled={onDisabledChecked ? onDisabledChecked(row, index) : false}
            size="small"
          />
        ),
      };
    });
  }

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
      <TableContainerCommon
        layout={layout}
        style={{
          maxHeight: `${maxHeight}px`,
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHeadCommon layout={layout}>
            <TableRow>
              {_.map(columnsChecked, (column: ColumnProps, index: any) => (
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
              <RowLine
                key={`${key + index}`}
                index={index}
                rowParent={item}
                onRowClick={onRowClick}
                columnsChecked={columnsChecked}
                columns={columns}
                nameCheck={nameCheck}
                renderCollapse={renderCollapse}
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
                  <Typography variant="body2">{"Không có dữ liệu"}</Typography>
                </div>
              </TableCell>
            </TableRow>
          )}
        </Table>
        {actionTable}
      </TableContainerCommon>
      {!paginationHidden && (
        <div className="py-5">
          <PaginationCustom
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
