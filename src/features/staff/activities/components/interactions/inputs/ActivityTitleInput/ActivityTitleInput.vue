<script setup lang="ts">
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { ACTIVITY_TITLE_MAX_LENGTH } from '@/features/staff/activities/config'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

type ActivityTitleInputProps = Omit<InputProps, 'maxlength'>

const {
  isTextarea = false,
  labelVisible = false,
  required = true,
  id,
  label,
  errorMessage,
} = defineProps<ActivityTitleInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()
const attr = useAttrs()

const inputProps = computed(() => ({
  ...attr,
  isTextarea,
  required,
  errorMessage,
  class: isTextarea ? 'n4' : undefined,
  labelClass: isTextarea ? 's1-regular' : 'b2-light',
  labelVisible,
  maxlength: ACTIVITY_TITLE_MAX_LENGTH,
  id: id ?? `activity-title-input-${crypto.randomUUID()}`,
  label: label ?? t('staff.activities.interactions.inputs.ActivityTitleInput.label'),
}))
</script>

<template>
  <Input
    v-bind="inputProps"
    v-model="modelValue"
  />
</template>
