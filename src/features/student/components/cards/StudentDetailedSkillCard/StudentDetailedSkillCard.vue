<script lang="ts" setup>
import type { SkillViewDTO } from '@/api/avenir-esr'
import { studentSkillRoute } from '@/features/student/routes'
import { AvCard, AvVIcon } from '@/ui'

export interface StudentDetailedSkillCardProps {
  skill: SkillViewDTO
  skillColor: string
  icon: string
  color: string
}

const { icon, color, skill, skillColor } = defineProps<StudentDetailedSkillCardProps>()
const { name } = skill
</script>

<template>
  <RouterLink
    class="student-detailed-skill-card"
    :to="{ name: studentSkillRoute.name, params: { id: skill.id } }"
  >
    <AvCard
      border-color="var(--other-border-skill-card)"
      :title-background="skillColor"
    >
      <template #title>
        <div class="title-container ellipsis-container">
          <span class="n5 ellipsis">
            {{ name }}
          </span>
          <div
            class="icon-container"
            :style="{ background: skillColor }"
          >
            <AvVIcon
              :name="icon"
              :color="color"
              :size="2.5625"
            />
          </div>
        </div>
      </template>
      <template #body>
        <slot />
      </template>
    </AvCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.av-card {
  width: 100%;
}

.av-card:hover {
  border: 1px solid v-bind('skillColor') !important;
  box-shadow: 0 0 0 2px v-bind('skillColor');
}

.student-detailed-skill-card {
  display: flex;
  width: 100%;
  border-radius: 1.5rem;
  height: 10.875rem;
}

.title-container {
  position: relative
}

.icon-container {
  position: absolute;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 0.75rem;
  border: 1px solid var(--other-background-base);
  right: 0;
  top: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.n5 {
  color: v-bind('color');
}
</style>
