export interface MessageProps {
  status: 'error' | 'warning' | 'info' | 'valid'
  error?: string
  warning?: string
  info?: string
  valid?: string
  idParent: string
}
