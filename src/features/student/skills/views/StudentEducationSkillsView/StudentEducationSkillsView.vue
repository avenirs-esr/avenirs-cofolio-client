<script setup lang="ts">
import type { GetStudentProgressViewParams } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useBaseApiExceptionToast } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { SortDirection } from '@/common/types'
import { formatSortParam } from '@/common/utils'
import { useProgramProgressViewQuery } from '@/features/student/skills/queries/use-program-progress.query/use-program-progress.query'
import { StudentProgressViewSortableFields } from '@/features/student/skills/types/student-progress.types'
import SkillsSortContainer
  from '@/features/student/skills/views/StudentEducationSkillsView/components/SkillsSortContainer/SkillsSortContainer.vue'
import StudentEducationSkillsViewContainer
  from '@/features/student/skills/views/StudentEducationSkillsView/components/StudentEducationSkillsViewContainer/StudentEducationSkillsViewContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const defaultSortOption = formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.ASC)

const selectedSortOption = ref(defaultSortOption)

const params = computed((): GetStudentProgressViewParams => ({
  sort: selectedSortOption.value,
}))

const { data: courses, error } = useProgramProgressViewQuery(params)

useBaseApiExceptionToast(error)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.education.items.skills') }
])
</script>

<template>
  <PageTitle
    :title="t('student.skills.views.StudentEducationSkillsView.title', { count: courses?.length ?? 1 })"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.HOME"
  />
  <SkillsSortContainer v-model:sort="selectedSortOption" />
  <div class="av-col av-gap-4xl">
    <StudentEducationSkillsViewContainer
      v-for="course in courses"
      :key="course.id"
      :course="course"
    />
  </div>
</template>
