import { IconButton } from '@mui/material'
import { memo } from 'react'

const BlankFileIcon = () => {
  return (
    <IconButton>
      <svg width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.707 6.793L13.207 0.293C13.019 0.105 12.765 0 12.5 0H2C0.895 0 0 0.895 0 2V24C0 25.105 0.895 26 2 26H18C19.105 26 20 25.105 20 24V7.5C20 7.235 19.895 6.981 19.707 6.793ZM13 8C12.448 8 12 7.552 12 7V1.904L18.096 8H13Z" fill="black" fill-opacity="0.541176" />
      </svg>
    </IconButton>
  )
}

export default memo(BlankFileIcon)
