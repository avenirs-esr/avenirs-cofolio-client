import type { RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router'

export interface BreadcrumbLinkRaw {
  to?: RouteLocationRaw | ((route: RouteLocationNormalizedLoaded) => RouteLocationRaw)
  textKey: string
}

export type MetaBreadcrumb = BreadcrumbLinkRaw | BreadcrumbLinkRaw[]
