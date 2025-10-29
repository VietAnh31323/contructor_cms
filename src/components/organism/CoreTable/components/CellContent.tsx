import { CurrencyFormatCustom } from '@/components/atoms/CurrencyFormatCustom'
import { useDate } from '@/components/hooks/date/useDate'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Typography } from '@mui/material'
import _ from 'lodash'

type Props = {
  row: any
  render?: any
  fieldName?: string
  open?: boolean
  handleClick?: any
  nameCheck?: string
  isCheckCode?: boolean
}

export const CellContent = (props: Props) => {
  const { render, row, fieldName, handleClick, open, isCheckCode } = props
  const { checkDateValid, convertToDate } = useDate()

  const handleClickCell = (e: React.MouseEvent<HTMLDivElement>) => {
    if (handleClick) {
      handleClick(row)
      e.stopPropagation()
    }
  }

  if (row && render) {
    return render(row)
  }

  if (row && fieldName) {
    const val = _.get(row, fieldName)

    if (fieldName === 'code' && isCheckCode)
      return (
        <div
          className='flex items-center gap-2 z-10'
          onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClickCell(e)}
        >
          <Typography>{val}</Typography>
          <KeyboardArrowDownIcon
            fontSize='small'
            style={{ transform: open ? 'rotate(180deg)' : undefined }}
          />
        </div>
      )

    if (_.isNumber(val)) return <CurrencyFormatCustom amount={val} />

    if (checkDateValid(val)) return convertToDate(val)

    return val
  }

  return null
}
