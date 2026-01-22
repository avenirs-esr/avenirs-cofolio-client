<script setup lang="ts">
import type { TraceAssociationsDTO } from '@/api/avenir-esr'
import StudentTraceDeclaredSkillAssociationCard from '@/features/student/traces/components/cards/StudentTraceDeclaredSkillAssociationCard/StudentTraceDeclaredSkillAssociationCard.vue'
import StudentTraceSkillLevelAssociationCard from '@/features/student/traces/components/cards/StudentTraceSkillLevelAssociationCard/StudentTraceSkillLevelAssociationCard.vue'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface TraceAssociationsProps {
  associations: TraceAssociationsDTO | undefined
}

const { associations } = defineProps<TraceAssociationsProps>()

const skillLevelAssociations = computed(() => associations && associations.skillLevelAssociations ? associations.skillLevelAssociations : [])
const declaredSkillAssociations = computed(() => associations && associations.declaredSkillAssociations ? associations.declaredSkillAssociations : [])
const totalAssociations = computed(() => skillLevelAssociations.value.length + declaredSkillAssociations.value.length)

function getSkillColor (index: number): string {
  return `var(--skill${(index % 12) + 1})`
}
</script>

<template>
  <div class="av-col av-gap-sm">
    <slot name="caption">
      <AvIconText
        :text="$t('student.traces.composites.TraceAssociations.caption', { count: totalAssociations })"
        :icon="MDI_ICONS.ALERT_CIRCLE_OUTLINE"
        icon-color="var(--text2)"
        typography-class="caption-light"
      />
    </slot>
    <div class="av-col av-gap-sm">
      <StudentTraceSkillLevelAssociationCard
        v-for="(skill, index) in skillLevelAssociations"
        :key="skill.id"
        :skill="skill"
        :level-color="getSkillColor(index)"
      />
      <StudentTraceDeclaredSkillAssociationCard
        v-for="declaredSkill in declaredSkillAssociations"
        :key="declaredSkill.id"
        :declared-skill="declaredSkill"
      />
    </div>
  </div>
</template>
