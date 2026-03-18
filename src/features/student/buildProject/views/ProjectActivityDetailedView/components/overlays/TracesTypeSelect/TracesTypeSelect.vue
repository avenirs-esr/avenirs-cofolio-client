<script setup lang="ts">
import { EDeclaredActivityAssociationType } from '@/api/avenir-esr'
import { AvSelect, type AvSelectProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type TracesTypeSelectProps = Omit<AvSelectProps, 'options' | 'placeholder' | 'prefixIcon'>

const {
  label,
  ...restProps
} = defineProps<TracesTypeSelectProps>()

const selectedItem = defineModel<{ itemId: EDeclaredActivityAssociationType }>()

const { t } = useI18n()

const options = computed(() => [
  {
    id: EDeclaredActivityAssociationType.TRACE,
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.TracesTypeSelect.options.TRACE')
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
