<script setup lang="ts">
import Card from '@/common/components/cards/Card/Card.vue'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'

export interface AssociatedDeclaredActivitiesCardProps {
  title: string
  icon: string
}

defineProps<AssociatedDeclaredActivitiesCardProps>()
</script>

<template>
  <Card
    background-color="var(--card2)"
    title-background="var(--card2)"
    border-color="var(--other-border-skill-card)"
    collapsible
    collapsed
  >
    <template #title>
      <div class="av-row av-flex-fill av-justify-start">
        <AvIconText
          typography-class="n4"
          :icon="icon"
          icon-color="var(--text2)"
          :text="title"
          text-color="var(--text1)"
          gap="var(--spacing-sm)"
          data-testid="associations-card-title"
          inline
        />
      </div>
    </template>
    <div
      v-if="$slots.default"
      data-testid="associations-card-container"
      class="av-row av-wrap av-align-center av-gap-md"
    >
      <slot />
    </div>
  </Card>
</template>
