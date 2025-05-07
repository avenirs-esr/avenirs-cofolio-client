import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'

export type AvButtonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'tertiary-no-outline'
  isLoading?: boolean
} & Pick<DsfrButtonProps, 'label' | 'disabled' | 'size' | 'icon' | 'iconRight' | 'iconOnly' | 'onClick'>

export type AvIconButtonProps = { icon: string } & Omit<AvButtonProps, 'iconOnly' | 'iconRight'>
