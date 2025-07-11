<script setup lang="ts">
import type { StudentProgressViewDTO } from '@/api/avenir-esr'
import { StudentDetailedEducationalSkillCard } from '@/features/student/components/cards'

const { course } = defineProps<{ course: StudentProgressViewDTO }>()
</script>

<template>
  <div class="education-skills-view-container">
    <span class="n5">
      {{ course.name }}
    </span>
    <div class="skills-container">
      <StudentDetailedEducationalSkillCard
        v-for="(skill, index) in course.skills"
        :key="skill.id"
        :skill="skill"
        :skill-color="`var(--skill${index + 1})`"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.education-skills-view-container {
  display: flex;
  flex-direction: column;
  gap: 1.875rem;
  width: 100%;
}

.skills-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
}

.n5 {
  color: var(--text1)
}
</style>
