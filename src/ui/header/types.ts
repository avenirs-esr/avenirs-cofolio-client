import type { DsfrHeaderProps } from '@gouvminint/vue-dsfr'
import type { Component } from 'vue'

export type AvHeaderProps = {
  customLogo?: string
  customLogoAlt?: string
  mainNav: Component
} & Pick<
  DsfrHeaderProps,
  | 'showSearch'
  | 'logoText'
  | 'serviceTitle'
  | 'serviceDescription'
  | 'modelValue'
  | 'placeholder'
  | 'homeTo'
  | 'quickLinks'
  | 'searchbarId'
  | 'searchLabel'
  | 'quickLinksAriaLabel'
  | 'showSearchLabel'
>
