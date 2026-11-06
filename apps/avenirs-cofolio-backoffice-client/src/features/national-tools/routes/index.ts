import type { AvRoute } from '@avenirs-esr/shared'
import { BASE_BREADCRUMBS, ROUTES } from '@/constants'

export const nationalToolsRoute: AvRoute = {
  ...ROUTES.NATIONAL_TOOLS,
  component: () => import('@/features/national-tools/views/NationalToolsView/NationalToolsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.NATIONAL_TOOLS.BASE],
  },
}

export const nationalToolsRoutes = [
  nationalToolsRoute,
]
