<script lang="ts" setup>
import type { SkillDTO } from '@/api/avenir-esr'
import StudentLevelBadge from '@/features/student/components/badges/StudentLevelBadge/StudentLevelBadge.vue'
import StudentTraceAssociationCard from '@/features/student/components/cards/StudentTraceAssociationCard/StudentTraceAssociationCard.vue'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'

export interface StudentTraceSkillAssociationCardProps {
  skill: SkillDTO
  levelColor?: string
}

const props = withDefaults(defineProps<StudentTraceSkillAssociationCardProps>(), {
  levelColor: 'var(--skill3)'
})

const skillLevel = computed(() => props.skill.currentSkillLevel)
</script>

<template>
  <StudentTraceAssociationCard :title="skill.name">
    <template #title-prepend>
      <div class="badges-container">
        <AvBadge
          :label="skillLevel.name"
          color="var(--card)"
          :background-color="levelColor"
          small
          ellipsis
          class="skill-level-badge"
        />
        <StudentLevelBadge :level="skillLevel" />
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

.av-badge.skill-level-badge:before {
  display: none;
}
</style>
