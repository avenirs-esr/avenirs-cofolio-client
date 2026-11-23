<script lang="ts" setup>
import type { ToolDTO } from '#shared/api/avenir-esr/index'
import type { IconOptions } from '@avenirs-esr/shared'
import { useStorageImage } from '#shared/composables/use-storage-image/use-storage-image'
import { BG_COLORS, ICON_COLORS, TEXT_COLORS } from '#shared/constants/colors'
import { ICONS } from '#shared/constants/icons'
import FloatingIconCard from '#shared/ui/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { BANNER_RATIO } from '#shared/utils/image.config'
import { AvButton, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

export interface ToolCardProps {
  tool: ToolDTO
  baseRouteName?: string
}

const { tool, baseRouteName } = defineProps<ToolCardProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
const { url: bannerUrl } = useStorageImage(() => tool.banner?.id || undefined, 'cover')

const bannerRatio = `${BANNER_RATIO}`

const iconOptions: IconOptions = {
  name: ICONS.TOOLS,
  color: ICON_COLORS.TOOLS,
  borderColor: 'var(--stroke)',
  bottom: 'var(--spacing-xl-neg)'
}

const i18nKey = 'global.components.cards.ToolCard'

const routerProps = computed(() => baseRouteName ? { to: { name: baseRouteName, params: { id: tool.id } } } : {})
</script>

<template>
  <component
    :is="baseRouteName ? RouterLink : 'div'"
    v-bind="routerProps"
  >
    <FloatingIconCard
      :title="tool.name ?? ''"
      :color="BG_COLORS.TOOLS"
      border-color="var(--other-border-skill-card)"
      :title-color="TEXT_COLORS.TOOLS"
      title-typography-classes="b2-bold"
      :icon-options="iconOptions"
      :header-rows="2"
      border-color-on-hover="var(--dark-background-primary1)"
      :hoverable="!!baseRouteName"
      height="23rem"
      :width="isMobile ? '100%' : '27rem'"
      radius="var(--radius-xl)"
    >
      <template #body>
        <div class="av-col av-gap-sm av-pt-sm">
          <img
            :src="bannerUrl"
            :alt="t(`${i18nKey}.imgAlt`)"
            class="banner av-w-full av-h-full av-radius-md"
            data-testid="activity-banner"
          >
          <span class="b2-regular">
            {{ tool.description }}
          </span>
        </div>
      </template>

      <template #footer>
        <div
          v-if="!baseRouteName"
          class="av-row av-w-full av-justify-end"
        >
          <AvButton
            :label="t(`${i18nKey}.button`)"
            :href="tool.url"
          />
        </div>
        <div
          v-else
          class="ellipsis-container"
        >
          <span class="caption-regular av-ellipsis">
            {{ tool.url }}
          </span>
        </div>
      </template>
    </FloatingIconCard>
  </component>
</template>

<style lang="scss" scoped>
.banner {
  width: 100%;
  height: auto;
  aspect-ratio: v-bind('bannerRatio');
  object-fit: cover;
}
</style>
