<script lang="ts" setup>
import type { IconOptions } from '@avenirs-esr/shared'
import { AvButton, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { BANNER_RATIO, FloatingIconCard, ICONS } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { useStorageImage } from '@/common/composables/use-storage-image/use-storage-image'

export interface ToolCardProps {
  name: string
  bannerId?: string
  description: string
  url: string
}

const { bannerId } = defineProps<ToolCardProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
const { url: bannerUrl } = useStorageImage(() => bannerId || undefined, 'cover')

const bannerRatio = `${BANNER_RATIO}`
const titleColor = 'var(--light-foreground-neutral)'
const titleBackgroundColor = 'var(--light-background-neutral)'
const borderColor = 'var(--stroke)'

const iconOptions: IconOptions = {
  name: ICONS.TOOLS,
  color: titleColor,
  borderColor,
  bottom: 'var(--spacing-xl-neg)'
}
</script>

<template>
  <FloatingIconCard
    :title="name"
    :color="titleBackgroundColor"
    :border-color="borderColor"
    :title-color="titleColor"
    title-typography-classes="b2-bold"
    :icon-options="iconOptions"
    :header-rows="2"
    :border-color-on-hover="borderColor"
    :hoverable="false"
    height="23rem"
    :width="isMobile ? '100%' : '27rem'"
    radius="var(--radius-xl)"
  >
    <template #body>
      <div class="av-col av-gap-sm av-pt-sm">
        <img
          :src="bannerUrl"
          :alt="t('student.tools.views.ToolsView.components.cards.ToolCard.imgAlt')"
          class="banner av-w-full av-h-full av-radius-md"
          data-testid="activity-banner"
        >
        <span class="b2-regular">
          {{ description }}
        </span>
      </div>
    </template>

    <template #footer>
      <div class="av-row av-w-full av-justify-end">
        <AvButton
          :label="t('student.tools.views.ToolsView.components.cards.ToolCard.button')"
          :href="url"
        />
      </div>
    </template>
  </FloatingIconCard>
</template>

<style lang="scss" scoped>
.banner {
  width: 100%;
  height: auto;
  aspect-ratio: v-bind('bannerRatio');
  object-fit: cover;
}
</style>
