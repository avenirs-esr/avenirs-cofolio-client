import type {
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
