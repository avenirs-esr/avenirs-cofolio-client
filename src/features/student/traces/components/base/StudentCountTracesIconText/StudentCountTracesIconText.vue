<script setup lang="ts">
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { countTraces } = defineProps<{ countTraces: number }>()

const { t } = useI18n()
</script>

<template>
  <AvIconText
    :icon="MDI_ICONS.ATTACH_FILE"
    :text="t('student.traces.base.StudentCountTracesIconText.text', { count: countTraces })"
    gap="var(--spacing-xs)"
    icon-color="var(--text1)"
    text-color="var(--text1)"
    typography-class="b2-regular"
  />
</template>

<style lang="scss" scoped></style>
