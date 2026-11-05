import type { AvRoute } from '@avenirs-esr/shared'
import { BASE_BREADCRUMBS, ROUTES } from '@/constants'

export const globalAlertUpdateRoute: AvRoute = {
  ...ROUTES.GLOBAL_ALERT.UPDATE,
  component: () => import('@/features/global-alert/views/AlertUpdateView/AlertUpdateView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.GLOBAL_ALERT.BASE],
  },
}

export const globalAlertRoutes = [
  globalAlertUpdateRoute,
]
