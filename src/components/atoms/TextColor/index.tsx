export interface Type {
  label: string
  value: string
  color?: string
}

export const getEnum = (value?: string, types?: Type[]): JSX.Element | null => {
  const type = types?.find((type) => type.value === value)
  if (type) {
    const labelStyle: React.CSSProperties = {
      color: type.color,
    }
    return <span style={labelStyle}>{type.label}</span>
  }
  return null
}
