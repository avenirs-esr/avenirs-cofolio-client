<script setup lang="ts">
import type { TrainingPathDTO } from '@/api/avenir-esr'
import type { ComputedRef } from 'vue'
import { useAllMyProgramProgressQuery } from '@/features/student/queries'
import { useAmsStore } from '@/store'
import { AvTagPicker, type AvTagPickerOption, } from '@/ui'
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

const { data: programs, isFetched: isAllMyProgramProgressFetched } = useAllMyProgramProgressQuery()

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
  <div class="program-progress-selector">
    <AvTagPicker
      :label="t('student.views.studentEducationAmsView.amsListContainer.programProgressSelector.label')"
      :options="options"
      :selected="selectedProgramProgressOption"
      :handle-select-change="onOptionSelected"
    />
  </div>
</template>

<style scoped>
.program-progress-selector {
  display: flex;
  align-items: flex-start;
  align-self: stretch;
}
</style>
