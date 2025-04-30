export interface InputProps {
  label: string
  id: string
  groupId?: string
  type: 'date' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'text' | 'url'
  disabled?: boolean
  hint?: string
  textArea?: boolean
  icon?: string
  defaultValue?: string
  placeholder?: string
  status?: 'valid' | 'error'
  validMessage?: string
  errorMessage?: string
  inputName?: string
  autocomplete?: string
}

export type PasswordInpuProps = {
  autocomplete?: 'off' | 'current-password' | 'new-password'
  checkboxId: string
  checkboxLabel?: string
  checkboxAriaLabel?: string
  href?: string
  forgotLabel?: string
} & Pick<InputProps, 'label' | 'id'>
