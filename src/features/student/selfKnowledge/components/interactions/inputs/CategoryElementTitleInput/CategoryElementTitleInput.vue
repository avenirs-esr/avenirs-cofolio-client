<script setup lang="ts">
import { SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH } from '@/features/student/buildProject/config'
import { AvInput, type AvInputProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface CategoryElementTitleInputProps extends AvInputProps {
}

const {
  isValid = false,
  isTextarea = false,
  labelVisible = true,
  disabled = false,
  required = true,
  label,
  prefixIcon,
  placeholder,
  maxlength = SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH,
  errorMessage,
} = defineProps<CategoryElementTitleInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()
const attr = useAttrs()

const avInputProps = computed(() => ({
  ...attr,
  isValid,
  isTextarea,
  labelVisible,
  disabled,
  required,
  errorMessage,
  label: label ?? t('student.selfKnowledge.interactions.inputs.CategoryElementTitleInput.label'),
  prefixIcon,
  placeholder: placeholder ?? t('student.selfKnowledge.interactions.inputs.CategoryElementTitleInput.placeholder')
}))
</script>

<template>
  <AvInput
    v-bind="avInputProps"
    v-model="modelValue"
  >
    <template
      v-if="!$slots.maxLengthCaption"
      #maxLengthCaption="{ currentValue }"
    >
      <span class="caption-light">
        {{ t('global.inputs.textarea.limit', {
          count: currentValue?.toString().length || 0,
          maxlength,
        }) }}
      </span>
    </template>
  </AvInput>
</template>
