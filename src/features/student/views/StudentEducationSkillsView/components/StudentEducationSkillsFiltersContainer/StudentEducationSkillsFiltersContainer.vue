<script setup lang="ts">
import { SortDirection } from '@/common/types'
import { formatSortParam } from '@/common/utils'
import { StudentProgressViewSortableFields } from '@/features/student/types'
import { AvSelect } from '@/ui'
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
  <div class="filter-and-sort-container">
    <AvSelect
      v-model="sort"
      :label="t('global.sort.label')"
      select-id="education-skills-sort"
      default-unselected-text=""
      :options="sortOptions"
      :aria-label="t('student.views.studentEducationSkillsView.studentEducationSkillsFiltersContainer.sort.selectAriaLabel')"
      dense
    />
  </div>
</template>

<style scoped lang="scss">
.filter-and-sort-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: var(--spacing-sm);
  margin: var(--spacing-md) 0;
}

:deep(.fr-select-group) {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  max-width: 14rem;
}
</style>
