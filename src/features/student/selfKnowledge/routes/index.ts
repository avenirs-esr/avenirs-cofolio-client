import type { AvRoute } from '@/common/types'
import { ROUTE_NAMES } from '@/common/constants'

export const studentSelfKnowledgeCategoriesRoute: AvRoute = {
  ...ROUTE_NAMES.STUDENT.SELFKNOWLEDGE_CATEGORIES,
  props: route => ({
    categoryType: route.params.id,
  }),
  component: () =>
    import('@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/SelfKnowledgeCategoryView.vue'),
}
