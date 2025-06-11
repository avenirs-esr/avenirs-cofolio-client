<script setup lang="ts">
import { useNavigation } from '@/common/composables'
import { useStudentCoursesSummaryQuery } from '@/features/student/queries'
import { AvButton, AvCard, IconText, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'
import { StudentSkillsWidgetContainer } from './components'

const { t } = useI18n()
const { navigateToStudentSkills } = useNavigation()
const { data: courses } = useStudentCoursesSummaryQuery()

const displayWidget = computed(() => courses.value.length > 0)
const maxSkillsDisplayed = computed(() => courses.value.length > 1 ? 3 : 6)
</script>

<template>
  <AvCard
    v-if="displayWidget"
    background-color="--white"
    title-background="--white"
  >
    <template #title>
      <div class="skills-widget-container__title">
        <IconText
          :icon="MDI_ICONS.STAR_SHOOTING"
          :text="t('student.widgets.skills.title')"
          icon-color="var(--foreground-icon)"
          text-color="var(--foreground-text1)"
          typography-class="n5"
        />
      </div>
    </template>
    <template #body>
      <div class="skills-widget-container__body">
        <StudentSkillsWidgetContainer
          v-for="course in courses"
          :key="course.id"
          :course="course"
          :max-skills-displayed="maxSkillsDisplayed"
        />
      </div>
    </template>
    <template #footer>
      <div class="skills-widget-container__footer">
        <AvButton
          :label="t('student.widgets.skills.buttons.seeAll')"
          :on-click="navigateToStudentSkills"
          :icon="MDI_ICONS.ARROW_RIGHT"
          size="sm"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.skills-widget-container__title {
  padding-left: 0.75rem;
}

.skills-widget-container__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.skills-widget-container__footer {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 1.25rem;
}
</style>
