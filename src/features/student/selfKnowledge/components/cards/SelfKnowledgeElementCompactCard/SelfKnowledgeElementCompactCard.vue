<script lang="ts" setup>
import ValorizedBadge from '@/common/components/ValorizedBadge/ValorizedBadge.vue'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'

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
      <ValorizedBadge v-if="valorized" />
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

    &__content-collapsible {
      padding-top: var(--spacing-xxs) !important;
    }
  }

  .av-icon {
    scale: 0.75 !important;
  }
}
</style>
