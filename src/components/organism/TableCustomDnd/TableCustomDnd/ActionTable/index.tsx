import { PRIMARY } from '@/helper/colors'
import { TableCell, TableRow, Typography } from '@mui/material'

// export const TableCellCommon = styled(TableCell)(() => ({
//   '&:first-of-type': {
//     borderLeft: '1px solid #DFE0EB',
//   },
//   '&:last-of-type': {
//     borderRight: '1px solid #DFE0EB',
//   },
// }))

type Props = {
  columns?: any
  append?: any
  defaultValueLine?: any
  action?: string
  handleAppend?: any
}

export const ActionTable = ({
  columns,
  append,
  defaultValueLine,
  action,
  handleAppend,
}: Props) => {
  if (!action) return null
  return (
    <TableRow>
      <TableCell colSpan={columns?.length + 1}>
        <div className='flex items-center gap-10 h-13 px-2'>
          <Typography
            variant='body1'
            style={{
              color: PRIMARY,
              cursor: 'pointer',
            }}
            onClick={() => {
              if (append) append(defaultValueLine)
              if (handleAppend) handleAppend()
            }}
          >
            {/* {!!action ? '' : action} */}
            {action ?? 'Thêm sản phẩm'}
          </Typography>
        </div>
      </TableCell>
    </TableRow>
  )
}
