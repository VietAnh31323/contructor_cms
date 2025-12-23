import { CoreDialog } from '@/components/organism/CoreDialog'
import { ExtensionChecking, GetExtension } from '@/helper/utils'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import CoreSlider from '../CoreSlider'

export const DialogSwiper = ({
  contents,
  mainIndex,
  hideDialog,
  rightAction,
}: {
  contents: { name: string; src: string }[]
  mainIndex?: number
  hideDialog: () => void
  rightAction?: JSX.Element | null
}) => {
  const [curName, setCurName] = useState(contents[mainIndex ?? 0]?.name)

  return (
    <CoreDialog
      onClose={() => {
        hideDialog()
      }}
      title={
        <div className='w-full h-28 bg-[#292828] flex items-center fixed top-0 justify-between'>
          <div className='flex items-center space-x-4'>
            <IconButton sx={{ color: 'white' }} onClick={hideDialog}>
              <ArrowBackIcon />
            </IconButton>

            {ExtensionChecking(GetExtension(curName))}
            <Typography sx={{ color: 'white' }}>{curName}</Typography>
          </div>

          <div className='space-x-4'>{rightAction}</div>
        </div>
      }
      PaperProps={{
        style: {
          width: '100%',
          minWidth: `100vw`,
          maxWidth: `100vw`,
          minHeight: '100vh',
          overflowY: 'auto',
          backgroundColor: 'transparent',
        },
      }}
    >
      <CoreSlider
        mainIndex={mainIndex}
        contents={contents}
        setCurName={setCurName}
      />
    </CoreDialog>
  )
}
