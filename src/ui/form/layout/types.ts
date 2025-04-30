export interface FieldsetProps {
  legend: string
  hint?: string
  disabled?: boolean
  inline?: boolean
  status?: 'valid' | 'error'
  validMessage?: string
  errorMessage?: string
  id: string
}

export interface FieldsetElementProps {
  size?: 'inline-grow' | 'number' | 'postal' | 'year'
}
