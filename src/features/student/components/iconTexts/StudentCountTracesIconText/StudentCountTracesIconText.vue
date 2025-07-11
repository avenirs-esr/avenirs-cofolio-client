<script setup lang="ts">
import { AvIconText, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { countTraces, gap = 'var(--spacing-xs)' } = defineProps<{ countTraces: number, gap?: string }>()

const { t } = useI18n()
</script>

<template>
  <AvIconText
    :icon="MDI_ICONS.ATTACH_FILE"
    :text="t('student.iconTexts.studentCountTracesIconText.text', { count: countTraces })"
    :gap="gap"
    icon-color="var(--text1)"
    text-color="var(--text1)"
    typography-class="b2-regular"
  />
</template>

<style lang="scss" scoped></style>
