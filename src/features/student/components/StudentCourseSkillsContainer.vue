<script setup lang="ts">
import type { CourseDTO } from '@/types'
import { AvSkillCard } from '@/ui'

const { course, maxSkillsDisplayed = 6 } = defineProps<{ course: CourseDTO, maxSkillsDisplayed: number }>()

const skills = computed(() => course.skills.slice(0, maxSkillsDisplayed))
</script>

<template>
  <div class="course-skills-container">
    <span class="s1-regular">
      {{ course.name }}
    </span>
    <div class="skills-container">
      <AvSkillCard
        v-for="(item, index) in skills"
        :key="item.id"
        :skill="item"
        :skill-color="`--skill${index + 1}`"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.course-skills-container {
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
