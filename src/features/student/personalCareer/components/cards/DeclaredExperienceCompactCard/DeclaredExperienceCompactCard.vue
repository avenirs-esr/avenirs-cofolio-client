<script lang="ts" setup>
import ValorizedBadge from '@/common/components/ValorizedBadge/ValorizedBadge.vue'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredExperienceCompactCardProps {
  title: string
  valorized: boolean
}
const { title, valorized } = defineProps<DeclaredExperienceCompactCardProps>()

const iconOptions = {
  name: MDI_ICONS.HUB_OUTLINE,
  color: 'var(--icon)',
  bottom: 'calc(-1 * var(--spacing-xl))',
  right: 'var(--spacing-none)',
  borderColor: 'var(--other-border-skill-card)',
}
</script>

<template>
  <FloatingIconCard
    :title="title"
    :icon-options="iconOptions"
    :header-rows="2"
    height="5.625rem"
    border-color="var(--other-border-skill-card)"
    color="var(--surface-background)"
    title-color="var(--text1)"
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
      color: var(--text1);
      text-align: left;
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
}
</style>
