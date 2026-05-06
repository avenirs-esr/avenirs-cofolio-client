<script setup lang="ts">
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

type DeclaredExperienceDescriptionTextareaProps = Omit<InputProps, 'maxlength' | 'isTextarea'>

defineOptions({
  inheritAttrs: false
})

const {
  label,
  ...restProps
} = defineProps<DeclaredExperienceDescriptionTextareaProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()
const attrs = useAttrs()

const avInputProps = computed(() => ({
  ...attrs,
  ...restProps,
  isTextarea: true,
  labelVisible: true,
  textareaMinHeight: '6.5rem',
  maxlength: DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceDescriptionTextarea.label')
}))
</script>

<template>
  <div class="declared-experience-description-textarea">
    <Input
      v-bind="avInputProps"
      v-model="modelValue"
    >
      <template #maxLengthCaption="{ currentValue }">
        <span class="caption-light">
          {{ t('global.inputs.textarea.limit', {
            count: currentValue?.toString().length || 0,
            maxlength: avInputProps.maxlength,
          }) }}
        </span>
      </template>
    </Input>
  </div>
</template>
