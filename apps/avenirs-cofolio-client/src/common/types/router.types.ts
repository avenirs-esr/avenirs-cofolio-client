import type {
  RouteRecordMultipleViews,
  RouteRecordMultipleViewsWithChildren,
  RouteRecordSingleView,
  RouteRecordSingleViewWithChildren,
} from 'vue-router'
import type { ERole } from '@/api/avenir-esr'

export type AvRoute
  = | (Omit<RouteRecordSingleView, 'name'> & { name: string })
    | (Omit<RouteRecordSingleViewWithChildren, 'name'> & { name: string })
    | (Omit<RouteRecordMultipleViews, 'name'> & { name: string })
    | (Omit<RouteRecordMultipleViewsWithChildren, 'name'> & { name: string })

// `meta.cguRouteName` is declared on each universe layout record: Vue Router merges meta along the whole
// matched chain, so every child inherits it and the global cgu guard applies to all navigations inside the universe.
declare module 'vue-router' {
  interface RouteMeta {
    cguRouteName?: string
    requiredRoles?: ERole[]
  }
}
