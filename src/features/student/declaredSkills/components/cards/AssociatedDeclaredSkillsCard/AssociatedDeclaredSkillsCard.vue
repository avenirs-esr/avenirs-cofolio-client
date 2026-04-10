<script setup lang="ts">
import type { DeclaredSkillAssociationDTO } from '@/api/avenir-esr'
import AssociatedSkillCard from '@/features/student/global/components/cards/AssociatedSkillCard/AssociatedSkillCard.vue'
import AssociationsCard from '@/features/student/global/components/cards/AssociationsCard/AssociationsCard.vue'
import { ICONS } from '@/features/student/global/icons'
import { useI18n } from 'vue-i18n'

export interface AssociatedDeclaredSkillsCardProps {
  associatedDeclaredSkills: DeclaredSkillAssociationDTO[]
}

const { associatedDeclaredSkills } = defineProps<AssociatedDeclaredSkillsCardProps>()

const { t } = useI18n()

const title = computed(() => t('student.declaredSkills.cards.AssociatedDeclaredSkillsCard.title', { count: associatedDeclaredSkills.length }))
</script>

<template>
  <AssociationsCard
    v-if="associatedDeclaredSkills.length > 0"
    :title
    :icon="ICONS.SKILLS"
    data-testid="associated-declared-skills-card"
  >
    <AssociatedSkillCard
      v-for="associatedDeclaredSkill in associatedDeclaredSkills"
      :key="associatedDeclaredSkill.associationId"
      :declared-skill="associatedDeclaredSkill.declaredSkill"
    />
  </AssociationsCard>
</template>
