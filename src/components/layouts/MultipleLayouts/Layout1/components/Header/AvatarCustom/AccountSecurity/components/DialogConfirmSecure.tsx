import { CoreButton } from '@/components/atoms/CoreButton'
import { useDialog } from '@/components/hooks/dialog/useDialog'
import { CoreDialog } from '@/components/organism/CoreDialog'
import { turnSecure } from '@/service/uaa/accountSecure'
import { toastError, toastSuccess } from '@/toast'
import { Typography } from '@mui/material'

const DialogConfirmSecure = ({
                               refetch,
                               state,
                             }: {
  refetch: any
  state: boolean
}) => {
  const { hideDialog } = useDialog()
  const onSubmit = async () => {
    try {
      const data = await turnSecure()
      toastSuccess(data?.message)
      hideDialog()
      refetch()
    } catch (e) {
      toastError(e)
    }
  }

  const onCancel = () => {
    hideDialog()
    refetch()
  }

  return (
    <CoreDialog
      title={state ? 'Tắt bảo mật 2 lớp' : 'Bảo mật 2 lớp'}
      width={448}
      onClose={onCancel}
    >
      <div className="flex flex-col gap-10 m-10 justify-center items-center">
        <Typography textAlign={'center'}>
          {state
            ? 'Apus Platform sẽ ngừng yêu cầu mã xác nhận khi đăng nhập trên thiết bị lạ.'
            : 'Apus Platform sẽ yêu cầu mã xác nhận khi tài khoản của bạn được đăng nhập trên thiết bị lạ.'}
        </Typography>
        <div className="flex gap-10">
          <CoreButton theme="cancel" onClick={onCancel}>
            Hủy
          </CoreButton>
          <CoreButton theme="submit" onClick={onSubmit}>
            Đồng ý
          </CoreButton>
        </div>
      </div>
    </CoreDialog>
  )
}

export default DialogConfirmSecure
