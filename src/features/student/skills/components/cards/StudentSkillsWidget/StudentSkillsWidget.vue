<script setup lang="ts">
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import HomeWidget from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.vue'
import StudentSkillsWidgetContainer from '@/features/student/skills/components/cards/StudentSkillsWidget/components/StudentSkillsWidgetContainer/StudentSkillsWidgetContainer.vue'
import { useStudentCoursesSummaryQuery } from '@/features/student/skills/queries/use-skills-view.query/use-skills-view.query'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: apiCourses, error } = useStudentCoursesSummaryQuery()
useBaseApiExceptionToast(error)
const { navigateToStudentSkills } = useNavigation()
const { t } = useI18n()

const courses = computed(() => apiCourses.value ?? [])
const maxSkillsDisplayed = computed(() => courses.value.length > 1 ? 3 : 6)
</script>

<template>
  <HomeWidget
    :title="t('student.skills.cards.StudentSkillsWidget.title')"
    :title-icon="MDI_ICONS.STAR_SHOOTING_OUTLINE"
    :see-all-label="t('student.skills.cards.StudentSkillsWidget.buttons.seeAll')"
    :display-widget="courses.length > 0"
    type="main"
    data-testid="student-skills-widget"
    @see-all-click="navigateToStudentSkills"
  >
    <div class="av-col av-gap-md">
      <StudentSkillsWidgetContainer
        v-for="course in courses"
        :key="course.id"
        :course="course"
        :max-skills-displayed="maxSkillsDisplayed"
      />
    </div>
  </HomeWidget>
</template>
