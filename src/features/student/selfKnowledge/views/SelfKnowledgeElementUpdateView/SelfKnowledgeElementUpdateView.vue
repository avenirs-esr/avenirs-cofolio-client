<script lang="ts" setup>
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTE_NAMES } from '@/common/constants/route-names'
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
import SelfKnowledgeElementUpdateForm
  from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/SelfKnowledgeElementUpdateForm.vue'
import { AvBadge, ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementUpdateViewProps {
  categoryId: string
  elementId: string
}

const props = defineProps<SelfKnowledgeElementUpdateViewProps>()

const { element } = useSelfKnowledgeElementDetailsQuery({
  selfKnowledgeElementId: toRef(props, 'elementId')
})

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
  pageSize: 3
})

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.trajectories'), to: ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES },
  { text: t('student.navigation.tabs.project.items.selfKnowledge') }
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
  <PageTitle
    :title="t('student.views.selfKnowledgeElementUpdateView.title', { categoryType: categoryTypeLabel })"
    :breadcrumb-links="breadcrumbLinks"
  />
  <div class="self-knowledge-element-update-view av-flex-row-sm">
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
        <AvBadge
          :label="t('student.views.studentUpdateAdditionalSkillView.wipBadge')"
          background-color="var(--dark-background-primary1)"
          color="var(--dark-foreground)"
          :icon="ICONS_DATA_URL.MDI_PENCIL_OUTLINE"
        />
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

<style lang="scss" scoped>
.self-knowledge-element-update-view {
  &__element-title {
    color: var(--text2);
  }
}
</style>
