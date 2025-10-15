<script setup lang="ts">
import { AvInput, type AvInputProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface TracePersonalNoteTextareaProps extends Omit<AvInputProps, 'label' | 'placeholder' | 'modelValue' | 'maxlength' | 'isTextarea'> {
  label?: string
  placeholder?: string
  maxlength?: number
  isTextarea?: boolean
}

const props = withDefaults(defineProps<TracePersonalNoteTextareaProps>(), {
  isValid: false,
  isTextarea: true,
  labelVisible: true,
  disabled: false,
  required: false,
  maxlength: 200
})

const modelValue = defineModel<string>()
const { t } = useI18n()

const avInputProps = computed(() => ({
  ...props,
  label: props.label ?? t('student.components.tracePersonalNoteTextarea.label'),
  placeholder: props.placeholder ?? t('student.components.tracePersonalNoteTextarea.placeholder')
}))
</script>

<template>
  <div class="trace-personal-note-textarea">
    <AvInput
      v-bind="avInputProps"
      v-model="modelValue"
    >
      <template
        v-if="!$slots.customCaptions"
        #customCaptions="{ currentValue }"
      >
        <span class="caption-light">
          {{ t('student.components.tracePersonalNoteTextarea.hint', {
            count: currentValue?.toString().length || 0,
            maxlength,
          }) }}
        </span>
      </template>
    </AvInput>
  </div>
</template>

<style lang="scss" scoped>
.trace-personal-note-textarea {
  display: flex;
  flex-direction: column;
  flex: 1;

  :deep(.av-input),
  :deep(.av-input__wrapper) {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  :deep(.av-input__wrapper textarea) {
    height: 100%;
  }
}
</style>
