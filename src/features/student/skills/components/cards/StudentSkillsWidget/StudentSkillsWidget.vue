<script setup lang="ts">
import { useGetStudentProgressOverview } from '@/api/avenir-esr'
import { useBaseApiExceptionToast } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import HomeWidget from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.vue'
import StudentSkillsWidgetContainer from '@/features/student/skills/components/cards/StudentSkillsWidget/components/StudentSkillsWidgetContainer/StudentSkillsWidgetContainer.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: apiCourses, error } = useGetStudentProgressOverview()
useBaseApiExceptionToast(error)
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
    :to="ROUTES.STUDENT.EDUCATION_SKILLS"
    data-testid="student-skills-widget"
  >
    <div class="av-col av-gap-md">
      <StudentSkillsWidgetContainer
        v-for="course in courses"
        :key="course.id"
        data-testid="student-skills-peer-course"
        :course="course"
        :max-skills-displayed="maxSkillsDisplayed"
      />
    </div>
  </HomeWidget>
</template>
