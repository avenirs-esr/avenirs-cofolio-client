<script setup lang="ts">
import { AvIconText, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { countExperiences, gap = 'var(--spacing-xs)' } = defineProps<{ countExperiences: number, gap?: string }>()

const { t } = useI18n()
</script>

<template>
  <AvIconText
    :icon="MDI_ICONS.ELECTRON_FRAMEWORK"
    :text="t('student.iconTexts.studentCountExperiencesIconText.text', { count: countExperiences })"
    :gap="gap"
    icon-color="var(--text1)"
    text-color="var(--text1)"
    typography-class="b2-regular"
  />
</template>

<style lang="scss" scoped></style>
