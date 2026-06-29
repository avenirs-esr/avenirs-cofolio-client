<script lang="ts" setup>
import type { Slot } from 'vue'
import Card from '@/common/components/cards/Card/Card.vue'
import { useI18n } from 'vue-i18n'

export interface ActivityCatalogPreviewCardProps {
  summary: string
  executionPeriodInfo?: string
}

const {
  summary,
  executionPeriodInfo,
} = defineProps<ActivityCatalogPreviewCardProps>()

defineSlots<{
  actions?: Slot
}>()

const { t } = useI18n()
</script>

<template>
  <Card
    background-color="var(--card2)"
    border-color="transparent"
  >
    <div class="av-col av-gap-sm">
      <div class="av-col av-row--md av-justify-between--md av-gap-xl">
        <div class="av-col av-flex-fill av-gap-md">
          <span class="n4">{{ t('global.activities.components.ActivityCatalogPreviewCard.previewTitle') }}</span>
          <span
            class="s2-regular"
            data-testid="activity-summary"
          >
            {{ summary }}
          </span>
        </div>
        <div class="av-col av-flex-fill av-gap-md">
          <span class="n4">{{ t('global.activities.components.ActivityCatalogPreviewCard.periodTitle') }}</span>
          <span
            class="s2-bold"
            data-testid="activity-execution-period-info"
          >
            {{ executionPeriodInfo }}
          </span>
        </div>
      </div>
      <div
        v-if="$slots.actions"
        class="av-row av-justify-end av-gap-md"
      >
        <slot name="actions" />
      </div>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.n4 {
  color: var(--dark-background-primary1);
}

.s2-regular {
  color: var(--text1);
}

.s2-bold {
  color: var(--dark-background-primary1);
  white-space: pre-line;
}
</style>
