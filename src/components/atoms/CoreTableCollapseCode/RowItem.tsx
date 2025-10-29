import { ColumnProps, CoreTable } from '@/components/organism/CoreTable'
import { CellContent } from '@/components/organism/CoreTable/components/CellContent'
import PageWithDetail from '@/components/organism/PageWithDetail'
import { Collapse, TableBody, TableCell, TableRow } from '@mui/material'
import _ from 'lodash'
import { useId, useState } from 'react'

type Props = {
  index: number
  rowParent: any
  columnsChecked: any
  columnsChild: ColumnProps[]
  columns: ColumnProps[]
  handleOpen?: (id: number, row?: any) => void
  onRowClick?: (id: number, row?: any) => void
  itemId: number
  isActive?: boolean
  dataChild: any[]
  isCheckCode?: boolean
  fetchDataFn?: (val: any) => Promise<any>
  params?: any
  onChangData?: (data: any) => void
}

export default function RowItem(props: Readonly<Props>) {
  const {
    index,
    rowParent,
    columnsChecked,
    columnsChild,
    columns,
    onRowClick,
    itemId,
    isCheckCode = false,
    dataChild,
    fetchDataFn,
    params,
    onChangData,
  } = props

  const [open, setOpen] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const key = useId()

  const handleClick = () => {
    if (!open) {
      setOpen(true)
      // fetch API chỉ 1 lần duy nhất
      if (fetchDataFn && data.length === 0) {
        setIsLoading(true)
        fetchDataFn({ ...params, id: itemId })
          .then((res) => {
            setData(res)
            onChangData?.(res)
          })
          .finally(() => setIsLoading(false))
      }
    } else {
      setOpen(false)
    }
  }

  return (
    <TableBody key={key}>
      <TableRow
        data-type={index % 2 === 1}
        key={rowParent?.key || rowParent?.id || index}
        sx={{
          cursor: 'pointer',
          backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
          '&:hover': { backgroundColor: '#b2e4f9' },
        }}
        onClick={() => {
          onRowClick && onRowClick(rowParent?.id, rowParent)
        }}
      >
        {_.map(columnsChecked, (column, indexColumn) => (
          <TableCell key={indexColumn}>
            <CellContent
              row={rowParent}
              render={column?.render}
              fieldName={column?.fieldName}
              open={open}
              handleClick={handleClick}
              isCheckCode={isCheckCode}
            />
          </TableCell>
        ))}
      </TableRow>
      {open && (
        <TableRow>
          <TableCell colSpan={columns.length + 1} style={{ maxWidth: 0 }}>
            <Collapse in={open}>
              <PageWithDetail tabName='Danh sách trạng thái' isHeight>
                <CoreTable
                  data={dataChild}
                  columns={columnsChild}
                  isShowColumnStt
                  paginationHidden
                  isLoading={isLoading}
                />
              </PageWithDetail>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
