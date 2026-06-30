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
          <span class="n4 av-text-primary1 av-text-regular">{{ t('global.activities.components.ActivityCatalogPreviewCard.previewTitle') }}</span>
          <span
            class="s2-regular av-text-text1"
            data-testid="activity-summary"
          >
            {{ summary }}
          </span>
        </div>
        <div
          v-if="executionPeriodInfo"
          class="av-col av-flex-fill av-gap-md"
        >
          <span class="n4 av-text-primary1 av-text-regular">{{ t('global.activities.components.ActivityCatalogPreviewCard.periodTitle') }}</span>
          <span
            class="s2-bold av-text-primary1"
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
.s2-bold {
  white-space: pre-line;
}
</style>
