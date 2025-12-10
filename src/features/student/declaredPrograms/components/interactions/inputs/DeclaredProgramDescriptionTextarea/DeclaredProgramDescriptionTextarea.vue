<script setup lang="ts">
import { DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH } from '@/features/student/declaredPrograms/config'
import { AvInput, type AvInputProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredProgramDescriptionTextareaProps = Omit<AvInputProps, 'maxlength' | 'isTextarea'>

const {
  label,
  ...restProps
} = defineProps<DeclaredProgramDescriptionTextareaProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const avInputProps = computed(() => ({
  ...restProps,
  isTextarea: true,
  labelVisible: true,
  textareaMinHeight: '6.5rem',
  maxlength: DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH,
  label: label ?? t('student.declaredPrograms.interactions.inputs.DeclaredProgramDescriptionTextarea.label')
}))
</script>

<template>
  <div class="declared-program-description-textarea">
    <AvInput
      v-bind="avInputProps"
      v-model="modelValue"
    >
      <template #customCaptions="{ currentValue }">
        <span class="caption-light">
          {{ t('global.inputs.textarea.limit', {
            count: currentValue?.toString().length || 0,
            maxlength: avInputProps.maxlength,
          }) }}
        </span>
      </template>
    </AvInput>
  </div>
</template>
