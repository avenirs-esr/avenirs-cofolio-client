<script setup lang="ts">
import type { DeclaredSkillAssociationDTO } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import AssociatedSkillCard from '@/features/global/components/cards/AssociatedSkillCard/AssociatedSkillCard.vue'
import AssociationsCard from '@/features/global/components/cards/AssociationsCard/AssociationsCard.vue'
import { useI18n } from 'vue-i18n'

export interface AssociatedDeclaredSkillsCardProps {
  associatedDeclaredSkills: DeclaredSkillAssociationDTO[]
  disabled?: boolean
}

const { associatedDeclaredSkills, disabled } = defineProps<AssociatedDeclaredSkillsCardProps>()

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
      :disabled="disabled"
    />
  </AssociationsCard>
</template>
