<script setup lang="ts">
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface AvNotFoundMessageProps {
  title: string
  description: string
}

const { title, description } = defineProps<AvNotFoundMessageProps>()
</script>

<template>
  <div
    class="av-error-message av-col av-align-center av-justify-center av-gap-sm"
    data-testid="error-message"
  >
    <AvIcon
      :name="MDI_ICONS.ALERT_OUTLINE"
      :size="2.5"
      color="var(--dark-background-error)"
    />
    <div class="av-col av-align-center av-gap-sm av-text-center">
      <h3 class="av-error-message__title">
        {{ title }}
      </h3>
      <p class="av-error-message__description">
        {{ description }}
      </p>
    </div>
  </div>
</template>
