<script setup lang="ts">
import type { DateFilter } from '@/types'
import type { AvMultiselectOption } from '@avenirs-esr/avenirs-dsav/dist/components/interaction/selects/AvMultiselect/AvMultiselect.vue'
import { type TraceFilter, TraceFilterFileTypesItem, TraceFilterStatusesItem } from '@/api/avenir-esr'
import { useAllSkillsQuery } from '@/features/student/queries'
import { AvButton, AvInput, AvMultiselect, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { isValid } from 'date-fns'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{ (e: 'filtersUpdated',
  payload: Partial<TraceFilter> & Partial<DateFilter>): void }>()

const { t } = useI18n()
const { allSkills } = useAllSkillsQuery()

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

const fromDateSelected = ref<string | undefined>(undefined)
const toDateSelected = ref<string | undefined>(undefined)

function resetAllFilters () {
  typesSelected.value = []
  statusesSelected.value = []
  skillsSelected.value = []
  fromDateSelected.value = undefined
  toDateSelected.value = undefined
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
  toDateSelected
], ([
  newTypes,
  newStatuses,
  newSkills,
  newFromDate,
  newToDate,
]) => {
  emit('filtersUpdated', {
    fileTypes: newTypes.map(t => t.value as TraceFilterFileTypesItem),
    statuses: newStatuses.map(s => s.value as TraceFilterStatusesItem),
    skillIds: newSkills.map(s => s.value as string),
    fromDate: newFromDate,
    toDate: newToDate
  })
})
</script>

<template>
  <div class="main-container">
    <div class="filters-container">
      <AvMultiselect
        v-model="typesSelected"
        :options="typesOptions"
        :label="t('student.views.studentToolsTracesView.traceFilter.labels.types')"
        :default-unselected-text="t('student.views.studentToolsTracesView.traceFilter.labels.types')"
        dense
      />
      <AvMultiselect
        v-model="skillsSelected"
        :options="skillsOptions"
        :label="t('student.views.studentToolsTracesView.traceFilter.labels.skills')"
        :default-unselected-text="t('student.views.studentToolsTracesView.traceFilter.labels.skills')"
        dense
      />
      <AvMultiselect
        v-model="statusesSelected"
        :options="statusesOptions"
        :label="t('student.views.studentToolsTracesView.traceFilter.labels.statuses')"
        :default-unselected-text="t('student.views.studentToolsTracesView.traceFilter.labels.statuses')"
        dense
      />
      <AvInput
        v-model="fromDateSelected"
        :label="t('student.views.studentToolsTracesView.traceFilter.labels.fromDate')"
        type="date"
        :max-date="getDateSelectedFromString(toDateSelected)"
      />
      <AvInput
        v-model="toDateSelected"
        :label="t('student.views.studentToolsTracesView.traceFilter.labels.toDate')"
        type="date"
        :min-date="getDateSelectedFromString(fromDateSelected)"
      />
    </div>
    <AvButton
      :label="t('student.views.studentToolsTracesView.traceFilter.labels.reset')"
      variant="OUTLINED"
      size="sm"
      @click="resetAllFilters"
    />
  </div>
</template>

<style scoped lang="scss">
.main-container, .filters-container {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-xs);
  align-items: end;
}

.main-container {
  width: 100%;
  justify-content: space-between;
}

// TODO: add this as optional prop to AvMultiselect
:deep(.fr-multiselect__collapse) {
  width: auto !important;
}
</style>
