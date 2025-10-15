<script setup lang="ts">
import { AvToggle, type AvToggleProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceAuthenticDeclarationToggleProps extends Omit<AvToggleProps, 'description' | 'activeText' | 'inactiveText'> {
  description?: string
  activeText?: string
  inactiveText?: string
}

const props = defineProps<TraceAuthenticDeclarationToggleProps>()

const { t } = useI18n()
const attr = useAttrs()

const avToggleProps = computed(() => ({
  ...attr,
  ...props,
  description: props.description ?? t('student.components.traceAuthenticDeclarationToggle.description'),
  activeText: props.activeText ?? t('global.avToggle.activeText'),
  inactiveText: props.inactiveText ?? t('global.avToggle.inactiveText')
}))
</script>

<template>
  <AvToggle
    v-bind="avToggleProps"
  />
</template>
