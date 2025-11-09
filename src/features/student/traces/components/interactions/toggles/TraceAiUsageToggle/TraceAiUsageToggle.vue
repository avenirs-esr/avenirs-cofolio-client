<script setup lang="ts">
import type { ToggleProps } from '@/common/components'
import Toggle from 'src/common/components/Toggle/Toggle.vue'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceAiUsageToggleProps extends Omit<ToggleProps, 'description' | 'activeText' | 'inactiveText'> {
  description?: string
}

const props = defineProps<TraceAiUsageToggleProps>()

const { t } = useI18n()
const attr = useAttrs()

const toggleProps = computed(() => ({
  ...attr,
  ...props,
  description: props.description ?? t('student.traces.traceAiUsageToggle.description'),
}))
</script>

<template>
  <Toggle
    v-bind="toggleProps"
  />
</template>
