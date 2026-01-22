<script lang="ts" setup>
import { AvCard, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface StudentTraceAssociationCardProps {
  title: string
  icon?: string
}

const {
  icon = MDI_ICONS.STAR_SHOOTING_OUTLINE
} = defineProps<StudentTraceAssociationCardProps>()
</script>

<template>
  <AvCard border-color="var(--other-border-skill-card)">
    <template #title>
      <div class="av-row av-align-center av-justify-between av-flex-fill">
        <AvIconText
          :icon="icon"
          :text="title"
          text-color="var(--text2)"
          icon-color="var(--text2)"
          gap="var(--spacing-sm)"
        />
        <slot name="title-prepend" />
      </div>
    </template>
    <template #body>
      <div class="av-col av-px-xs av-gap-lg">
        <slot name="body" />
      </div>
    </template>
  </AvCard>
</template>
