export const getTitleBreadcrumbs = (
  t: any,
  isView: boolean,
  isUpdate: boolean,
  isCopy?: boolean,
) => {
  if (isView) return t('common:btn.detail')
  if (isCopy) return t('common:btn.add')
  if (isUpdate) return t('common:btn.edit')
  return t('common:btn.add')
}

export const getLabelByValue = (value: string | null, options: any[]) => {
  const option = options.find((opt) => opt.value === (value ?? null))
  return option ? option.label : ''
}

export const findFirstError = (errors: any): any => {
  for (const key in errors) {
    if (errors[key]?.type) {
      return key
    }
    if (typeof errors[key] === 'object' && errors[key] !== null) {
      const nestedErrorKey = findFirstError(errors[key])
      if (nestedErrorKey) {
        return `${key}.${nestedErrorKey}`
      }
    }
  }
  return null
}
