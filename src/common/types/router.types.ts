import type {
  RouteLocationNormalizedLoaded,
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
  to?: RouteLocationRaw | ((route: RouteLocationNormalizedLoaded) => RouteLocationRaw)
  textKey: string
}

// Enables typed `meta.breadcrumb` on route records so breadcrumbs can be declared where routes are defined.
declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb?: BreadcrumbLinkRaw[]
  }
}
