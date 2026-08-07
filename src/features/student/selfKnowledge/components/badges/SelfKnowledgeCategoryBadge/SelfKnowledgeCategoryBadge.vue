<script setup lang="ts">
import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeCategoryBadgeProps {
  categoryType: ESelfKnowledgeCategory
}

const { categoryType } = defineProps<SelfKnowledgeCategoryBadgeProps>()

const { t } = useI18n()

const label = computed(() => `# ${t(`student.selfKnowledge.categoryType.${categoryType}`)}`)
</script>

<template>
  <AvBadge
    :label="label"
    color="var(--dark-background-primary1)"
    background-color="var(--light-background-primary1)"
    data-testid="self-knowledge-category-badge"
    small
    ellipsis
  />
</template>
