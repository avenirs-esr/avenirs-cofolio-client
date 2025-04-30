export interface LinkProps {
  label: string
  size?: 'sm' | 'md' | 'lg'
  href: string
  id?: string
  hasIcon?: boolean
  icon?: string
  iconPlace?: 'left' | 'right'
  disabled?: boolean
  external?: boolean
  download?: boolean
  downloadDetail?: string
  downloadHreflang?: string
  downloadAssess?: boolean
}

export type BackToTopLinkProps = Pick<LinkProps, 'size' | 'id' | 'disabled'>

export type DownloadLinkProps = Omit<LinkProps, 'href' | 'hasIcon' | 'icon' | 'iconPlace' | 'external' | 'download'>

export type ExternalLinkProps = Omit<
  LinkProps,
  'hasIcon' | 'external' | 'download' | 'downloadDetail' | 'downloadHreflang' | 'downloadAssess'
>

export type TextIconLinkProps = { icon: string } & Omit<
  LinkProps,
  'hasIcon' | 'icon' | 'external' | 'download' | 'downloadDetail' | 'downloadHreflang' | 'downloadAssess'
>

export type TextLinkProps = Omit<
  LinkProps,
  'hasIcon' | 'icon' | 'iconPlace' | 'external' | 'download' | 'downloadDetail' | 'downloadHreflang' | 'downloadAssess'
>
