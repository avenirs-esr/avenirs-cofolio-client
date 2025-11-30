<script setup lang="ts">
import { ESelfKnowledgeCategoryType, type SelfKnowledgeElementDetailsDTO, type SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTE_NAMES } from '@/common/constants'
import SelfKnowledgeElementDetailsContainer from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.vue'
import SelfKnowledgeElementsSideMenu
  from '@/features/student/selfKnowledge/components/navigation/SelfKnowledgeElementsSideMenu/SelfKnowledgeElementsSideMenu.vue'
import SelfKnowledgeElementTabs from '@/features/student/selfKnowledge/components/tabs/SelfKnowledgeElementTabs/SelfKnowledgeElementTabs.vue'
import SelfKnowledgeElementDetails from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetails/SelfKnowledgeElementDetails.vue'
import SelfKnowledgeElementDetailsDropdown from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetailsDropdown/SelfKnowledgeElementDetailsDropdown.vue'
import { useI18n } from 'vue-i18n'

interface SelfKnowledgeCategoryViewProps {
  categoryId: string
  categoryType: ESelfKnowledgeCategoryType
}

const { categoryId, categoryType } = defineProps<SelfKnowledgeCategoryViewProps>()
const { t } = useI18n()
const { navigateToStudentSelfKnowledgeElementUpdate } = useNavigation()

const categoryTypeLabel = computed(() => t(`student.selfKnowledge.categoryType.${categoryType}`, { count: 2 }))

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.trajectories'), to: ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES },
  { text: t('student.navigation.tabs.project.items.selfKnowledge') }
])

const dummyElements = computed<SelfKnowledgeElementViewDTO[]>(() => [
  {
    id: 'a73e0883-ad08-4a62-ab1f-16947250b4fe',
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

const selectedElementId = ref<string>('a73e0883-ad08-4a62-ab1f-16947250b4fe')

const dummySelectedElement = computed<SelfKnowledgeElementDetailsDTO>(() => {
  return {
    ...dummyElements.value.find(el => el.id === selectedElementId.value)!,
    createdAt: '2023-10-01T12:00:00Z',
    updatedAt: '2023-10-15T15:30:00Z'
  }
})

function onSelectElement (elementId: string) {
  selectedElementId.value = elementId
}

function onUpdateSelected () {
  navigateToStudentSelfKnowledgeElementUpdate({ categoryId, elementId: selectedElementId.value })
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
        <SelfKnowledgeElementDetailsDropdown
          @update-selected="onUpdateSelected"
        />
      </template>

      <SelfKnowledgeElementTabs :category-type="categoryType">
        <template #element>
          <SelfKnowledgeElementDetails :element="dummySelectedElement" />
        </template>
        <template #associations>
          Element associations placeholder
        </template>
      </SelfKnowledgeElementTabs>
    </SelfKnowledgeElementDetailsContainer>
  </div>
</template>

<style scoped lang="scss">

</style>
