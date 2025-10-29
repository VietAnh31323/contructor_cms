import { layoutType } from '@/components/layouts/MultipleLayouts/layoutTypeRecoil'
import { ChangeSttColumn } from '@/components/organism/CoreTable/components/ChangeSttColumn'
import { TableRowEmpty } from '@/components/organism/CoreTable/components/TableRowEmpty'
import { TableRowLoading } from '@/components/organism/CoreTable/components/TableRowLoading'
import { BACK_GROUND, WHITE } from '@/helper/colors'
import { useAppSelector } from '@/redux/hook'
import { TRANSLATE } from '@/routes'
import styled from '@emotion/styled'
import {
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import _ from 'lodash'
import { useTranslation } from 'next-i18next'
import { ReactElement, ReactNode } from 'react'
import { useRecoilValue } from 'recoil'
import PaginationCustom from '../CoreTablePagination'
import { CellContent } from './components/CellContent'

export type ColumnProps = {
  header: ReactNode | string
  fieldName: string
  render?: (val: any, index: number) => ReactNode
  styleCell?: TableCellProps
  columnCell?: TableCellProps
}

export type PaginationTableProps = {
  page?: number
  size?: number
}

export type CoreTableProps = {
  refTableContainer?: any
  tableName?: string
  className?: string
  data: Record<string, any>[]
  columns: ColumnProps[]
  page?: number
  size?: number
  totalPages?: number
  paginationHidden?: boolean
  isLoading?: boolean
  isShowColumnStt?: boolean
  stickyHeader?: boolean
  maxHeight?: number
  isShowNoDataText?: boolean
  actionTable?: null | ReactElement
  onChangePageSize?: (val: PaginationTableProps) => void
  onRowClick?: (id: number, row?: any) => void
  isDoubleClick?: boolean
}

export const TableHeadCommon = styled(TableHead)(
  ({ layout = 'Layout1' }: { layout?: 'Layout1' | 'Layout2' }) => ({
    backgroundColor: layout === 'Layout1' ? BACK_GROUND : WHITE,
    ...(layout === 'Layout1' ? {} : { borderBottom: '2px solid #A7A7A7' }),
  })
)

export const TableContainerCommon = styled(TableContainer)(
  ({ layout = 'Layout1' }: { layout?: 'Layout1' | 'Layout2' }) => ({
    boxShadow: 'none!important',
    borderRadius: layout === 'Layout1' ? '4px 4px 0px 0px' : '10px',
    ...(layout === 'Layout1' ? { border: '1px solid #DFE0EB' } : {}),
  })
)

export const CoreTable = ({
  className,
  tableName,
  data,
  columns,
  page = 0,
  size = 20,
  totalPages,
  paginationHidden,
  isLoading,
  isShowColumnStt = false,
  maxHeight,
  isShowNoDataText = true,
  actionTable,
  stickyHeader = false,
  onChangePageSize,
  onRowClick,
  isDoubleClick,
}: CoreTableProps) => {
  const { t } = useTranslation(TRANSLATE.COMMON)

  const layout = useRecoilValue(layoutType)

  const dataColumn = isShowColumnStt
    ? [
        {
          header: t('table.no') ?? 'No',
          fieldName: 'index',
        },
        ...columns,
      ]
    : columns

  if (isShowColumnStt) {
    data = data.map((item: any, index: number) => {
      const noNumber = page * size + index + 1
      return {
        ...item,
        index: noNumber > 9 ? noNumber : `0${noNumber}`,
      }
    })
  }

  const listTableCache = useAppSelector((state) => state.tableConfigData)
  const tableCurrent = listTableCache.find(
    (item) => item.tableName === tableName
  )
  const columnsChecked = tableCurrent
    ? tableCurrent.columns.map((item) =>
        dataColumn.find((ele) => ele.fieldName === item)
      )
    : dataColumn

  return (
    <div className={className} style={{ position: 'relative' }}>
      <ChangeSttColumn
        tableName={tableName}
        columnsChecked={columnsChecked}
        columns={dataColumn}
      />

      <TableContainerCommon
        layout={layout}
        style={{
          maxHeight: `${maxHeight}px`,
        }}
      >
        <Table
          aria-label='sticky table'
          stickyHeader={stickyHeader}
          sx={{ minWidth: 650 }}
        >
          <TableHeadCommon layout={layout}>
            <TableRow>
              {_.map(columnsChecked, (column, index) => (
                <TableCell
                  variant='head'
                  key={index}
                  {...(column?.styleCell ?? {})}
                  style={{
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    minWidth: index !== 0 ? 200 : 70,
                    fontWeight: 600,
                    backgroundColor: '#f0f3f7',
                    ...column?.styleCell?.style,
                  }}
                >
                  {column?.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeadCommon>

          <TableBody>
            {isLoading && <TableRowLoading colSpan={columnsChecked.length} />}

            {!isLoading && data?.length === 0 && (
              <TableRowEmpty
                colSpan={columnsChecked.length}
                isShowNoDataText={isShowNoDataText}
              />
            )}

            {!isLoading &&
              _.map(data, (row: any, index) => (
                <TableRow
                  key={row?.key || row?.id || index}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                    '&:hover': { backgroundColor: '#b2e4f9' },
                  }}
                  {...(isDoubleClick
                    ? {
                        onDoubleClick: () => {
                          onRowClick && onRowClick(row?.id, row)
                        },
                      }
                    : {
                        onClick: () => {
                          onRowClick && onRowClick(row?.id, row)
                        },
                      })}
                >
                  {_.map(columnsChecked, (column, indexColumn) => {
                    return (
                      <TableCell
                        {...(column?.columnCell ?? {})}
                        key={indexColumn}
                        style={{
                          borderBottom:
                            index !== data.length - 1
                              ? '1px solid rgba(224, 224, 224, 1)'
                              : '',
                        }}
                      >
                        <CellContent
                          row={row}
                          render={column?.render}
                          fieldName={column?.fieldName}
                        />
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {actionTable}
      </TableContainerCommon>

      {!paginationHidden && (
        <div className='py-5'>
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
  )
}
