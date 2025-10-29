import {
  FormControlLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
  styled,
} from '@mui/material'
import { forwardRef, ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import { useRouter } from 'next/router'

type Option = {
  value: string | number | boolean
  label: ReactNode
}

type CoreRadioGroupProps = {
  name: string
  control: any
  options: Option[]
  defaultValue?: string | number
  disabled?: boolean
  readOnly?: boolean
  isViewProp?: boolean
  onChangeValue?: (value: string | number | boolean, option: Option) => void
} & RadioGroupProps

const RadioGroupCommon = styled(RadioGroup)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '30px',
  justifyContent: 'center',
  cursor: 'pointer',
}))

const CoreRadioGroup = forwardRef<HTMLDivElement, CoreRadioGroupProps>(
  function RadioCustom({
    control,
    name,
    options,
    defaultValue,
    disabled = false,
    readOnly = false,
    isViewProp,
    onChangeValue,
    ...props
  }) {
    const router = useRouter()
    const { actionType } = router.query
    const isView = isViewProp ?? actionType === 'VIEW'

    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value: fieldValue, ...restField } }) => (
          <RadioGroupCommon {...props} {...restField} value={fieldValue}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value.toString()}
                label={option.label}
                value={option.value}
                control={
                  <Radio
                    checked={fieldValue === option.value}
                    onChange={(e) => {
                      if (isView || readOnly) return // chặn khi view/readonly
                      onChange(e)
                      if (onChangeValue) onChangeValue(option.value, option)
                    }}
                    disabled={disabled} // chỉ disable khi props disabled
                  />
                }
              />
            ))}
          </RadioGroupCommon>
        )}
      />
    )
  }
)

export default CoreRadioGroup
