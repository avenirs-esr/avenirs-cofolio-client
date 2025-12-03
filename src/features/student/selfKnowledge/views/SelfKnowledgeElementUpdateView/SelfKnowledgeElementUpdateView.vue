<script lang="ts" setup>
import { ESelfKnowledgeCategoryType, type SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTE_NAMES } from '@/common/constants/route-names'
import SelfKnowledgeElementDetailsContainer
  from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.vue'

import SelfKnowledgeElementsSideMenu
  from '@/features/student/selfKnowledge/components/navigation/SelfKnowledgeElementsSideMenu/SelfKnowledgeElementsSideMenu.vue'
import SelfKnowledgeElementTabs
  from '@/features/student/selfKnowledge/components/tabs/SelfKnowledgeElementTabs/SelfKnowledgeElementTabs.vue'
import {
  useGetCachedSelfKnowledgeElements,
  useSelfKnowledgeCategoriesQuery,
  useSelfKnowledgeCategoryElementsViewQuery,
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

const { element } = useSelfKnowledgeElementDetailsQuery({ selfKnowledgeElementId: toRef(props, 'elementId') })
const { t } = useI18n()
const { navigateToStudentSelfKnowledgeElementUpdate } = useNavigation()
const { categories } = useSelfKnowledgeCategoriesQuery()
const { getCachedElements } = useGetCachedSelfKnowledgeElements()

const categoryType = computed(() => {
  const category = categories.value.find(cat => cat.id === props.categoryId)
  return category ? category.type : ESelfKnowledgeCategoryType.STRENGTHS
})
const elements = ref<SelfKnowledgeElementViewDTO[]>([])

const page = computed(() => {
  const cached = getCachedElements(props.categoryId)
  return cached.currentPage
})
const pageSize = ref(3)

const { pageInfo, elements: fetchedElements }
  = useSelfKnowledgeCategoryElementsViewQuery({
    selfKnowledgeCategoryId: props.categoryId,
    page,
    pageSize
  })

onMounted(() => {
  const cached = getCachedElements(props.categoryId)
  elements.value = cached.elements
})

watch(
  fetchedElements,
  (newElements) => {
    elements.value = newElements

    if (page.value === 0) {
      elements.value = newElements
    }
    else {
      elements.value = elements.value.concat(newElements)
    }
  },
  { immediate: true }
)

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.trajectories'), to: ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES },
  { text: t('student.navigation.tabs.project.items.selfKnowledge') }
])

function onSelectElement (selectedElementId: string) {
  navigateToStudentSelfKnowledgeElementUpdate({ categoryId: props.categoryId, elementId: selectedElementId, replace: true })
}
</script>

<template>
  <PageTitle
    :title="t('student.views.selfKnowledgeElementUpdateView.title', { categoryType: t(`student.selfKnowledge.categoryType.${categoryType}`, { count: 2 }) })"
    :breadcrumb-links="breadcrumbLinks"
  />
  <div
    class="self-knowledge-element-update-view av-flex-row-sm"
  >
    <SelfKnowledgeElementsSideMenu
      :elements="elements"
      :category-type="categoryType"
      :selected-element-id="props.elementId"
      :count-elements="pageInfo.totalElements"
      @select-element="onSelectElement"
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
            :category-type="categoryType"
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
