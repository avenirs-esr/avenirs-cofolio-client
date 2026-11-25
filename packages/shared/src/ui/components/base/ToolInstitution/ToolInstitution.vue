<script lang="ts" setup>
import type { ToolDTO } from '#shared/api/avenir-esr/index'
import type { AvIconTextProps } from '@avenirs-esr/avenirs-dsav'
import { EToolType } from '#shared/api/avenir-esr/index'
import { ICONS } from '#shared/constants/icons'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import { computed } from 'vue'

export interface ToolInstitutionProps {
  tool: ToolDTO
  typographyClass?: string
}

const { tool, typographyClass = 'caption-regular' } = defineProps<ToolInstitutionProps>()

const avIconTextProps = computed<AvIconTextProps | undefined>(() => {
  if (!tool.institution?.name || !tool.type || tool.type === EToolType.NATIONAL) {
    return undefined
  }

  let icon: string

  switch (tool.type) {
    case EToolType.REGIONAL:
      icon = ICONS.REGIONAL
      break
    case EToolType.LOCAL:
    default:
      icon = ICONS.LOCAL
  }

  return {
    icon,
    iconColor: 'var(--icon)',
    text: tool.institution?.name,
    typographyClass,
    inline: true
  }
})
</script>

<template>
  <AvIconText
    v-if="avIconTextProps"
    v-bind="avIconTextProps"
  />
</template>
