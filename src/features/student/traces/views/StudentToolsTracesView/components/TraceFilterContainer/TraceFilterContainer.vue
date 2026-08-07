<script setup lang="ts">
import type { TraceFilter, TraceFilterFileTypesItem } from '@/api/avenir-esr'
import type { FileGlobalType } from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.types'
import type { DateFilter, SearchFilter } from '@/types'
import FileTypeMultiselect from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.vue'
import { useModal } from '@/common/composables'
import { computeTraceFilterFileTypesFromGlobals } from '@/features/student/traces/views/StudentToolsTracesView/components/TraceFilterContainer/utils'
import { AvButton, AvInput, AvModal, type AvMultiselectOption, MDI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { isValid } from 'date-fns'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'

const { isAssociated } = defineProps<{ isAssociated: boolean }>()

const emit = defineEmits<{ (e: 'update:filters',
  payload: TraceFilter & DateFilter & SearchFilter): void }>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()
const { isMobile } = useAvBreakpoints()

const debouncedEmit = debounce((payload: TraceFilter & DateFilter & SearchFilter) => {
  emit('update:filters', payload)
}, 350)

const typesSelected = ref<TraceFilterFileTypesItem[]>([])
const fileGlobalTypesSelected = ref<AvMultiselectOption[]>([])

const fromDateSelected = ref<string>('')
const toDateSelected = ref<string>('')
const keyword = ref<string>('')

function resetAllFilters () {
  fileGlobalTypesSelected.value = []
  fromDateSelected.value = ''
  toDateSelected.value = ''
  keyword.value = ''
}

function handleKeywordChange (value: string | number | null) {
  const stringValue = value?.toString() ?? ''
  keyword.value = stringValue
}

function getDateSelectedFromString (date: string | undefined) {
  if (date === undefined || !isValid(new Date(date))) {
    return undefined
  }
  return new Date(date)
}

watch([
  typesSelected,
  fromDateSelected,
  toDateSelected,
  keyword
], ([
  newTypes,
  newFromDate,
  newToDate,
  keyword
]) => {
  debouncedEmit({
    fileTypes: newTypes,
    fromDate: newFromDate,
    toDate: newToDate,
    keyword
  })
})

watch(fileGlobalTypesSelected, (newFileGlobalTypes) => {
  typesSelected.value = computeTraceFilterFileTypesFromGlobals(newFileGlobalTypes.map(t => t.value as FileGlobalType))
})
</script>

<template>
  <AvButton
    v-if="isMobile"
    :label="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.filter')"
    variant="OUTLINED"
    :icon="MDI_ICONS.FILTER_OUTLINE"
    small
    @click="displayModal"
  />
  <component
    :is="isMobile ? AvModal : 'div'"
    v-bind="isMobile ? {
      opened: showModal,
      closeButtonLabel: t('global.buttons.close'),
    } : {}"
    @close="hideModal"
  >
    <div class="av-row av-wrap av-gap-xs av-align-end av-px-xs">
      <AvInput
        :model-value="keyword"
        :label="isAssociated ? t('student.traces.views.StudentToolsTracesView.traceFilter.labels.search.associated') : t('student.traces.views.StudentToolsTracesView.traceFilter.labels.search.unassociated')"
        :aria-label="isAssociated ? t('student.traces.views.StudentToolsTracesView.traceFilter.labels.search.associated') : t('student.traces.views.StudentToolsTracesView.traceFilter.labels.search.unassociated')"
        class="search-input"
        :placeholder="isAssociated ? t('student.traces.views.StudentToolsTracesView.traceFilter.labels.search.associated') : t('student.traces.views.StudentToolsTracesView.traceFilter.labels.search.unassociated')"
        width="14.875rem"
        @update:model-value="handleKeywordChange"
      />
      <AvInput
        v-model="fromDateSelected"
        class="start-date-input"
        :label="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.fromDate')"
        :aria-label="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.fromDate')"
        type="date"
        :max-date="getDateSelectedFromString(toDateSelected)"
        width="14.875rem"
      />
      <AvInput
        v-model="toDateSelected"
        class="end-date-input"
        :label="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.toDate')"
        :aria-label="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.toDate')"
        type="date"
        :min-date="getDateSelectedFromString(fromDateSelected)"
        width="14.875rem"
      />
      <FileTypeMultiselect
        v-model="fileGlobalTypesSelected"
        max-height="var(--dimension-7xl)"
      />
      <AvButton
        :label="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.reset')"
        class="reset-button"
        variant="OUTLINED"
        small
        @click="resetAllFilters"
      />
    </div>
  </component>
</template>

<style scoped lang="scss">
:deep(input) {
  line-height: unset !important;
  height: var(--dimension-xl);
}

.reset-button {
  height: var(--dimension-xl);
}
</style>
