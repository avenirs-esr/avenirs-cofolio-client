<script setup lang="ts">
import { ESelfKnowledgeCategoryType, type SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTE_NAMES } from '@/common/constants'
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

const dummyElements: SelfKnowledgeElementViewDTO[] = [
  {
    id: '1',
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
]

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
  <SelfKnowledgeElementsSideMenu
    :elements="dummyElements"
    :category-type="ESelfKnowledgeCategoryType.STRENGTHS"
    :selected-element-id="selectedElementId"
    @select-element="onSelectElement"
  />
</template>

<style scoped lang="scss">

</style>
