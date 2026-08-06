<script setup lang="ts">
import { EAssociationContextType } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface CountAssociationsBadgeProps {
  type: EAssociationContextType
  count: number
}

const { type, count } = defineProps<CountAssociationsBadgeProps>()

const { t } = useI18n()

const ASSOCIATION_ICONS: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: ICONS.TRACES,
  [EAssociationContextType.DECLARED_ACTIVITY]: ICONS.ACTIVITY,
  [EAssociationContextType.DECLARED_SKILL]: ICONS.SKILLS,
  [EAssociationContextType.DECLARED_EXPERIENCE]: ICONS.EXPERIENCES
}

const ASSOCIATION_LABEL_KEYS: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: 'student.traces.trace',
  [EAssociationContextType.DECLARED_ACTIVITY]: 'student.buildProject.activities.activity',
  [EAssociationContextType.DECLARED_SKILL]: 'student.skills.skill',
  [EAssociationContextType.DECLARED_EXPERIENCE]: 'student.personalCareer.global.experience'
}

const icon = computed(() => ASSOCIATION_ICONS[type])
const label = computed(() => `${count} ${t(ASSOCIATION_LABEL_KEYS[type], count)}`)
</script>

<template>
  <AvIconText
    data-testid="count-associations-badge"
    :icon="icon"
    :text="label"
    gap="var(--spacing-xs)"
    icon-color="var(--text1)"
    text-color="var(--text1)"
    typography-class="b2-regular"
  />
</template>
