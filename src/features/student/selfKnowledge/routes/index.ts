import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const studentSelfKnowledgeCategoryRoute: AvRoute = {
  ...ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY,
  props: route => ({
    categoryId: route.params.id,
  }),
  component: () =>
    import('@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/SelfKnowledgeCategoryView.vue'),
}

export const studentSelfKnowledgeElementUpdateRoute: AvRoute = {
  ...ROUTES.STUDENT.SELFKNOWLEDGE_ELEMENT_UPDATE,
  props: route => ({
    categoryId: route.params.categoryId,
    elementId: route.params.elementId,
  }),
  component: () =>
    import('@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/SelfKnowledgeElementUpdateView.vue'),
}
