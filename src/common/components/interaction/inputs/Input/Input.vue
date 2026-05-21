<script setup lang="ts">
import { AvInput, type AvInputProps } from '@avenirs-esr/avenirs-dsav'
import { type ComputedRef, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface InputProps extends AvInputProps { }

const props = defineProps<InputProps>()
const { t } = useI18n()
const attrs = useAttrs()

const content = defineModel<string | number | null>()

const avInputProps: ComputedRef<AvInputProps> = computed(() => ({
  ...attrs,
  ...props,
}))
</script>

<template>
  <AvInput
    v-model="content"
    v-bind="avInputProps"
  >
    <template
      v-if="avInputProps.maxlength"
      #maxLengthCaption="{ currentValue }"
    >
      <span
        class="caption-light"
        :class="{ 'maxlength-error': (currentValue?.toString().length || 0) > avInputProps.maxlength }"
        data-testid="maxlength-caption"
      >
        {{ t('global.inputs.textarea.limit', {
          count: currentValue?.toString().length || 0,
          maxlength: avInputProps.maxlength,
        }) }}
      </span>
    </template>
  </AvInput>
</template>

<style lang="scss" scoped>
.maxlength-error {
  color: var(--dark-background-error);
}
</style>
