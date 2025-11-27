<script setup lang="ts">
import { ESelfKnowledgeCategoryType, type SelfKnowledgeElementDetailsDTO, type SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTE_NAMES } from '@/common/constants'
import SelfKnowledgeElementDetailsContainer from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.vue'
import SelfKnowledgeElementsSideMenu
  from '@/features/student/selfKnowledge/components/navigation/SelfKnowledgeElementsSideMenu/SelfKnowledgeElementsSideMenu.vue'
import { useI18n } from 'vue-i18n'

interface SelfKnowledgeCategoryViewProps {
  categoryId: string
  categoryType: ESelfKnowledgeCategoryType
}

const { categoryType } = defineProps<SelfKnowledgeCategoryViewProps>()
const { t } = useI18n()

const categoryTypeLabel = computed(() => t(`student.selfKnowledge.categoryType.${categoryType}`, { count: 2 }))

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.trajectories'), to: ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES },
  { text: t('student.navigation.tabs.project.items.selfKnowledge') }
])

const dummyElements = computed<SelfKnowledgeElementViewDTO[]>(() => [
  {
    id: 'ff8beb56-4739-4b6a-8e5c-9aef2fb02688',
    title: 'Intitulé de l\'élément n°1 sur deux lignes maximum',
    description: 'Petit texte qui explique comment l\'étudiant a développé cet élément, dans quelles formation, exp...',
    rating: 3
  },
  {
    id: '2',
    title: 'Force de communication',
    description: 'J\'ai développé cette compétence lors de mes projets de groupe et mes présentations en classe.',
    rating: 4
  },
  {
    id: '3',
    title: 'Créativité',
    description: 'Ma créativité s\'exprime dans mes projets artistiques et mes solutions innovantes.',
    rating: 5
  },
])

const dummySelectedElement = computed<SelfKnowledgeElementDetailsDTO>(() => {
  return {
    ...dummyElements.value[0],
    createdAt: '2023-10-01T12:00:00Z',
    updatedAt: '2023-10-15T15:30:00Z'
  }
})

const selectedElementId = ref<string>('1')

function onSelectElement (elementId: string) {
  selectedElementId.value = elementId
}
</script>

<template>
  <PageTitle
    :title="t('student.views.selfKnowledgeCategoryView.title', { type: categoryTypeLabel })"
    :breadcrumb-links="breadcrumbLinks"
  />
  <div class="self-knowledge-element-update-view av-flex-row-sm">
    <SelfKnowledgeElementsSideMenu
      :elements="dummyElements"
      :category-type="ESelfKnowledgeCategoryType.STRENGTHS"
      :selected-element-id="selectedElementId"
      @select-element="onSelectElement"
    />
    <SelfKnowledgeElementDetailsContainer :element-title="dummySelectedElement.title">
      <template #title>
      <!-- TODO: Dropdown "Gérer mon élément" -->
      </template>

    <!-- TODO: Details selected element -->
    </SelfKnowledgeElementDetailsContainer>
  </div>
</template>

<style scoped lang="scss">

</style>
