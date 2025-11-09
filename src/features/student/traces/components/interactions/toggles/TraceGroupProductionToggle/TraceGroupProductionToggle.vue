<script setup lang="ts">
import type { ToggleProps } from '@/common/components'
import Toggle from 'src/common/components/Toggle/Toggle.vue'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceGroupProductionToggleProps extends Omit<ToggleProps, 'description'> {
  description?: string
}

const props = defineProps<TraceGroupProductionToggleProps>()

const { t } = useI18n()
const attr = useAttrs()

const toggleProps = computed(() => ({
  ...attr,
  ...props,
  description: props.description ?? t('student.traces.traceGroupProductionToggle.description')
}))
</script>

<template>
  <Toggle
    v-bind="toggleProps"
  />
</template>
