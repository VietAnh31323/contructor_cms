import { CoreButton } from '@/components/atoms/CoreButton'
import { useDialog } from '@/components/hooks/dialog/useDialog'
import { CoreDialog } from '@/components/organism/CoreDialog'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDeleteDialog } from './useDialogDelete'

export const DialogDelete = ({
  id,
  name,
  fetchDataFn,
  URL,
  params,
}: {
  id: number
  name: string
  fetchDataFn: any
  URL: string
  params?: any
}) => {
  const { t } = useTranslation()
  const { hideDialog } = useDialog()
  const [_, handles] = useDeleteDialog(id, fetchDataFn, URL, params)
  const { onSubmit } = handles

  return (
    <CoreDialog
      title={t('common:btn.confirm')}
      onClose={hideDialog}
      width={500}
    >
      <Box className='flex justify-center max-w-[350px] m-auto align-middle text-center'>
        <Typography
          variant='subtitle1'
          style={{
            lineHeight: 1.5,

            marginTop: 12,
          }}
        >
          {t('common:dialog.deleteMessage', { name })}
        </Typography>
      </Box>
      <div className='flex justify-center gap-8 py-10'>
        <CoreButton
          theme='cancel'
          onClick={() => {
            hideDialog()
          }}
        >
          {t('common:btn.cancel')}
        </CoreButton>
        <CoreButton theme='submit' onClick={onSubmit}>
          {t('common:btn.agree')}
        </CoreButton>
      </div>
    </CoreDialog>
  )
}
