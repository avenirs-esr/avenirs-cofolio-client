<script lang="ts" setup>
import { AvIcon, AvTooltip, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface InformationTooltipProps {
  content: string
  size?: number
}

defineProps<InformationTooltipProps>()
</script>

<template>
  <AvTooltip
    :content="content"
    force-focusable
    data-testid="information-tooltip"
  >
    <AvIcon
      :name="MDI_ICONS.QUESTION_MARK_CIRCLE_OUTLINE"
      color="var(--dark-background-info)"
      :size="size"
    />
  </AvTooltip>
</template>
