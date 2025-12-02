<script setup lang="ts">
import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementDetailsDTO, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTE_NAMES } from '@/common/constants'
import SelfKnowledgeElementDetailsContainer from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.vue'
import SelfKnowledgeElementsSideMenu
  from '@/features/student/selfKnowledge/components/navigation/SelfKnowledgeElementsSideMenu/SelfKnowledgeElementsSideMenu.vue'
import SelfKnowledgeElementTabs from '@/features/student/selfKnowledge/components/tabs/SelfKnowledgeElementTabs/SelfKnowledgeElementTabs.vue'
import {
  useGetCachedSelfKnowledgeElements,
  useSelfKnowledgeCategoriesQuery,
  useSelfKnowledgeCategoryElementsViewQuery
} from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import SelfKnowledgeElementDetails from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetails/SelfKnowledgeElementDetails.vue'
import SelfKnowledgeElementDetailsDropdown from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetailsDropdown/SelfKnowledgeElementDetailsDropdown.vue'
import { useI18n } from 'vue-i18n'

interface SelfKnowledgeCategoryViewProps {
  categoryType: ESelfKnowledgeCategoryType
}

const { categoryType } = defineProps<SelfKnowledgeCategoryViewProps>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { navigateToStudentSelfKnowledgeElementUpdate } = useNavigation()
const { categories } = useSelfKnowledgeCategoriesQuery()
const { getCachedElements } = useGetCachedSelfKnowledgeElements()

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.trajectories'), to: ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES },
  { text: t('student.navigation.tabs.project.items.selfKnowledge') }
])
const categoryTypeLabel = computed(() => t(`student.selfKnowledge.categoryType.${categoryType}`, { count: 2 }))

const selectedElementId = ref('')

const page = ref(0)
const pageSize = ref(3)

const categoryId = computed(() => {
  const category = categories.value.find(cat => cat.type === categoryType)
  return category ? category.id : ''
})

const elements = ref<SelfKnowledgeElementViewDTO[]>([])

watch(categoryId, (newCategoryId) => {
  if (!newCategoryId) {
    return
  }

  const cached = getCachedElements(newCategoryId)
  elements.value = cached.elements

  if (cached.currentPage > 0) {
    page.value = cached.currentPage
  }
}, { immediate: true })

const { pageInfo, elements: fetchedElements, isFetching } = useSelfKnowledgeCategoryElementsViewQuery({
  selfKnowledgeCategoryId: categoryId,
  page,
  pageSize
})

watch(fetchedElements, (newElements) => {
  if (page.value === 0) {
    elements.value = newElements
  }
  else {
    elements.value = elements.value.concat(newElements)
  }
})

watch(() => route.query.elementId, (elementId) => {
  if (elementId) {
    selectedElementId.value = elementId.toString()
  }
}, { immediate: true })

const selectedElement = computed<SelfKnowledgeElementDetailsDTO | undefined>(() => {
  return elements.value.find(el => el.id === selectedElementId.value) as SelfKnowledgeElementDetailsDTO | undefined
})

function onSelectElement (elementId: string) {
  selectedElementId.value = elementId
  router.replace({ query: { ...route.query, elementId } })
}

function onUpdateSelected () {
  navigateToStudentSelfKnowledgeElementUpdate({
    categoryId: categoryId.value,
    elementId: selectedElementId.value
  })
}

function loadMoreElements () {
  if (isFetching.value) {
    return
  }
  if (page.value < pageInfo.value.totalPages) {
    page.value += 1
  }
}
</script>

<template>
  <PageTitle
    :title="t('student.views.selfKnowledgeCategoryView.title', { type: categoryTypeLabel })"
    :breadcrumb-links="breadcrumbLinks"
  />
  <div class="self-knowledge-category-elements-view av-flex-row-sm">
    <SelfKnowledgeElementsSideMenu
      :elements="elements"
      :category-type="categoryType"
      :selected-element-id="selectedElementId"
      :count-elements="pageInfo.totalElements"
      @select-element="onSelectElement"
      @load-more-elements="loadMoreElements"
    />

    <SelfKnowledgeElementDetailsContainer :element-title="selectedElement?.title ?? ''">
      <template #title>
        <SelfKnowledgeElementDetailsDropdown
          @update-selected="onUpdateSelected"
        />
      </template>

      <SelfKnowledgeElementTabs :category-type="categoryType">
        <template #element>
          <SelfKnowledgeElementDetails
            v-if="selectedElement"
            :element="selectedElement"
          />
        </template>
        <template #associations>
          Element associations placeholder
        </template>
      </SelfKnowledgeElementTabs>
    </SelfKnowledgeElementDetailsContainer>
  </div>
</template>
