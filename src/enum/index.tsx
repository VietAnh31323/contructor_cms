import { GREEN, RED } from '@/helper/colors'
import { Typography } from '@mui/material'

export const State = [
  {
    label: 'Nháp',
    value: 'DRAFT',
  },
  {
    label: 'Chờ phê duyệt',
    value: 'PENDING',
  },
  {
    label: 'Phê duyệt',
    value: 'APPROVED',
  },
  {
    label: 'Từ chối',
    value: 'REJECT',
  },
]

//'PENDING', 'APPROVED', 'REJECTED'
export const approveState = [
  {
    label: 'Chờ phê duyệt',
    value: 'PENDING',
  },
  {
    label: 'Phê duyệt',
    value: 'APPROVED',
  },
  {
    label: 'Từ chối',
    value: 'REJECTED',
  },
]

export const AttributeGroupState = [
  {
    label: 'Active',
    value: 'ACTIVE',
  },
  {
    label: 'Inactive',
    value: 'INACTIVE',
  },
]
export const FormalTypeState = [
  {
    label: 'Textbox',
    value: 'TEXT_BOX',
  },
  {
    label: 'Selectbox',
    value: 'SELECT_BOX',
  },
  {
    label: 'Multi-select',
    value: 'MULTI_SELECT',
  },
  {
    label: 'Radio',
    value: 'RADIO',
  },
  {
    label: 'Checkbox',
    value: 'CHECK_BOX',
  },
]
export const DataTypeState = [
  {
    label: 'string',
    value: 'STRING',
  },
  {
    label: 'int',
    value: 'INT',
  },
  {
    label: 'float',
    value: 'FLOAT',
  },
  {
    label: 'Date',
    value: 'DATE',
  },
]
export const ActiveState = [
  {
    label: 'Active',
    value: 'ACTIVE',
  },
  {
    label: 'Inactive',
    value: 'INACTIVE',
  },
]
export const approveStatus = (status: string, t?: any) => {
  if (status === 'REJECTED') {
    return <Typography color={'#FF4956'}>{t('Từ chối')}</Typography>
  } else if (status === 'APPROVED') {
    return <Typography color={'#00CC6A'}>{t('Đã phê duyệt')}</Typography>
  } else if (status === 'PENDING') {
    return <Typography color={'#F58020'}>{t('Chờ phê duyệt')}</Typography>
  }
  return ''
}

export const taskStatusLabel = {
  NOT_STARTED: 'Chưa thực hiện',
  IN_PROGRESS: 'Đang thực hiện',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Huỷ',
}

export const taskStatusColor = {
  NOT_STARTED: '#F58020',
  IN_PROGRESS: '#0078D4',
  COMPLETED: '#00CC6A',
  CANCELLED: '#FF4956',
}

export const priorityLevel = [
  {
    label: 'Cao',
    value: 'HIGH',
  },
  {
    label: 'Trung bình',
    value: 'MEDIUM',
  },
  {
    label: 'Thấp',
    value: 'LOW',
  },
]

export const systemStatus = [
  { label: 'Chưa bắt đầu', value: 'NOT_START', color: RED },
  { label: 'Đang thực hiện', value: 'IN_PROGRESS', color: '#F58020' },
  { label: 'Đã hoàn thành', value: 'COMPLETED', color: GREEN },
]


export const statusType = [
  {label: 'system', value: 'SYSTEM'},
  {label: 'business', value: 'BUSINESS'},
]
