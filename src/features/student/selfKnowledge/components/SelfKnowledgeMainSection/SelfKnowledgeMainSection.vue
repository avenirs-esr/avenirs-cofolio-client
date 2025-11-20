<script setup lang="ts">
import { ESelfKnowledgeCategoryType, type SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import SelfKnowledgeElementCard from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeElementCard/SelfKnowledgeElementCard.vue'
import AddSelfKnowledgeCategoriesModal from '@/features/student/selfKnowledge/components/modals/AddSelfKnowledgeCategoriesModal/AddSelfKnowledgeCategoriesModal.vue'
import { AvButton, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const {
  displayModal: displayAddCategoryModal,
  hideModal: hideAddCategoryModal,
  showModal: showAddCategoryModal
} = useModal()

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
    <AvIconText
      typography-class="n4"
      :icon="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE"
      icon-color="var(--icon)"
      :text="t('student.views.studentProjectTrajectoriesView.selfKnowledge.title.content')"
      text-color="var(--title)"
      gap="0.75rem"
    />
    <div class="self-knowledge-main-section__add-category">
      <AvButton
        :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
        :label="t('student.views.studentProjectTrajectoriesView.selfKnowledge.buttons.addCategory')"
        variant="OUTLINED"
        small
        @click="displayAddCategoryModal"
      />
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

  <AddSelfKnowledgeCategoriesModal
    :show="showAddCategoryModal"
    @cancel="hideAddCategoryModal"
    @confirm="hideAddCategoryModal"
  />
</template>

<style lang="scss" scoped>
.self-knowledge-main-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);

  &__add-category {
    display: flex;
    align-self: flex-end;
  }

  &__cards {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }
}
</style>
