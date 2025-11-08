<script setup lang="ts">
import type { StudentProgressOverviewDTO } from '@/api/avenir-esr'
import { StudentSkillCard } from '@/features/student/components/skills'

const { course, maxSkillsDisplayed = 6 } = defineProps<{ course: StudentProgressOverviewDTO, maxSkillsDisplayed: number }>()

const skills = computed(() => course.skills.slice().slice(0, maxSkillsDisplayed))
const renderedProgramTitle = computed(() => {
  if (!course.programTitle) {
    return ''
  }
  return course.programTitle.length > 60
    ? `${course.programTitle.slice(0, 60)}...`
    : course.programTitle
})
</script>

<template>
  <div class="skills-widget-container">
    <span class="s1-regular">
      {{ renderedProgramTitle }}
    </span>
    <div class="skills-container">
      <StudentSkillCard
        v-for="(skill, index) in skills"
        :key="skill.id"
        :skill="skill"
        :skill-color="`--skill${index + 1}`"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skills-widget-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.s1-regular {
  padding-left: 1.25rem;
}

.skills-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.25rem;
}
</style>
