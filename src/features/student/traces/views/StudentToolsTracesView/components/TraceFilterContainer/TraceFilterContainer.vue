<script setup lang="ts">
import type { FileGlobalType } from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.types'
import type { DateFilter, SearchFilter } from '@/types'
import { type TraceFilter, type TraceFilterFileTypesItem, TraceFilterStatusesItem } from '@/api/avenir-esr'
import FileTypeMultiselect from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.vue'
import { useModal } from '@/common/composables'
import { useAllSkillsQuery } from '@/features/student/skills'
import { computeTraceFilterFileTypesFromGlobals } from '@/features/student/traces/views/StudentToolsTracesView/components/TraceFilterContainer/utils'
import { AvButton, AvInput, AvModal, AvMultiselect, type AvMultiselectOption, MDI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { isValid } from 'date-fns'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'

const { isAssociated } = defineProps<{ isAssociated: boolean }>()

const emit = defineEmits<{ (e: 'update:filters',
  payload: TraceFilter & DateFilter & SearchFilter): void }>()

const { t } = useI18n()
const { allSkills } = useAllSkillsQuery()
const { showModal, displayModal, hideModal } = useModal()
const { isMobile } = useAvBreakpoints()

const debouncedEmit = debounce((payload: TraceFilter & DateFilter & SearchFilter) => {
  emit('update:filters', payload)
}, 350)

const typesSelected = ref<TraceFilterFileTypesItem[]>([])
const fileGlobalTypesSelected = ref<AvMultiselectOption[]>([])

const statusesOptions: AvMultiselectOption[] = [
  {
    value: TraceFilterStatusesItem.ASSOCIATED_EVALUATED,
    label: t('student.traces.views.StudentToolsTracesView.traceFilter.labels.statusesOptions.associatedEvaluated'),
  },
  {
    value: TraceFilterStatusesItem.ASSOCIATED_IN_EVALUATION,
    label: t('student.traces.views.StudentToolsTracesView.traceFilter.labels.statusesOptions.associatedInEvaluation'),
  },
  {
    value: TraceFilterStatusesItem.ASSOCIATED_NOT_EVALUATED,
    label: t('student.traces.views.StudentToolsTracesView.traceFilter.labels.statusesOptions.associatedNotEvaluated'),
  },
  {
    value: TraceFilterStatusesItem.ASSOCIATED_WITH_DECLARED_SKILL,
    label: t('student.traces.views.StudentToolsTracesView.traceFilter.labels.statusesOptions.associatedWithDeclaredSkill'),
  },
]
const statusesSelected = ref<AvMultiselectOption[]>([])

const skillsOptions = computed(() => (allSkills.value ?? []).map((skill) => {
  return {
    value: skill.skillId,
    label: skill.title
  } as AvMultiselectOption
}))
const skillsSelected = ref<AvMultiselectOption[]>([])

const fromDateSelected = ref<string>('')
const toDateSelected = ref<string>('')
const keyword = ref<string>('')

function resetAllFilters () {
  fileGlobalTypesSelected.value = []
  statusesSelected.value = []
  skillsSelected.value = []
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
  statusesSelected,
  skillsSelected,
  fromDateSelected,
  toDateSelected,
  keyword
], ([
  newTypes,
  newStatuses,
  newSkills,
  newFromDate,
  newToDate,
  keyword
]) => {
  debouncedEmit({
    fileTypes: newTypes,
    statuses: newStatuses.map(s => s.value as TraceFilterStatusesItem),
    skillIds: newSkills.map(s => s.value as string),
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
        class="search-input"
        :placeholder="isAssociated ? t('student.traces.views.StudentToolsTracesView.traceFilter.labels.search.associated') : t('student.traces.views.StudentToolsTracesView.traceFilter.labels.search.unassociated')"
        width="14.875rem"
        @update:model-value="handleKeywordChange"
      />
      <AvMultiselect
        v-if="isAssociated"
        v-model="skillsSelected"
        class="skills-multiselect"
        :options="skillsOptions"
        :label="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.skills')"
        :placeholder="t('student.traces.views.StudentToolsTracesView.traceFilter.placeholders.skills')"
        :selected-text="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.selected', { count: skillsSelected.length })"
        dense
        width="14.875rem"
        height="2.5rem"
        collapse-max-height="var(--dimension-7xl)"
      />
      <AvInput
        v-model="fromDateSelected"
        class="start-date-input"
        :label="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.fromDate')"
        type="date"
        :max-date="getDateSelectedFromString(toDateSelected)"
        width="14.875rem"
      />
      <AvInput
        v-model="toDateSelected"
        class="end-date-input"
        :label="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.toDate')"
        type="date"
        :min-date="getDateSelectedFromString(fromDateSelected)"
        width="14.875rem"
      />
      <FileTypeMultiselect
        v-model="fileGlobalTypesSelected"
        max-height="var(--dimension-7xl)"
      />
      <AvMultiselect
        v-if="isAssociated"
        v-model="statusesSelected"
        class="statuses-multiselect"
        :options="statusesOptions"
        :label="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.statuses')"
        :placeholder="t('student.traces.views.StudentToolsTracesView.traceFilter.placeholders.statuses')"
        :selected-text="t('student.traces.views.StudentToolsTracesView.traceFilter.labels.selected', { count: statusesSelected.length })"
        dense
        width="14.875rem"
        height="2.5rem"
        collapse-max-height="var(--dimension-7xl)"
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
