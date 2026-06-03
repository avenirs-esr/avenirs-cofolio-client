<script lang="ts" setup>
import { useGetSelfKnowledgeElementDetails } from '@/api/avenir-esr'
import UpdatePageTitle from '@/common/components/UpdatePageTitle/UpdatePageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants/route-names'
import UpdateInProgressBadge from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import SelfKnowledgeElementDetailsContainer from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.vue'
import SelfKnowledgeElementsSideMenu from '@/features/student/selfKnowledge/components/navigation/SelfKnowledgeElementsSideMenu/SelfKnowledgeElementsSideMenu.vue'
import SelfKnowledgeElementTabs from '@/features/student/selfKnowledge/components/tabs/SelfKnowledgeElementTabs/SelfKnowledgeElementTabs.vue'
import { useSelfKnowledgeCategory } from '@/features/student/selfKnowledge/composables/use-self-knowledge-category/use-self-knowledge-category'
import { useSelfKnowledgePaginatedElements } from '@/features/student/selfKnowledge/composables/use-self-knowledge-paginated-elements/use-self-knowledge-paginated-elements'
import SelfKnowledgeElementUpdateForm from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/SelfKnowledgeElementUpdateForm.vue'
import { toSentenceCase } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementUpdateViewProps {
  categoryId: string
  elementId: string
}

const props = defineProps<SelfKnowledgeElementUpdateViewProps>()

const { data: element } = useGetSelfKnowledgeElementDetails(toRef(props, 'elementId'))

const { t } = useI18n()
const {
  navigateToStudentSelfKnowledgeElementUpdate,
  navigateToStudentSelfKnowledgeCategory
} = useNavigation()

const {
  categoryType,
  categoryTypeLabel
} = useSelfKnowledgeCategory(computed(() => props.categoryId))

const {
  elements,
  pageInfo,
  loadMoreElements
} = useSelfKnowledgePaginatedElements({
  selfKnowledgeCategoryId: computed(() => props.categoryId),
})

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.trajectories'), to: ROUTES.STUDENT.PROJECT_TRAJECTORIES },
  { text: t('student.global.navigation.tabs.project.items.selfKnowledge') },
  { text: t('student.selfKnowledge.views.SelfKnowledgeElementUpdateView.breadcrumb.current.title', { categoryType: categoryTypeLabel.value }) }
])

function onSelectElement (selectedElementId: string) {
  navigateToStudentSelfKnowledgeElementUpdate({
    categoryId: props.categoryId,
    elementId: selectedElementId,
    replace: true
  })
}

function backToElementDetails () {
  navigateToStudentSelfKnowledgeCategory({
    categoryId: props.categoryId,
    elementId: props.elementId
  })
}
</script>

<template>
  <UpdatePageTitle
    :title="`${toSentenceCase(categoryTypeLabel)} - ${element?.title}`"
    :breadcrumb-links="breadcrumbLinks"
  />
  <div class="self-knowledge-element-update-view av-row av-gap-sm">
    <SelfKnowledgeElementsSideMenu
      :elements="elements"
      :category-type="categoryType"
      :selected-element-id="props.elementId"
      :count-elements="pageInfo.totalElements"
      @select-element="onSelectElement"
      @load-more-elements="loadMoreElements"
    />
    <SelfKnowledgeElementDetailsContainer
      v-if="element"
      :element-title="element.title"
    >
      <template #title>
        <UpdateInProgressBadge :show="true" />
      </template>

      <SelfKnowledgeElementTabs
        :self-knowledge-element="element"
        :category-type="categoryType"
      >
        <template #element>
          <SelfKnowledgeElementUpdateForm
            :element="element"
            :on-cancel="() => backToElementDetails()"
          />
        </template>
        <template #associations>
          Element associations placeholder
        </template>
      </SelfKnowledgeElementTabs>
    </SelfKnowledgeElementDetailsContainer>
  </div>
</template>
