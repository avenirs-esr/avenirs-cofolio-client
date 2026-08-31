<script lang="ts" setup>
import type { EExternalSkillType } from '@/api/avenir-esr'
import type { IdTitle } from '@/types'
import { ICONS } from '@/common/constants'
import FloatingIconCard from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { AvBadge, type AvBadgeProps, ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeclaredSkillCompactCardProps {
  declaredSkill: IdTitle & { type?: EExternalSkillType }
}

const { declaredSkill } = defineProps<DeclaredSkillCompactCardProps>()
const { t } = useI18n()

const iconOptions = computed(() => ({
  name: ICONS.SKILLS,
  color: 'var(--card)',
  bottom: '-2.5rem',
  borderColor: 'var(--other-border-skill-card)'
}))

const typeBadge = computed<AvBadgeProps>(() => ({
  label: t(`student.declaredSkills.declaredSkillTypes.${declaredSkill.type}`),
  color: 'var(--text1)',
  borderColor: 'var(--other-border-skill-card)',
  backgroundColor: 'var(--surface-background)',
  icon: ICONS_DATA_URL.MDI_BOOKMARK_CHECK
}))
</script>

<template>
  <FloatingIconCard
    :title="declaredSkill.title"
    title-color="var(--card)"
    color="var(--dark-background-primary1)"
    :icon-options="iconOptions"
    border-color="var(--other-border-skill-card)"
    :header-rows="2"
    height="7.5rem"
    custom-title-height="4rem"
    title-typography-classes="caption-regular"
  >
    <template
      v-if="declaredSkill.type"
      #body
    >
      <AvBadge
        v-bind="typeBadge"
        small
        ellipsis
      />
    </template>
  </FloatingIconCard>
</template>
