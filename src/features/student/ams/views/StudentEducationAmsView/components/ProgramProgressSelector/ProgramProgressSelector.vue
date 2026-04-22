<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { type TrainingPathDTO, useGetAllStudentProgress } from '@/api/avenir-esr'
import { useAmsStore } from '@/features/student/ams/stores/ams.store'
import { AvTagPicker, type AvTagPickerOption, } from '@avenirs-esr/avenirs-dsav'
import isEmpty from 'lodash-es/isEmpty'
import isNil from 'lodash-es/isNil'
import { useI18n } from 'vue-i18n'

const selectedProgramProgressId = defineModel<string | undefined>()

const { t } = useI18n()
const amsStore = useAmsStore()
const currentPage = toRef(amsStore, 'currentPage')

function mapProgramToOption (program: TrainingPathDTO): AvTagPickerOption {
  return {
    label: program.name,
    value: program.id,
  }
}

const { data, isFetched: isAllMyProgramProgressFetched } = useGetAllStudentProgress()
const programs = computed(() => (data.value ?? []).map(program => program.trainingPath))

const options: ComputedRef<AvTagPickerOption[]> = computed(() => programs.value.map(mapProgramToOption) ?? [])
const selectedProgramProgressOption: ComputedRef<AvTagPickerOption | undefined> = computed(() => {
  if (isNil(selectedProgramProgressId.value)) {
    return
  }
  const selectedProgram = programs.value.find(program => program.id === selectedProgramProgressId.value)
  return selectedProgram ? mapProgramToOption(selectedProgram) : undefined
})

watch(isAllMyProgramProgressFetched, () => {
  const shouldSelectFirstProgram = isAllMyProgramProgressFetched.value
    && isNil(selectedProgramProgressId.value)
    && !isEmpty(programs.value)

  if (shouldSelectFirstProgram) {
    selectedProgramProgressId.value = programs.value[0].id
  }
}, { immediate: true })

function onOptionSelected (selected: AvTagPickerOption): void {
  const foundProgram = programs.value.find(program => program.id === selected.value)
  if (foundProgram) {
    currentPage.value = 0
    selectedProgramProgressId.value = foundProgram.id
  }
}
</script>

<template>
  <div class="program-progress-selector av-row av-align-start">
    <AvTagPicker
      :label="t('student.ams.views.StudentEducationAmsView.programProgressSelector.label')"
      :options="options"
      :selected="selectedProgramProgressOption"
      :handle-select-change="onOptionSelected"
    />
  </div>
</template>

<style scoped>
.program-progress-selector {
  align-self: stretch;
}
</style>
