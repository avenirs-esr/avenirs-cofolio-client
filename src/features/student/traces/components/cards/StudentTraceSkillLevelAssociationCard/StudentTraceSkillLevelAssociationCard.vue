<script lang="ts" setup>
import type { SkillLevelAssociationDTO } from '@/api/avenir-esr'
import { StudentAmsStatusBadge } from '@/features/student/ams'
import { StudentSkillLevelStatusBadge } from '@/features/student/skills'
import { StudentTraceAssociationCard, StudentTraceAssociationContentBadge } from '@/features/student/traces'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'

export interface StudentTraceSkillAssociationCardProps {
  skill: SkillLevelAssociationDTO
  levelColor?: string
}

const { skill, levelColor = 'var(--skill3)' } = defineProps<StudentTraceSkillAssociationCardProps>()
</script>

<template>
  <StudentTraceAssociationCard :title="skill.skillTitle">
    <template #title-prepend>
      <div class="badges-container">
        <AvBadge
          :label="skill.level"
          color="var(--card)"
          :background-color="levelColor"
          small
          ellipsis
          class="skill-level-badge"
        />
        <StudentSkillLevelStatusBadge :status="skill.status" />
      </div>
    </template>
    <template #body>
      <div
        v-if="skill.ams"
        class="ams-container"
      >
        <StudentTraceAssociationContentBadge
          :label="skill.ams.title"
        />
        <StudentAmsStatusBadge :status="skill.ams.status" />
      </div>
    </template>
  </StudentTraceAssociationCard>
</template>

<style lang="scss" scoped>
.badges-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.av-badge.skill-level-badge:before {
  display: none;
}

.ams-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-sm);
  justify-content: space-between;
  padding-top: var(--spacing-xs)
}
</style>
