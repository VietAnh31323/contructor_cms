import CoreSwitch from '@/components/atoms/CoreSwitch'
import { useDialog } from '@/components/hooks/dialog/useDialog'
import Identifier from '@/components/templates/common/Identifier/DialogIdentify/DialogIndentify'
import { GREEN, RED } from '@/helper/colors'
import { useFormCustom } from '@/lib/form'
import { useQueryGetInfoSecurity } from '@/service/uaa/accountSecure'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import { useEffect } from 'react'
import DialogConfirmSecure from './components/DialogConfirmSecure'

const AccountSecurity = ({ onClose }: { onClose: () => void }) => {
  const { control, watch, reset, setValue } = useFormCustom()

  const { data, refetch } = useQueryGetInfoSecurity()

  const renderState = () => {
    const lv2IdState = watch('lv2IdState')
    if (lv2IdState === null || lv2IdState === 'NONE') {
      return <Typography color={RED}>Chưa xác thực</Typography>
    } else if (lv2IdState === 'APPROVAL_PENDING') {
      return <Typography color={'#FCBF49'}>Chờ xác thực</Typography>
    } else if (lv2IdState === 'APPROVAL') {
      return <Typography color={GREEN}>Đã xác thực</Typography>
    } else {
      return <Typography color={RED}>Chưa xác thực</Typography>
    }
  }

  const lv2Secure = watch('lv2Secure')

  useEffect(() => {
    if (data) {
      reset(data?.data)
    }
  }, [data?.data])

  const { showDialog } = useDialog()
  return (
    <form className="flex flex-col gap-10 w-155 h-full mx-10">
      <Box
        className="flex gap-5 mt-5"
        onClick={onClose}
        sx={{
          '&:hover': { cursor: 'pointer', color: '#0078D4' },
        }}
      >
        <ArrowBackIcon fontSize="small" />
        <Typography variant="h4">Tài khoản và bảo mật</Typography>
      </Box>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Box
            className="flex items-center gap-5"
            onClick={() => {
              showDialog(<Identifier />)
            }}
          >
            <Image
              src={require('@/assets/svg/layout1/ShieldCheck.svg')}
              alt=""
              width={16}
              className="hover:cursor-pointer"
            />
            <Typography
              sx={{
                ':hover': {
                  cursor: 'pointer',
                  color: '#0078D4',
                },
              }}
            >
              Định danh tài khoản cấp 2
            </Typography>
          </Box>
          {renderState()}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Image
              src={require('@/assets/svg/layout1/LockLaminated.svg')}
              alt=""
              width={16}
            />
            <Typography>Bảo mật 2 lớp</Typography>
          </div>
          <CoreSwitch
            control={control}
            name="lv2Secure"
            value={lv2Secure}
            label=""
            onChangeValue={() => {
              showDialog(
                <DialogConfirmSecure
                  refetch={() => {
                    setValue('lv2Secure', null)
                    refetch()
                  }}
                  state={lv2Secure}
                />,
              )
            }}
          />
        </div>
      </div>
    </form>
  )
}

export default AccountSecurity
