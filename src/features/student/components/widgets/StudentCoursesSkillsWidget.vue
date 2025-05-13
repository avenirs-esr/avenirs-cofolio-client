<script setup lang="ts">
import type { CourseDTO } from '@/types'
import { AvCard, MDI_ICONS } from '@/ui'
import { StudentCourseSkillsContainer } from '../containers'

const { courses } = defineProps<{ courses: Array<CourseDTO> }>()
</script>

<template>
  <AvCard
    background-color="--white"
    title-background="--white"
  >
    <template #title>
      <div class="courses-skills-widget-container__title">
        <VIcon
          :name="MDI_ICONS.STAR_SHOOTING"
          color="var(--foreground-icon)"
          scale="1.5"
        />
        <h5 class="n5">
          Mes compétences visées par ma formation
        </h5>
      </div>
    </template>
    <template #body>
      <div class="courses-skills-widget-container__body">
        <StudentCourseSkillsContainer
          v-for="course in courses"
          :key="course.id"
          :course="course"
          :max-skills-displayed="courses.length > 1 ? 3 : 6"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.courses-skills-widget-container__title {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  padding-left: 0.75rem;
}

.courses-skills-widget-container__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
