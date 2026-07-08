<script setup lang="ts">
import type { ToggleProps } from '@/common/components'
import Toggle from '@/common/components/Toggle/Toggle.vue'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceValorizationToggleProps extends Omit<ToggleProps, 'description' | 'activeText' | 'inactiveText'> {
  description?: string
}

const props = defineProps<TraceValorizationToggleProps >()

const { t } = useI18n()
const attr = useAttrs()

const toggleProps = computed(() => ({
  ...attr,
  ...props,
  description: props.description ?? t('student.traces.interactions.toggles.TraceValorizationToggle.description'),
}))
</script>

<template>
  <Toggle
    v-bind="toggleProps"
  />
</template>
