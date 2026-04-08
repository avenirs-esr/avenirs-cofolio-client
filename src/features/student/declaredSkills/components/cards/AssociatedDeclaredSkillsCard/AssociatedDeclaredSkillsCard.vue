<script setup lang="ts">
import type { DeclaredSkillAssociationDTO } from '@/api/avenir-esr'
import AssociatedSkillCard from '@/features/student/global/components/cards/AssociatedSkillCard/AssociatedSkillCard.vue'
import { ICONS } from '@/features/student/global/icons'
import { AvCard, AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociatedDeclaredSkillsCardProps {
  associatedDeclaredSkills: DeclaredSkillAssociationDTO[]
}

defineProps<AssociatedDeclaredSkillsCardProps>()

const { t } = useI18n()
</script>

<template>
  <AvCard
    v-if="associatedDeclaredSkills.length > 0"
    background-color="var(--card2)"
    title-background="var(--card2)"
    border-color="var(--other-border-skill-card)"
    collapsible
    collapsed
    data-testid="associated-declared-skills-card"
  >
    <template #title>
      <div class="av-row av-flex-fill av-justify-start">
        <AvIconText
          typography-class="n4"
          :icon="ICONS.SKILLS"
          icon-color="var(--text2)"
          :text="t('student.declaredSkills.cards.AssociatedDeclaredSkillsCard.title', { count: associatedDeclaredSkills.length })"
          text-color="var(--text1)"
          gap="var(--spacing-sm)"
          data-testid="associated-declared-skills-card-title"
          inline
        />
      </div>
    </template>

    <div
      class="av-row av-wrap av-align-center av-gap-md"
      data-testid="associated-declared-skills-cards-container"
    >
      <AssociatedSkillCard
        v-for="associatedDeclaredSkill in associatedDeclaredSkills"
        :key="associatedDeclaredSkill.associationId"
        :declared-skill="associatedDeclaredSkill.declaredSkill"
      />
    </div>
  </AvCard>
</template>
