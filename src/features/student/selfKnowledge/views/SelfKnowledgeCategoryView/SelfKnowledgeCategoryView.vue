<script setup lang="ts">
import type { Ref } from 'vue'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import SelfKnowledgeElementDetailsContainer
  from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.vue'
import SelfKnowledgeElementsSideMenu
  from '@/features/student/selfKnowledge/components/navigation/SelfKnowledgeElementsSideMenu/SelfKnowledgeElementsSideMenu.vue'
import SelfKnowledgeElementTabs
  from '@/features/student/selfKnowledge/components/tabs/SelfKnowledgeElementTabs/SelfKnowledgeElementTabs.vue'
import { useSelfKnowledgeCategory }
  from '@/features/student/selfKnowledge/composables/use-self-knowledge-category/use-self-knowledge-category'
import {
  useSelfKnowledgePaginatedElements
} from '@/features/student/selfKnowledge/composables/use-self-knowledge-paginated-elements/use-self-knowledge-paginated-elements'
import {
  useSelfKnowledgeElementDetailsQuery
} from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import SelfKnowledgeElementDetails
  from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetails/SelfKnowledgeElementDetails.vue'
import SelfKnowledgeElementDetailsDropdown
  from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetailsDropdown/SelfKnowledgeElementDetailsDropdown.vue'
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

const { element: selectedElementDetails }
  = useSelfKnowledgeElementDetailsQuery({ selfKnowledgeElementId: selectedElementId })

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
  <div class="self-knowledge-category-elements-view av-row av-gap-sm">
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

      <SelfKnowledgeElementTabs :category-type="categoryType">
        <template #element>
          <SelfKnowledgeElementDetails
            v-if="selectedElementDetails"
            :element="selectedElementDetails"
          />
        </template>
        <template #associations>
          Element associations placeholder
        </template>
      </SelfKnowledgeElementTabs>
    </SelfKnowledgeElementDetailsContainer>
  </div>
</template>
