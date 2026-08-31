<script setup lang="ts">
import { TraceAssociationTypes } from '@/features/traces/types/trace-association.types'
import { AvSelect, type AvSelectProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type TracesTypeSelectProps = Omit<AvSelectProps, 'options' | 'placeholder' | 'prefixIcon'>

const {
  label,
  ...restProps
} = defineProps<TracesTypeSelectProps>()

const selectedItem = defineModel<{ itemId: TraceAssociationTypes }>()

const { t } = useI18n()

const options = computed(() =>
  Object.values(TraceAssociationTypes).map(type => ({
    id: type,
    label: t(`student.traces.interactions.pickers.TracesTypeSelect.options.${type}.label`)
  }))
)

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label: label ?? t('student.traces.interactions.pickers.TracesTypeSelect.label'),
  placeholder: t('student.traces.interactions.pickers.TracesTypeSelect.placeholder'),
  options: options.value
}))
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    v-model:selected-item="selectedItem"
  />
</template>
