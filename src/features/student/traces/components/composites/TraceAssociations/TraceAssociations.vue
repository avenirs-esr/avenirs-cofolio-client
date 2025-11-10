<script setup lang="ts">
import type { TraceAssociationsDTO } from '@/api/avenir-esr'
import StudentTraceAdditionalSkillAssociationCard from '@/features/student/traces/components/cards/StudentTraceAdditionalSkillAssociationCard/StudentTraceAdditionalSkillAssociationCard.vue'
import StudentTraceSkillLevelAssociationCard from '@/features/student/traces/components/cards/StudentTraceSkillLevelAssociationCard/StudentTraceSkillLevelAssociationCard.vue'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface TraceAssociationsProps {
  associations: TraceAssociationsDTO | undefined
}

const { associations } = defineProps<TraceAssociationsProps>()

const skillLevelAssociations = computed(() => associations && associations.skillLevelAssociations ? associations.skillLevelAssociations : [])
const additionalSkillAssociations = computed(() => associations && associations.additionalSkillAssociations ? associations.additionalSkillAssociations : [])
const totalAssociations = computed(() => skillLevelAssociations.value.length + additionalSkillAssociations.value.length)

function getSkillColor (index: number): string {
  return `var(--skill${(index % 12) + 1})`
}
</script>

<template>
  <div class="student-trace-associations">
    <slot name="caption">
      <AvIconText
        :text="$t('student.traces.traceAssociations.caption', { count: totalAssociations })"
        :icon="MDI_ICONS.ALERT_CIRCLE_OUTLINE"
        icon-color="var(--text2)"
        typography-class="caption-light"
      />
    </slot>
    <div class="associations-container">
      <StudentTraceSkillLevelAssociationCard
        v-for="(skill, index) in skillLevelAssociations"
        :key="skill.id"
        :skill="skill"
        :level-color="getSkillColor(index)"
      />
      <StudentTraceAdditionalSkillAssociationCard
        v-for="additionalSkill in additionalSkillAssociations"
        :key="additionalSkill.id"
        :additional-skill="additionalSkill"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-trace-associations {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.associations-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
