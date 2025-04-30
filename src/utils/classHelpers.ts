import { DSFR_ICONS } from './constants'

export function computeIconClass (hasIcon: boolean, icon: string | undefined, isLoading?: boolean): string | undefined {
  if (hasIcon && !!icon) {
    if (isLoading) {
      return DSFR_ICONS.REFRESH
    }
    return icon
  }
  return undefined
}

export function computeIconPlaceClass (
  hasIcon: boolean,
  icon: string | undefined,
  iconPlace: 'left' | 'right' | undefined,
  prefix: string
) {
  if (hasIcon && !!icon && !!iconPlace) {
    return `${prefix}--icon-${iconPlace}`
  }
  return undefined
}

export function computeSizeClass (size: 'sm' | 'md' | 'lg', prefix: string): string | undefined {
  return size === 'md' ? undefined : `${prefix}--${size}`
}
