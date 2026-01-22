<script lang="ts" setup>
import type { SkillLevelAssociationDTO } from '@/api/avenir-esr'
import { StudentAmsStatusBadge } from '@/features/student/ams'
import { StudentSkillLevelStatusBadge } from '@/features/student/skills'
import StudentTraceAssociationContentBadge from '@/features/student/traces/components/badges/StudentTraceAssociationContentBadge/StudentTraceAssociationContentBadge.vue'
import StudentTraceAssociationCard from '@/features/student/traces/components/cards/StudentTraceAssociationCard/StudentTraceAssociationCard.vue'
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
      <div class="av-row av-align-center av-gap-md">
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
        class="av-row av-align-center av-justify-between av-gap-sm av-pt-xs"
      >
        <StudentTraceAssociationContentBadge
          :label="skill.ams.title"
        />
        <StudentAmsStatusBadge :status="skill.ams.status" />
      </div>
    </template>
  </StudentTraceAssociationCard>
</template>
