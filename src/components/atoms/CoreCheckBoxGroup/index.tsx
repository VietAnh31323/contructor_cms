import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormGroupProps,
  styled,
} from '@mui/material'
import { useRouter } from 'next/router'
import { forwardRef, ReactNode } from 'react'
import { Controller } from 'react-hook-form'

type Option = {
  value: string | number | boolean
  label: ReactNode
}

type CoreCheckboxGroupProps = {
  name: string
  control: any
  options: Option[]
  defaultValue?: Array<string | number | boolean>
  disabled?: boolean
  isViewProp?: boolean
  readOnly?: boolean
  onChangeValue?: (
    values: Array<string | number | boolean>,
    changedOption: Option
  ) => void
} & FormGroupProps

const CheckboxGroupWrapper = styled(FormGroup)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '30px',
  justifyContent: 'center',
  cursor: 'pointer',
}))

const CoreCheckboxGroup = forwardRef<HTMLDivElement, CoreCheckboxGroupProps>(
  function CheckboxGroupCustom({
    name,
    control,
    options,
    disabled = false,
    readOnly = false,
    defaultValue,
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
        render={({ field: { value = [], onChange } }) => (
          <CheckboxGroupWrapper {...props}>
            {options.map((option) => {
              const isChecked = value?.includes(option.value)

              return (
                <FormControlLabel
                  key={option.value.toString()}
                  label={option.label}
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={(e, checked) => {
                        if (isView || readOnly) return // chỉ chặn khi view/readOnly
                        let newValue: typeof value

                        if (checked) {
                          newValue = [...value, option.value]
                        } else {
                          newValue = value.filter(
                            (v: any) => v !== option.value
                          )
                        }

                        onChange(newValue)
                        if (onChangeValue) onChangeValue(newValue, option)
                      }}
                      disabled={disabled} // chỉ disabled khi props disabled
                    />
                  }
                />
              )
            })}
          </CheckboxGroupWrapper>
        )}
      />
    )
  }
)

export default CoreCheckboxGroup
