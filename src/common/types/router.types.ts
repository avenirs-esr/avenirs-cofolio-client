import type {
  RouteLocationRaw,
  RouteRecordMultipleViews,
  RouteRecordMultipleViewsWithChildren,
  RouteRecordSingleView,
  RouteRecordSingleViewWithChildren,
} from 'vue-router'

export type AvRoute =
  | (Omit<RouteRecordSingleView, 'name'> & { name: string })
  | (Omit<RouteRecordSingleViewWithChildren, 'name'> & { name: string })
  | (Omit<RouteRecordMultipleViews, 'name'> & { name: string })
  | (Omit<RouteRecordMultipleViewsWithChildren, 'name'> & { name: string })

export interface BreadcrumbLinkRaw {
  to?: RouteLocationRaw
  textKey: string
}

export interface RoutePageProps {
  breadcrumbLinksRaw?: BreadcrumbLinkRaw[]
}
