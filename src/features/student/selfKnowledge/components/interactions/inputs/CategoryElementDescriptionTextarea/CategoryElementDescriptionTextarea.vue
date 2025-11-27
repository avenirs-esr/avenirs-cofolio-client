<script setup lang="ts">
import { AvInput, type AvInputProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

const {
  isValid = false,
  isTextarea = true,
  labelVisible = true,
  disabled = false,
  required = false,
  maxlength = 400,
  label,
  placeholder,
  errorMessage,
} = defineProps<AvInputProps>()

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
  maxlength,
  errorMessage,
  label: label ?? t('student.selfKnowledge.categoryElementDescriptionTextarea.label'),
  placeholder: placeholder ?? t('student.selfKnowledge.categoryElementDescriptionTextarea.placeholder'),
}))
</script>

<template>
  <div class="self-knowledge-category-element-description-textarea">
    <AvInput
      v-bind="avInputProps"
      v-model="modelValue"
    >
      <template
        v-if="!$slots.customCaptions"
        #customCaptions="{ currentValue }"
      >
        <span class="caption-light">
          {{ t('student.selfKnowledge.categoryElementDescriptionTextarea.hint', {
            count: currentValue?.toString().length || 0,
            maxlength,
          }) }}
        </span>
      </template>
    </AvInput>
  </div>
</template>

<style lang="scss" scoped>
.self-knowledge-category-element-description-textarea {
  :deep(.av-input__wrapper textarea) {
    min-height: 8rem;
  }
}
</style>
