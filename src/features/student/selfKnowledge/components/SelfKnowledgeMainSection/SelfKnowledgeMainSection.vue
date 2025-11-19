<script setup lang="ts">
import { ESelfKnowledgeCategoryType, type SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import SelfKnowledgeElementCard from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeElementCard/SelfKnowledgeElementCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
  }
]
</script>

<template>
  <div class="self-knowledge-main-section">
    <div class="b1-bold">
      {{ t('student.views.studentProjectTrajectoriesView.selfKnowledge.title') }}
    </div>
    <div class="self-knowledge-main-section__cards">
      <SelfKnowledgeElementCard
        v-for="element in dummyElements"
        :key="element.id"
        :element="element"
        :category-type="ESelfKnowledgeCategoryType.STRENGTHS"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.self-knowledge-main-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);

  &__cards {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }
}
</style>
