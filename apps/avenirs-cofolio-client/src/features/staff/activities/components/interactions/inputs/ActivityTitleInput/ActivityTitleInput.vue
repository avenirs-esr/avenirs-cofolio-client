<script setup lang="ts">
import type { InputProps } from '@avenirs-esr/shared'
import type { ComputedRef } from 'vue'
import { Input } from '@avenirs-esr/shared'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'
import { ACTIVITY_TITLE_MAX_LENGTH } from '@/features/staff/activities/config'

export interface ActivityTitleInputProps extends Omit<InputProps, 'label' | 'maxlength'> {
  isSubActivity?: boolean
}

const {
  isSubActivity = false,
  isTextarea = false,
  labelVisible = false,
  required = true,
  id,
  errorMessage,
} = defineProps<ActivityTitleInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()
const attr = useAttrs()

const inputProps: ComputedRef<InputProps> = computed(() => ({
  ...attr,
  isTextarea,
  required,
  errorMessage,
  class: isTextarea ? 'n4' : undefined,
  labelClass: isTextarea ? 's1-regular' : 'b2-light',
  labelVisible,
  maxlength: ACTIVITY_TITLE_MAX_LENGTH,
  id: id ?? `activity-title-input-${crypto.randomUUID()}`,
  label: t(`staff.activities.interactions.inputs.ActivityTitleInput.label.${isSubActivity ? 'subActivity' : 'activity'}`),
}))
</script>

<template>
  <Input
    v-bind="inputProps"
    v-model="modelValue"
  />
</template>
