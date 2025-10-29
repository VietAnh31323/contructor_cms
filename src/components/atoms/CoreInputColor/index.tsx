import { TRANSLATE } from '@/routes'
import { FormHelperText, OutlinedTextFieldProps, styled } from '@mui/material'
import { MuiColorInput } from 'mui-color-input'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props
  extends Omit<OutlinedTextFieldProps, 'variant' | 'label' | 'placeholder'> {
  className?: string
  control: any
  name: string
  label?: ReactNode
  placeholder?: any
  InputLabelProps?: any
  inputProps?: any
  InputProps?: any
  required?: boolean
  readOnly?: boolean
  type?: string
  multiline?: boolean
  minRows?: number
  disabled?: boolean
  hidden?: boolean
  helperText?: any
  rules?: any
  variant?: 'outlined' | 'filled' | 'standard'
  disableDecimal?: boolean
  disableNegative?: boolean
  onKeyPress?: any
  decimalScale?: number
  isHasMessageError?: boolean
  onAfterChangeValue?: any
  isViewProp?: boolean
  isAlphaHidden?: boolean
  hideLabel?: boolean
  onChangeValue?: (val: any) => void
}

const CoreInputColor = (props: Props) => {
  const {
    className,
    control,
    name,
    label,
    placeholder,
    inputProps,
    InputProps,
    required,
    readOnly,
    helperText,
    rules,
    variant = 'standard',
    isViewProp,
    hideLabel = false,
    isAlphaHidden = true,
  } = props

  const MuiColorInputStyled = styled(MuiColorInput)`
      & .MuiColorInput-Button {
          min-height: 5px;
          margin-bottom: 8px;
      }
  `

  const { t } = useTranslation(TRANSLATE.COMMON)

  const router = useRouter()
  const { actionType } = router.query
  const isView = isViewProp ?? actionType === 'VIEW'
  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={''}
        render={({ field, fieldState }) => (
          <>
            <MuiColorInputStyled
              style={{
                width: '100%',
              }}
              {...field}
              value={field.value ?? ''}
              onChange={(val: string) => field.onChange(val)}
              label={hideLabel ? undefined : label}
              placeholder={
                !isView
                  ? placeholder ||
                  t('form.input.placeholder', {
                    label: String(label)?.toLowerCase(),
                  }) ||
                  ''
                  : ''
              }
              required={required}
              variant={variant}
              isAlphaHidden={isAlphaHidden}
              format="hex"
              disabled={isView}
              inputProps={{
                readOnly: isView || readOnly,
                ...inputProps,
              }}
              InputProps={{
                disableUnderline: isView,
                ...InputProps,
              }}
              error={Boolean(fieldState.error)}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </>
        )}
        rules={!isView ? rules : {}}
      />
    </div>
  )
}

export default React.memo(CoreInputColor)
