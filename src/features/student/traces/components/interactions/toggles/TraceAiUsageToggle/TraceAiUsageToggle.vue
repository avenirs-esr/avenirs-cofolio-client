<script setup lang="ts">
import type { ToggleProps } from '@/common/components'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'
import Toggle from '@/common/components/interaction/toggles/Toggle/Toggle.vue'

interface TraceAiUsageToggleProps extends Omit<ToggleProps, 'description' | 'activeText' | 'inactiveText'> {
  description?: string
}

const props = defineProps<TraceAiUsageToggleProps>()

const { t } = useI18n()
const attr = useAttrs()

const toggleProps = computed(() => ({
  ...attr,
  ...props,
  description: props.description ?? t('student.traces.interactions.toggles.TraceAiUsageToggle.description'),
}))
</script>

<template>
  <Toggle
    v-bind="toggleProps"
  />
</template>
