import type { DsfrLanguageSelectorProps, VIcon } from '@gouvminint/vue-dsfr'
import type { HTMLAttributes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export interface AvHeaderMenuLinkProps {
  button?: boolean
  icon?: string | InstanceType<typeof VIcon>['$props']
  iconAttrs?: InstanceType<typeof VIcon>['$props'] & HTMLAttributes
  iconRight?: boolean
  label?: string
  target?: string
  onClick?: ($event: MouseEvent) => void
  to?: RouteLocationRaw
  path?: string
}

export interface AvHeaderProps {
  searchbarId?: string
  serviceTitle?: string
  serviceDescription?: string
  homeTo?: string | RouteLocationRaw
  logoText?: string | string[]
  modelValue?: string
  placeholder?: string
  quickLinks?: (AvHeaderMenuLinkProps & HTMLAttributes)[]
  languageSelector?: DsfrLanguageSelectorProps
  searchLabel?: string
  quickLinksAriaLabel?: string
  showSearch?: boolean
  showSearchLabel?: string
  showBeta?: boolean
  menuLabel?: string
  menuModalLabel?: string
  closeMenuModalLabel?: string
  homeLabel?: string
}
