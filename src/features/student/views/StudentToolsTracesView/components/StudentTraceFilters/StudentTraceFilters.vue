<script setup lang="ts">
import type { TraceFilter } from '@/features/student/types'
import { AvButton, AvInput } from '@avenirs-esr/avenirs-dsav'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'

export interface StudentTraceFiltersProps {
  initialTraceFilter?: TraceFilter
  searchLabel?: string
}

const { initialTraceFilter, searchLabel } = defineProps<StudentTraceFiltersProps>()

const emit = defineEmits<{
  changeTraceFilter: [filter: TraceFilter]
}>()

const { t } = useI18n()

const keyword = ref(initialTraceFilter?.keyword ?? '')

const debouncedEmit = debounce((value: string) => {
  emit('changeTraceFilter', { keyword: value })
}, 500)

function handleKeywordChange (value: string | number | null) {
  const stringValue = value?.toString() ?? ''
  keyword.value = stringValue
  debouncedEmit(stringValue)
}

function handleResetFilters () {
  keyword.value = ''
  debouncedEmit.cancel()
  emit('changeTraceFilter', { keyword: '' })
}
</script>

<template>
  <div class="student-trace-filters">
    <div class="student-trace-filters__inputs">
      <AvInput
        :model-value="keyword"
        :label="searchLabel ?? t('student.views.studentToolsTracesView.studentTraceFilters.searchLabel')"
        class="student-trace-filters__search-input"
        @update:model-value="handleKeywordChange"
      />
    </div>
    <AvButton
      :label="t('student.views.studentToolsTracesView.studentTraceFilters.resetButton')"
      variant="OUTLINED"
      :on-click="handleResetFilters"
      size="sm"
    />
  </div>
</template>

<style scoped lang="scss">
.student-trace-filters {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) 0;

  &__inputs {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-md);
    flex: 1;
  }

  &__search-input {
    min-width: 16rem;
  }
}
</style>
