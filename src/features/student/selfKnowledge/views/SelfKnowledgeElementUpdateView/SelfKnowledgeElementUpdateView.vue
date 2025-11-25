<script lang="ts" setup>
import { ESelfKnowledgeCategoryType, type SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTE_NAMES } from '@/common/constants/route-names'
import SelfKnowledgeElementsSideMenu from '@/features/student/selfKnowledge/components/navigation/SelfKnowledgeElementsSideMenu/SelfKnowledgeElementsSideMenu.vue'
import SelfKnowledgeElementTabs from '@/features/student/selfKnowledge/components/SelfKnowledgeElementTabs/SelfKnowledgeElementTabs.vue'
import { useSelfKnowledgeElementDetailsQuery } from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementUpdateViewProps {
  categoryId: string
  elementId: string
}

const { elementId, categoryId } = defineProps<SelfKnowledgeElementUpdateViewProps>()

const { element } = useSelfKnowledgeElementDetailsQuery({ selfKnowledgeElementId: elementId })
const { t } = useI18n()
const { navigateToStudentSelfKnowledgeElementUpdate } = useNavigation()

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.trajectories'), to: ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES },
  { text: t('student.navigation.tabs.project.items.selfKnowledge') }
])

// TODO: replace with real elements from API when ready
const dummyElements = computed<SelfKnowledgeElementViewDTO[]>(() => [
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
])

// TODO: replace with real category type from API when ready
const dummyCategoryType = computed<ESelfKnowledgeCategoryType>(() => ESelfKnowledgeCategoryType.STRENGTHS)

function onSelectElement (selectedElementId: string) {
  navigateToStudentSelfKnowledgeElementUpdate({ categoryId, elementId: selectedElementId })
}
</script>

<template>
  <PageTitle
    :title="t('student.views.selfKnowledgeElementUpdateView.title', { elementTitle: element?.title })"
    :breadcrumb-links="breadcrumbLinks"
  >
    <template #title>
      <span class="page-title__title n4">{{ t('global.buttons.update') }}
        <span class="page-title__subtitle s1-regular">{{ element?.title }}</span>
      </span>
    </template>
  </PageTitle>
  <div
    v-if="element"
    class="self-knowledge-element-update-view av-flex-row-sm"
  >
    <SelfKnowledgeElementsSideMenu
      :category-type="dummyCategoryType"
      :selected-element-id="elementId"
      :elements="dummyElements"
      @select-element="onSelectElement"
    />
    <div class="av-flex-col-md">
      <span class="self-knowledge-element-update-view__element-title n4">{{ element.title }}</span>
      <SelfKnowledgeElementTabs
        :self-knowledge-element="element"
        :category-type="dummyCategoryType"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-title {
  &__title {
    color: var(--text1);
  }

  &__subtitle {
    color: var(--text2);
  }
}

.self-knowledge-element-update-view {
  &__element-title {
    color: var(--text2);
  }
}
</style>
