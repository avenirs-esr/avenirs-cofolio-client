<script setup lang="ts">
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import StudentSkillsWidgetContainer from '@/features/student/skills/components/cards/StudentSkillsWidget/components/StudentSkillsWidgetContainer/StudentSkillsWidgetContainer.vue'
import { useStudentCoursesSummaryQuery } from '@/features/student/skills/queries/use-skills-view.query/use-skills-view.query'
import { AvButton, AvCard, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: courses, error } = useStudentCoursesSummaryQuery()
useBaseApiExceptionToast(error)
const { navigateToStudentSkills } = useNavigation()
const { t } = useI18n()

const displayWidget = computed(() => courses.value.length > 0)
const maxSkillsDisplayed = computed(() => courses.value.length > 1 ? 3 : 6)

// TODO DRY: create HomeSideWidget and HomeMainWidget #998
</script>

<template>
  <AvCard
    v-if="displayWidget"
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
  >
    <template #title>
      <div class="av-pl-sm">
        <AvIconText
          :icon="MDI_ICONS.STAR_SHOOTING_OUTLINE"
          :text="t('student.skills.cards.StudentSkillsWidget.title')"
          :title="t('student.skills.cards.StudentSkillsWidget.title')"
          icon-color="var(--icon)"
          text-color="var(--title)"
          typography-class="n5"
          gap="var(--spacing-xs)"
        />
      </div>
    </template>
    <template #body>
      <div class="av-col av-gap-md">
        <StudentSkillsWidgetContainer
          v-for="course in courses"
          :key="course.id"
          :course="course"
          :max-skills-displayed="maxSkillsDisplayed"
        />
      </div>
    </template>
    <template #footer>
      <div class="av-row av-justify-end av-pt-sm">
        <AvButton
          :label="t('student.skills.cards.StudentSkillsWidget.buttons.seeAll')"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          small
          @click="navigateToStudentSkills"
        />
      </div>
    </template>
  </AvCard>
</template>
