<script setup lang="ts">
import { AvButton, AvCard, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface HomeWidgetProps {
  title: string
  titleIcon: string
  seeAllLabel: string
  displayWidget?: boolean
  type: 'main' | 'side'
}

const { displayWidget = true } = defineProps<HomeWidgetProps>()

defineEmits<{
  (e: 'seeAllClick'): void
}>()
</script>

<template>
  <AvCard
    v-if="displayWidget"
    :class="`home-${type}-widget`"
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
  >
    <template #title>
      <div
        class="av-w-full"
        data-testid="home-widget-title"
      >
        <AvIconText
          :icon="titleIcon"
          :text="title"
          :title="title"
          icon-color="var(--icon)"
          :text-color="type === 'main' ? 'var(--title)' : 'var(--text1)'"
          :typography-class="type === 'main' ? 'n5' : 's1-bold'"
          gap="var(--spacing-xs)"
        />
      </div>
    </template>
    <template #body>
      <slot />
    </template>
    <template #footer>
      <div class="av-row av-justify-end av-pt-sm">
        <AvButton
          :label="seeAllLabel"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          small
          data-testid="see-all-button"
          @click="$emit('seeAllClick')"
        />
      </div>
    </template>
  </AvCard>
</template>
