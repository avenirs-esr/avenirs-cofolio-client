<script setup lang="ts">
import { AvInput, type AvInputProps } from '@avenirs-esr/avenirs-dsav'
import { type ComputedRef, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface InputProps extends Omit<AvInputProps, 'maxlengthExceededMessage'> { }

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<InputProps>()
const { t } = useI18n()
const attrs = useAttrs()

const hasErrorMessage = computed(() => {
  if (!props.errorMessage) {
    return false
  }
  if (Array.isArray(props.errorMessage)) {
    return props.errorMessage.length > 0
  }
  return true
})

const avInputProps: ComputedRef<AvInputProps> = computed(() => ({
  ...attrs,
  ...props,
  maxlengthExceededMessage: props.maxlength && !hasErrorMessage.value
    ? t('global.error.form.maxLength', { maxLength: props.maxlength })
    : undefined
}))
</script>

<template>
  <AvInput v-bind="avInputProps">
    <template #requiredTip>
      <slot name="requiredTip" />
    </template>

    <template #maxLengthCaption="slotProps">
      <slot
        name="maxLengthCaption"
        v-bind="slotProps"
      />
    </template>

    <template #suffix>
      <slot name="suffix" />
    </template>
  </AvInput>
</template>
