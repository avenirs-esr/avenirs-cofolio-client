<script setup lang="ts">
import type { GetStudentProgressViewParams } from '@/api/avenir-esr'
import { PageTitle } from '@/common/components'
import { useBaseApiExceptionToast } from '@/common/composables'
import { SortDirection } from '@/common/types'
import { formatSortParam } from '@/common/utils'
import { useProgramProgressViewQuery } from '@/features/student/queries'
import { studentHomeRoute } from '@/features/student/routes'
import { StudentProgressViewSortableFields } from '@/features/student/types'
import SkillsSortContainer
  from '@/features/student/views/StudentEducationSkillsView/components/SkillsSortContainer/SkillsSortContainer.vue'
import StudentEducationSkillsViewContainer
  from '@/features/student/views/StudentEducationSkillsView/components/StudentEducationSkillsViewContainer/StudentEducationSkillsViewContainer.vue'
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
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.education.items.skills') }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentEducationSkillsView.title', { count: courses?.length ?? 1 })"
    :breadcrumb-links="breadcrumbLinks"
    :back="studentHomeRoute"
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
