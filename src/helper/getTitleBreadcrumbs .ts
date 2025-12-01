export const getTitleBreadcrumbs = (
  t: any,
  isView?: boolean,
  isUpdate?: boolean,
  code?: string,
  isCopy = false
) => {
  if (isView) return code
  if (isUpdate) return t('common:btn.edit')
  if (isCopy) return t('common:btn.copy')

  return t('common:btn.add')
}
