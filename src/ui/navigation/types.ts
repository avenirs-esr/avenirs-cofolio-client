import type {
  DsfrNavigationMegaMenuProps,
  DsfrNavigationMenuLinkProps,
  DsfrNavigationMenuProps,
} from '@gouvminint/vue-dsfr'

export interface AvNavigationProps {
  navItems: (DsfrNavigationMenuLinkProps | DsfrNavigationMenuProps | DsfrNavigationMegaMenuProps)[]
}

export interface AvNavItemProps { label: string, to: string, id?: string, icon?: string }

export interface AvNavProps { label?: string, id?: string }

export interface AvNavMenuProps { title: string, href: string, icon?: string }

export interface NavProps {
  label?: string
  id?: string
}

export interface NavLinkProps { label: string, href: string, id?: string, icon?: string }

export interface NavMenuProps { label: string, href: string, id: string, icon?: string }
