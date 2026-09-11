import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const studentSelfKnowledgeCategoryRoute: AvRoute = {
  ...ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY,
  props: route => ({
    categoryId: route.params.id,
  }),
  component: () =>
    import('@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/SelfKnowledgeCategoryView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.BUILD_PROJECT,
      META_BREADCRUMBS.STUDENT.PROJECT.SELF_KNOWLEDGE,
    ]
  }
}

export const studentSelfKnowledgeElementUpdateRoute: AvRoute = {
  ...ROUTES.STUDENT.SELFKNOWLEDGE_ELEMENT_UPDATE,
  props: route => ({
    categoryId: route.params.categoryId,
    elementId: route.params.elementId,
  }),
  component: () =>
    import('@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/SelfKnowledgeElementUpdateView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.BUILD_PROJECT,
      META_BREADCRUMBS.STUDENT.PROJECT.SELF_KNOWLEDGE,
    ]
  }
}
