<script setup lang="ts">
import { SortDirection } from '@/common/types'
import { formatSortParam } from '@/common/utils'
import { StudentProgressViewSortableFields } from '@/features/student/skills/types/student-progress.types'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const sort = defineModel<string>('sort', {
  default: formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.ASC),
  type: String,
})

const { sortOptions } = useSortEducationSkills()

function useSortEducationSkills () {
  const sortOptions = computed(() => [
    {
      value: formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.ASC),
      text: t('global.sort.nameAsc')
    },
    {
      value: formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.DESC),
      text: t('global.sort.nameDesc')
    },
    {
      value: formatSortParam(StudentProgressViewSortableFields.DATE, SortDirection.DESC),
      text: t('global.sort.dateDesc')
    },
    {
      value: formatSortParam(StudentProgressViewSortableFields.DATE, SortDirection.ASC),
      text: t('global.sort.dateAsc')
    },
  ])

  return {
    sortOptions,
  }
}
</script>

<template>
  <div class="skills-sort-container av-row av-gap-sm av-pb-md">
    <AvSelect
      v-model="sort"
      :label="t('global.sort.label')"
      select-id="education-skills-sort"
      placeholder=""
      :options="sortOptions"
      :aria-label="t('student.skills.views.StudentEducationSkillsView.skillsSortContainer.sort.selectAriaLabel')"
      dense
    />
  </div>
</template>
