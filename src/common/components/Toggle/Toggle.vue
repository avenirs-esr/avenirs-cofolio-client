<script setup lang="ts">
import { AvToggle, type AvToggleProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ToggleProps extends Omit<AvToggleProps, 'activeText' | 'inactiveText'> { }

const props = defineProps<ToggleProps>()

const { t } = useI18n()
</script>

<template>
  <AvToggle
    v-bind="props"
    :active-text="t('global.avToggle.activeText')"
    :inactive-text="t('global.avToggle.inactiveText')"
  />
</template>
