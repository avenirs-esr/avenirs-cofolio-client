<script setup lang="ts">
import { SortDirection } from '@/common/types'
import { formatSortParam } from '@/common/utils'
import { StudentProgressViewSortableFields } from '@/features/student/skills/types/student-progress.types'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const sort = defineModel<{ itemId: string }>('sort', {
  default: { itemId: formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.ASC) },
  type: Object as () => { itemId: string },
})

const { sortOptions } = useSortEducationSkills()

function useSortEducationSkills () {
  const sortOptions = computed(() => [
    {
      id: formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.ASC),
      label: t('global.sort.nameAsc')
    },
    {
      id: formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.DESC),
      label: t('global.sort.nameDesc')
    },
    {
      id: formatSortParam(StudentProgressViewSortableFields.DATE, SortDirection.DESC),
      label: t('global.sort.dateDesc')
    },
    {
      id: formatSortParam(StudentProgressViewSortableFields.DATE, SortDirection.ASC),
      label: t('global.sort.dateAsc')
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
      v-model:selected-item="sort"
      :label="t('global.sort.label')"
      select-id="education-skills-sort"
      placeholder=""
      :options="sortOptions"
      :aria-label="t('student.skills.views.StudentEducationSkillsView.skillsSortContainer.sort.selectAriaLabel')"
      dense
    />
  </div>
</template>
