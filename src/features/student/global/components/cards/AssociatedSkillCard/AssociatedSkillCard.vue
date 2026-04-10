<script lang="ts" setup>
import type { DeclaredSkillProgressDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import AssociationCard from '@/features/student/global/components/cards/AssociationCard/AssociationCard.vue'
import { ICONS } from '@/features/student/global/icons'
import { AvBadge, type AvBadgeProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociatedSkillCardProps {
  declaredSkill: DeclaredSkillProgressDTO
}

const { declaredSkill } = defineProps<AssociatedSkillCardProps>()

const { t } = useI18n()

const typeBadge = computed<AvBadgeProps>(() => ({
  label: t(`student.declaredSkills.declaredSkillTypes.${declaredSkill.type}`),
  color: 'var(--text1)',
  borderColor: 'var(--other-border-skill-card)',
  backgroundColor: 'var(--surface-background)',
  icon: MDI_ICONS.BOOKMARK_CHECK
}))

const pathBadge = computed<AvBadgeProps>(() => ({
  label: declaredSkill.pathSegments[declaredSkill.pathSegments.length - 1] ?? '',
  color: 'var(--dark-background-accent)',
  backgroundColor: 'var(--light-background-accent)',
  icon: ICONS.SKILLS
}))
</script>

<template>
  <AssociationCard
    :title="declaredSkill.title"
    :icon="ICONS.SKILLS"
    color="var(--card)"
    background-color="var(--dark-background-primary1)"
    :to="{ name: ROUTES.STUDENT.DECLARED_SKILL.name, params: { id: declaredSkill.id } }"
    data-testid="associated-declared-skill-card"
  >
    <template #body>
      <AvBadge
        v-bind="typeBadge"
        small
        ellipsis
      />
      <AvBadge
        v-if="declaredSkill.pathSegments.length > 0"
        v-bind="pathBadge"
        small
        ellipsis
      />
    </template>
  </AssociationCard>
</template>
