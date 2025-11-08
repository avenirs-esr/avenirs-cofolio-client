<script lang="ts" setup>
import type { AdditionalSkillAssociationDTO } from '@/api/avenir-esr'
import { AdditionalSkillLevelBadge, AdditionalSkillTypeBadge } from '@/features/student/components/additionalSkills'
import { StudentTraceAssociationCard } from '@/features/student/components/traces'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentTraceAmsAssociationCardProps {
  additionalSkill: AdditionalSkillAssociationDTO
}

const { additionalSkill } = defineProps<StudentTraceAmsAssociationCardProps>()

const { t } = useI18n()
</script>

<template>
  <StudentTraceAssociationCard
    :title="additionalSkill.title"
    :icon="MDI_ICONS.STARS"
  >
    <template #title-prepend>
      <div class="badges-container">
        <AdditionalSkillTypeBadge
          :label="t(`student.additionalSkillTypes.${additionalSkill.type}`)"
        />
        <AdditionalSkillLevelBadge
          :level="additionalSkill.level"
          small
        />
      </div>
    </template>
    <template #body>
      <slot name="body" />
    </template>
  </StudentTraceAssociationCard>
</template>

<style lang="scss" scoped>
.badges-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}
</style>
