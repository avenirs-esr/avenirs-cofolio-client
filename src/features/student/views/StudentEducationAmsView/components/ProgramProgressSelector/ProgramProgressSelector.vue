<script setup lang="ts">
import type { ProgramProgressDTO } from '@/api/avenir-esr'
import type { AvTagPickerOption, } from '@/ui'
import type { ComputedRef, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { programs, selectedProgram: selectedProgramInput } = defineProps<{
  programs: ProgramProgressDTO[]
  selectedProgram?: ProgramProgressDTO
}>()
const emit = defineEmits<{
  (event: 'programSelected', program: ProgramProgressDTO): void
}>()

const { t } = useI18n()

function mapProgramToOption (program: ProgramProgressDTO): AvTagPickerOption {
  return {
    label: program.name,
    value: program.id,
  }
}
const selectedProgramOption: Ref<AvTagPickerOption | undefined> = ref(
  selectedProgramInput ? mapProgramToOption(selectedProgramInput) : undefined
)

const options: ComputedRef<AvTagPickerOption[]> = computed(() => programs.map(programProgress => ({
  label: programProgress.name,
  value: programProgress.id,
})))

function onOptionSelected (selected: AvTagPickerOption): void {
  const foundProgram = programs.find(program => program.id === selected.value)
  if (foundProgram) {
    selectedProgramOption.value = selected
    emit('programSelected', foundProgram)
  }
}
</script>

<template>
  <div class="program-progress-selector">
    <AvTagPicker
      :label="t('student.views.studentEducationAmsView.amsListContainer.programProgressSelector.label')"
      :options="options"
      :selected="selectedProgramOption"
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
