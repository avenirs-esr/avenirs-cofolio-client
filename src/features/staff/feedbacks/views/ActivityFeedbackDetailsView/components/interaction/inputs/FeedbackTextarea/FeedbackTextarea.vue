<script setup lang="ts">
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { FEEDBACK_MAX_LENGTH } from '@/features/staff/feedbacks/config'
import { useI18n } from 'vue-i18n'

type FeedbackTextareaProps = Omit<InputProps, 'maxlength' | 'isTextarea'>

const {
  label,
  ...restProps
} = defineProps<FeedbackTextareaProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const inputProps = computed(() => ({
  ...restProps,
  isTextarea: true,
  labelVisible: true,
  textareaMinHeight: 'var(--dimension-8xl)',
  maxlength: FEEDBACK_MAX_LENGTH,
  label: label ?? t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.inputs.FeedbackTextarea.label')
}))
</script>

<template>
  <Input
    v-bind="inputProps"
    v-model="modelValue"
  />
</template>

<style lang="scss" scoped>
:deep(textarea) {
  resize: none !important;
}
</style>
