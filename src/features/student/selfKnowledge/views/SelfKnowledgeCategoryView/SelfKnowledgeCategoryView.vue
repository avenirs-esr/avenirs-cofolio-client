<script setup lang="ts">
import type { Ref } from 'vue'
import { useGetSelfKnowledgeElementDetails } from '@/api/avenir-esr'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useNavigation, useQueryParamEnum } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes, ROUTES } from '@/common/constants'
import SelfKnowledgeElementDetailsContainer from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.vue'
import SelfKnowledgeElementsSideMenu from '@/features/student/selfKnowledge/components/navigation/SelfKnowledgeElementsSideMenu/SelfKnowledgeElementsSideMenu.vue'
import { useSelfKnowledgeCategory } from '@/features/student/selfKnowledge/composables/use-self-knowledge-category/use-self-knowledge-category'
import { useSelfKnowledgePaginatedElements } from '@/features/student/selfKnowledge/composables/use-self-knowledge-paginated-elements/use-self-knowledge-paginated-elements'
import SelfKnowledgeElementDetails from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetails/SelfKnowledgeElementDetails.vue'
import SelfKnowledgeElementDetailsDropdown from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetailsDropdown/SelfKnowledgeElementDetailsDropdown.vue'
import { useRouteQuery } from '@vueuse/router'
import { useI18n } from 'vue-i18n'

interface SelfKnowledgeCategoryViewProps {
  categoryId: string
}

const props = defineProps<SelfKnowledgeCategoryViewProps>()

const { t } = useI18n()
const { navigateToStudentSelfKnowledgeElementUpdate } = useNavigation()

const { categoryType } = useSelfKnowledgeCategory(computed(() => props.categoryId))

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.trajectories'), to: ROUTES.STUDENT.PROJECT_TRAJECTORIES },
  { text: t('student.global.navigation.tabs.project.items.selfKnowledge') }
])

const selectedElementId: Ref<string> = useRouteQuery('elementId', '')

const {
  elements,
  pageInfo,
  loadMoreElements
} = useSelfKnowledgePaginatedElements({
  selfKnowledgeCategoryId: props.categoryId
})

const { data: selectedElementDetails, error } = useGetSelfKnowledgeElementDetails(selectedElementId)

const { originalErrorCode, isNotFound } = useApiErrors(error)
const isSelfKnowledgeNotFound = computed(() => originalErrorCode.value === ErrorCodes.SELF_KNOWLEDGE_ELEMENT_NOT_FOUND || isNotFound.value)

enum SelfKnowledgeCategoryTabs {
  DETAILS = 0,
  ASSOCIATIONS = 1
}
const activeElementTab = useQueryParamEnum(SelfKnowledgeCategoryTabs, 'tab')

function onSelectElement (elementId: string) {
  selectedElementId.value = elementId
}

function onUpdateSelected () {
  navigateToStudentSelfKnowledgeElementUpdate({
    categoryId: props.categoryId,
    elementId: selectedElementId.value
  })
}
</script>

<template>
  <DetailedPageTitle
    :title="selectedElementDetails?.title ?? ''"
    :breadcrumb-links="breadcrumbLinks"
  />

  <QuerySuspense :error="error">
    <template #error>
      <ErrorMessage
        v-if="error"
        :title="isSelfKnowledgeNotFound ? t('student.selfKnowledge.views.SelfKnowledgeCategoryView.errors.notFound.title') : t('global.error.generic')"
        :description="isSelfKnowledgeNotFound ? t('student.selfKnowledge.views.SelfKnowledgeCategoryView.errors.notFound.description') : error.message"
      />
    </template>

    <div
      v-if="selectedElementDetails"
      class="self-knowledge-category-elements-view av-row av-gap-sm"
    >
      <div class="av-col">
        <SelfKnowledgeElementsSideMenu
          :elements="elements"
          :category-type="categoryType"
          :selected-element-id="selectedElementId"
          :count-elements="pageInfo.totalElements"
          @select-element="onSelectElement"
          @load-more-elements="loadMoreElements"
        />
      </div>
      <SelfKnowledgeElementDetailsContainer>
        <template #title>
          <SelfKnowledgeElementDetailsDropdown
            @update-selected="onUpdateSelected"
          />
        </template>

        <SelfKnowledgeElementTabs
          v-model="activeElementTab"
          :category-type="categoryType"
        >
          <template #element>
            <SelfKnowledgeElementDetails :element="selectedElementDetails" />
          </template>
          <template #associations>
            Element associations placeholder
          </template>
        </SelfKnowledgeElementTabs>
      </SelfKnowledgeElementDetailsContainer>
    </div>
  </QuerySuspense>
</template>
