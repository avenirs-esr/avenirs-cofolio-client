<script setup lang="ts">
import { AvIconText, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { countAms } = defineProps<{ countAms: number }>()

const { t } = useI18n()
</script>

<template>
  <AvIconText
    :icon="MDI_ICONS.TEST_TUBE_EMPTY"
    :text="t('student.iconTexts.studentCountAmsIconText.text', { count: countAms })"
    icon-color="var(--text1)"
    text-color="var(--text1)"
    typography-class="b2-regular"
    gap="var(--spacing-xs)"
  />
</template>

<style lang="scss" scoped></style>
