<script setup lang="ts">
import { AvIconText, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { countSkills } = defineProps<{ countSkills: number }>()

const { t } = useI18n()
</script>

<template>
  <AvIconText
    :icon="MDI_ICONS.STAR_SHOOTING_OUTLINE"
    :text="t('student.iconTexts.studentCountSkillsIconText.text', { count: countSkills })"
    icon-color="var(--text1)"
    text-color="var(--text1)"
    typography-class="b2-regular"
    gap="var(--spacing-xs)"
  />
</template>

<style lang="scss" scoped></style>
