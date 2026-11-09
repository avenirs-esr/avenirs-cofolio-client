import type { AvRoute } from '@avenirs-esr/shared'
import { BASE_BREADCRUMBS, ROUTES } from '@/constants'

export const globalAlertDetailsRoute: AvRoute = {
  ...ROUTES.GLOBAL_ALERT.DETAILS,
  component: () => import('@/features/global-alert/views/AlertDetailsView/AlertDetailsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.GLOBAL_ALERT.DETAILS],
  },
}

export const globalAlertUpdateRoute: AvRoute = {
  ...ROUTES.GLOBAL_ALERT.UPDATE,
  component: () => import('@/features/global-alert/views/AlertUpdateView/AlertUpdateView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.GLOBAL_ALERT.UPDATE],
  },
}

export const globalAlertRoutes = [
  globalAlertDetailsRoute,
  globalAlertUpdateRoute,
]
