<script setup lang="ts">
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH } from '@/features/personalCareer/config'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

type DeclaredExperienceSummaryTextareaProps = Omit<InputProps, 'maxlength' | 'isTextarea'>

defineOptions({
  inheritAttrs: false
})

const {
  label,
  ...restProps
} = defineProps<DeclaredExperienceSummaryTextareaProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()
const attrs = useAttrs()

const inputProps = computed(() => ({
  ...attrs,
  ...restProps,
  isTextarea: true,
  labelVisible: true,
  textareaMinHeight: '6.5rem',
  maxlength: DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceSummaryTextarea.label')
}))
</script>

<template>
  <div class="declared-experience-summary-textarea">
    <Input
      v-bind="inputProps"
      v-model="modelValue"
    />
  </div>
</template>
