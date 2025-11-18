<script setup lang="ts">
import type { DateFilter, SearchFilter } from '@/types'
import { type TraceFilter, TraceFilterFileTypesItem, TraceFilterStatusesItem } from '@/api/avenir-esr'
import { useAllSkillsQuery } from '@/features/student/skills'
import { AvButton, AvInput, AvMultiselect, type AvMultiselectOption, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { isValid } from 'date-fns'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'

const { isAssociated } = defineProps<{ isAssociated: boolean }>()

const emit = defineEmits<{ (e: 'update:filters',
  payload: TraceFilter & DateFilter & SearchFilter): void }>()

const { t } = useI18n()
const { allSkills } = useAllSkillsQuery()

const debouncedEmit = debounce((payload: TraceFilter & DateFilter & SearchFilter) => {
  emit('update:filters', payload)
}, 350)

const typesOptions: AvMultiselectOption[] = [
  {
    value: TraceFilterFileTypesItem.PDF,
    label: t('student.views.studentToolsTracesView.traceFilter.labels.typesOptions.pdf'),
    icon: MDI_ICONS.FILE
  },
  {
    value: TraceFilterFileTypesItem.DOC,
    label: t('student.views.studentToolsTracesView.traceFilter.labels.typesOptions.doc'),
    icon: MDI_ICONS.FILE
  },
  {
    value: TraceFilterFileTypesItem.DOCX,
    label: t('student.views.studentToolsTracesView.traceFilter.labels.typesOptions.docx'),
    icon: MDI_ICONS.FILE
  },
  {
    value: TraceFilterFileTypesItem.JPEG,
    label: t('student.views.studentToolsTracesView.traceFilter.labels.typesOptions.jpeg'),
    icon: MDI_ICONS.FILE_IMAGE_OUTLINE
  },
  {
    value: TraceFilterFileTypesItem.PNG,
    label: t('student.views.studentToolsTracesView.traceFilter.labels.typesOptions.png'),
    icon: MDI_ICONS.FILE_IMAGE_OUTLINE
  }
]
const typesSelected = ref<AvMultiselectOption[]>([])

const statusesOptions: AvMultiselectOption[] = [
  {
    value: TraceFilterStatusesItem.ASSOCIATED_EVALUATED,
    label: t('student.views.studentToolsTracesView.traceFilter.labels.statusesOptions.associatedEvaluated'),
  },
  {
    value: TraceFilterStatusesItem.ASSOCIATED_IN_EVALUATION,
    label: t('student.views.studentToolsTracesView.traceFilter.labels.statusesOptions.associatedInEvaluation'),
  },
  {
    value: TraceFilterStatusesItem.ASSOCIATED_NOT_EVALUATED,
    label: t('student.views.studentToolsTracesView.traceFilter.labels.statusesOptions.associatedNotEvaluated'),
  },
  {
    value: TraceFilterStatusesItem.ASSOCIATED_WITH_ADDITIONAL_SKILL,
    label: t('student.views.studentToolsTracesView.traceFilter.labels.statusesOptions.associatedWithAdditionalSkill'),
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
  typesSelected.value = []
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
    fileTypes: newTypes.map(t => t.value as TraceFilterFileTypesItem),
    statuses: newStatuses.map(s => s.value as TraceFilterStatusesItem),
    skillIds: newSkills.map(s => s.value as string),
    fromDate: newFromDate,
    toDate: newToDate,
    keyword
  })
})
</script>

<template>
  <div class="main-container">
    <AvInput
      :model-value="keyword"
      :label="isAssociated ? t('student.views.studentToolsTracesView.traceFilter.labels.search.associated') : t('student.views.studentToolsTracesView.traceFilter.labels.search.unassociated')"
      class="search-input"
      :placeholder="isAssociated ? t('student.views.studentToolsTracesView.traceFilter.labels.search.associated') : t('student.views.studentToolsTracesView.traceFilter.labels.search.unassociated')"
      width="14.875rem"
      @update:model-value="handleKeywordChange"
    />
    <AvMultiselect
      v-if="isAssociated"
      v-model="skillsSelected"
      class="skills-multiselect"
      :options="skillsOptions"
      :label="t('student.views.studentToolsTracesView.traceFilter.labels.skills')"
      :placeholder="t('student.views.studentToolsTracesView.traceFilter.placeholders.skills')"
      :selected-text="t('student.views.studentToolsTracesView.traceFilter.labels.selected', { count: skillsSelected.length })"
      dense
      width="14.875rem"
      height="2.5rem"
    />
    <AvInput
      v-model="fromDateSelected"
      class="start-date-input"
      :label="t('student.views.studentToolsTracesView.traceFilter.labels.fromDate')"
      type="date"
      :max-date="getDateSelectedFromString(toDateSelected)"
      width="14.875rem"
    />
    <AvInput
      v-model="toDateSelected"
      class="end-date-input"
      :label="t('student.views.studentToolsTracesView.traceFilter.labels.toDate')"
      type="date"
      :min-date="getDateSelectedFromString(fromDateSelected)"
      width="14.875rem"
    />
    <AvMultiselect
      v-model="typesSelected"
      class="types-multiselect"
      :options="typesOptions"
      :label="t('student.views.studentToolsTracesView.traceFilter.labels.types')"
      :placeholder="t('student.views.studentToolsTracesView.traceFilter.placeholders.types')"
      :selected-text="t('student.views.studentToolsTracesView.traceFilter.labels.selected', { count: typesSelected.length })"
      dense
      width="14.875rem"
      height="2.5rem"
    />
    <AvMultiselect
      v-if="isAssociated"
      v-model="statusesSelected"
      class="statuses-multiselect"
      :options="statusesOptions"
      :label="t('student.views.studentToolsTracesView.traceFilter.labels.statuses')"
      :placeholder="t('student.views.studentToolsTracesView.traceFilter.placeholders.statuses')"
      :selected-text="t('student.views.studentToolsTracesView.traceFilter.labels.selected', { count: statusesSelected.length })"
      dense
      width="14.875rem"
      height="2.5rem"
    />
    <AvButton
      :label="t('student.views.studentToolsTracesView.traceFilter.labels.reset')"
      class="reset-button"
      variant="OUTLINED"
      small
      @click="resetAllFilters"
    />
  </div>
</template>

<style scoped lang="scss">
.main-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  align-items: end;
  padding: var(--spacing-none) var(--spacing-xs);
}

:deep(input) {
  line-height: unset !important;
  height: var(--dimension-xl);
}

.reset-button {
  height: var(--dimension-xl);
}

:deep(.av-multiselect__collapse__fieldset) {
  max-height: var(--dimension-7xl) !important;
  margin-bottom: var(--spacing-none) !important;
}
</style>
