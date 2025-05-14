<script setup lang="ts">
import type { CourseDTO } from '@/types'
import { useNavigation } from '@/common/composables/use-navigation'
import { AvButton, AvCard, MDI_ICONS } from '@/ui'
import { StudentCourseSkillsContainer } from '../containers'

const { courses } = defineProps<{ courses: Array<CourseDTO> }>()

const { navigateToStudentSkills } = useNavigation()
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
        <span class="n5">
          Mes compétences visées par ma formation
        </span>
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
    <template #footer>
      <div class="courses-skills-widget-container__footer">
        <AvButton
          label="Voir toutes mes compétences"
          variant="tertiary-no-outline"
          :on-click="navigateToStudentSkills"
          :icon="MDI_ICONS.ARROW_RIGHT"
          size="sm"
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

.courses-skills-widget-container__footer {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 1.25rem;
}
</style>
