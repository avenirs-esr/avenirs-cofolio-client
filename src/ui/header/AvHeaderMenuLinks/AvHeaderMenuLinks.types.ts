import type { DsfrHeaderMenuLinkProps } from '@gouvminint/vue-dsfr'

export interface AvHeaderMenuLinksProps {
  links?: Pick<DsfrHeaderMenuLinkProps, 'label' | 'icon' | 'onClick'>[]
  navAriaLabel?: string
}
