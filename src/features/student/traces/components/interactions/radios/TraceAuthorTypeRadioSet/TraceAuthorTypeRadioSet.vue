<script setup lang="ts">
import { ETraceAuthorType } from '@/api/avenir-esr'
import { AvRadioButton, AvRadioButtonSet } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface TraceAuthorTypeRadioSetProps {
  errorMessage?: string
}

const {
  errorMessage
} = defineProps<TraceAuthorTypeRadioSetProps>()

const modelValue = defineModel<ETraceAuthorType | null>()

const { t } = useI18n()

const authorTypeOptions = Object.values(ETraceAuthorType).map(value => ({
  value,
  description: `student.traces.interactions.radios.authorType.${value}`
}))

function handleUpdateModelValue (value: string | number | boolean) {
  modelValue.value = value as ETraceAuthorType
}
</script>

<template>
  <div
    class="av-col av-gap-sm"
    data-testid="trace-author-type-radio-set"
  >
    <AvRadioButtonSet
      :model-value="modelValue ?? undefined"
      :error-message="errorMessage"
      name="authorType"
      @update:model-value="handleUpdateModelValue"
    >
      <template
        v-for="option in authorTypeOptions"
        :key="option.value"
      >
        <AvRadioButton
          :value="option.value"
          data-testid="trace-author-type-radio-button"
        >
          <div class="av-col av-gap-xs">
            <span class="b2-regular av-text-text2">
              {{ t(option.description) }}
            </span>
          </div>
        </AvRadioButton>
      </template>
    </AvRadioButtonSet>
  </div>
</template>
