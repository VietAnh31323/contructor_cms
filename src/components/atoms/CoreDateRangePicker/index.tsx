import { DEFAULT_FORMAT_DATE } from '@/components/hooks/date/useDate'
import { useAppSelector } from '@/redux/hook'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { Box, IconButton, InputAdornment, TextFieldProps } from '@mui/material'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Dayjs } from 'dayjs'
import { useRouter } from 'next/router'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface CoreDateRangePickerProps {
  control: any
  name: string
  label: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  isViewProp?: boolean
  placeholder?: string
  helperText?: string
  rules?: any
  size?: 'small' | 'medium'
  variant?: 'standard'
  defaultValue?: [Dayjs | null, Dayjs | null]
}

export const CoreDateRangePicker = ({
  control,
  name,
  label,
  required,
  disabled,
  readOnly,
  isViewProp,
  placeholder,
  helperText,
  rules,
  size = 'small',
  variant = 'standard',
  defaultValue = [null, null],
}: CoreDateRangePickerProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { actionType } = router.query

  const isView = isViewProp ?? actionType === 'VIEW'
  const { dateType = DEFAULT_FORMAT_DATE } = useAppSelector(
    (state) => state.companyConfigData
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en'>
      {/* <DemoContainer components={['SingleInputDateRangeField']}> */}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={!isView ? rules : {}}
        render={({ field, fieldState: { error } }) => (
          <Box>
            <DateRangePicker
              disableOpenPicker={isView}
              value={field.value || [null, null]}
              onChange={(newValue: [Dayjs | null, Dayjs | null]) =>
                field.onChange(newValue)
              }
              readOnly={isView || readOnly}
              disabled={disabled}
              slots={{ field: SingleInputDateRangeField }}
              format={dateType}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size,
                  variant,
                  label,
                  readOnly: isView || readOnly,
                  error: !!error,
                  helperText: error?.message || helperText,
                  InputLabelProps: {
                    shrink: true,
                    required,
                  },
                  inputProps: {
                    readOnly: isView || readOnly,
                    placeholder: 'DD/MM/YYYY - DD/MM/YYYY',
                  },
                  InputProps: {
                    disableUnderline: isView,
                    endAdornment: (
                      <InputAdornment position='end'>
                        {!isView && (
                          <IconButton>
                            <CalendarTodayIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  },
                } as Partial<TextFieldProps>,
              }}
            />
          </Box>
        )}
      />
      {/* </DemoContainer> */}
    </LocalizationProvider>
  )
}
