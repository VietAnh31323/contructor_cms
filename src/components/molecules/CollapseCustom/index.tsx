import { Collapse, Typography } from '@mui/material'
import React, { ReactNode, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

type Props = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export const CollapseCustom = ({
  title,
  children,
  defaultOpen = true,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <>
      <div
        className='flex justify-between items-center border-spacing-3 p-5 cursor-pointer bg-[#f3f4f7] mb-5'
        onClick={() => setOpen(!open)}
      >
        <Typography fontWeight={600}>{title}</Typography>
        <KeyboardArrowDownIcon
          fontSize='medium'
          className={`transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </div>
      <Collapse in={open}>{children}</Collapse>
    </>
  )
}
