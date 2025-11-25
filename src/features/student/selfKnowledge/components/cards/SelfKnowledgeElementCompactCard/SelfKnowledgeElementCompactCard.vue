<script lang="ts" setup>
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementCompactCardProps {
  title: string
  valorized: boolean
  iconName: string
}

const { iconName } = defineProps<SelfKnowledgeElementCompactCardProps>()

const iconOptions = computed(() => ({
  name: iconName,
  color: 'var(--card)',
  bottom: '-1.25rem',
}))

const { t } = useI18n()
</script>

<template>
  <FloatingIconCard
    :title="title"
    :icon-options="iconOptions"
    :header-rows="2"
    height="5.75rem"
    custom-title-height="3.5rem"
    color="var(--dark-background-primary1)"
    border-color="var(--other-border-skill-card)"
    border-color-on-hover="var(--dark-background-primary1)"
    title-typography-classes="caption-regular"
  >
    <template #body>
      <AvBadge
        v-if="valorized"
        :label="t('student.views.studentProjectTrajectoriesView.selfKnowledge.elementsDetails.valorized')"
        :icon="MDI_ICONS.STAR"
        color="var(--light-foreground-accent)"
        background-color="var(--light-background-accent)"
        border-color="transparent"
        ellipsis
        small
      />
    </template>
  </FloatingIconCard>
</template>

<style lang="scss" scoped>
.floating-icon-card {
  min-width: 13.4375rem !important;
  max-width: 13.4375rem !important;
}

:deep() {
  .floating-icon-card {
    &__title {
      color: var(--card);
      text-align: left;
    }

    &__icon {
      height: var(--dimension-lg);
      width: var(--dimension-lg);
    }
}

  .av-card {
    &__title {
      padding-top: var(--spacing-xs);
      padding-bottom: var(--spacing-xs);
    }
  }

  .av-icon {
    &__icon {
      width: 75% !important;
      height: 75% !important;
    }
  }
}
</style>
