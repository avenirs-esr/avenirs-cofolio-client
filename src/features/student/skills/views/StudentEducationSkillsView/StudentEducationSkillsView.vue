<script setup lang="ts">
import type { GetStudentProgressViewParams } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useBaseApiExceptionToast } from '@/common/composables'
import { ROUTE_NAMES } from '@/common/constants'
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
  { text: t('student.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.navigation.tabs.education.items.skills') }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentEducationSkillsView.title', { count: courses?.length ?? 1 })"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTE_NAMES.STUDENT.HOME"
  />
  <SkillsSortContainer v-model:sort="selectedSortOption" />
  <div class="courses-container">
    <StudentEducationSkillsViewContainer
      v-for="course in courses"
      :key="course.id"
      :course="course"
    />
  </div>
</template>

<style lang="scss" scoped>
.courses-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4xl);
}
</style>
