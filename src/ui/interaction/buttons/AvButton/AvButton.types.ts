import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'

export type AvButtonProps = {
  variant?: 'DEFAULT' | 'OUTLINED'
  theme?: 'PRIMARY' | 'SECONDARY'
  isLoading?: boolean
} & Pick<DsfrButtonProps, 'label' | 'disabled' | 'size' | 'icon' | 'iconRight' | 'iconOnly' | 'onClick'>
