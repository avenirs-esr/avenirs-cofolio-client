import type { AvRoute } from '@/common/types'
import { ROUTE_NAMES } from '@/common/constants'

export const studentSelfKnowledgeCategoryRoute: AvRoute = {
  ...ROUTE_NAMES.STUDENT.SELFKNOWLEDGE_CATEGORY,
  props: route => ({
    categoryType: route.params.id,
  }),
  component: () =>
    import('@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/SelfKnowledgeCategoryView.vue'),
}
