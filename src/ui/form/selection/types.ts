export type CheckboxProps = {
  id: string
  size?: 'sm' | 'md'
  label: string
  name?: string
  disabled?: boolean
  hint?: string
  status?: 'valid' | 'error'
  validMessage?: string
  errorMessage?: string
}

export type RadioProps = {
  id: string
  size?: 'sm' | 'md'
  label: string
  name?: string
  disabled?: boolean
  hint?: string
  rich?: boolean
}
