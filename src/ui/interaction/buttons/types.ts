export interface AvButtonProps {
  label: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'tertiary-no-outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconOnly?: boolean
  iconRight?: boolean
  disabled?: boolean
  isLoading?: boolean
  onClick: (event: MouseEvent) => void
}

export type AvIconButtonProps = { icon: string } & Omit<AvButtonProps, 'iconOnly' | 'iconRight'>
