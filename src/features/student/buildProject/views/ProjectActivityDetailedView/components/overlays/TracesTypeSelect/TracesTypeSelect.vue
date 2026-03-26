<script setup lang="ts">
import { TraceAssociationTypes } from '@/features/student/buildProject/types/trace-association.types'
import { AvSelect, type AvSelectProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type TracesTypeSelectProps = Omit<AvSelectProps, 'options' | 'placeholder' | 'prefixIcon'>

const {
  label,
  ...restProps
} = defineProps<TracesTypeSelectProps>()

const selectedItem = defineModel<{ itemId: TraceAssociationTypes }>()

const { t } = useI18n()

const options = computed(() => [
  {
    id: TraceAssociationTypes.ALL,
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.TracesTypeSelect.options.TRACE.ALL.label')
  },
  {
    id: TraceAssociationTypes.ASSOCIATED,
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.TracesTypeSelect.options.TRACE.ASSOCIATED.label')
  },
  {
    id: TraceAssociationTypes.UNASSOCIATED,
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.TracesTypeSelect.options.TRACE.UNASSOCIATED.label')
  }
])

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label: label ?? t('student.buildProject.activities.views.ProjectActivityDetailedView.TracesTypeSelect.label'),
  placeholder: t('student.buildProject.activities.views.ProjectActivityDetailedView.TracesTypeSelect.placeholder'),
  options: options.value
}))
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    v-model:selected-item="selectedItem"
  />
</template>
