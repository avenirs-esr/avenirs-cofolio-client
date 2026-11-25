<script lang="ts" setup>
import type { ToolDTO } from '#shared/api/avenir-esr/index'
import type { IconOptions } from '@avenirs-esr/shared'
import { BG_COLORS, ICON_COLORS, TEXT_COLORS } from '#shared/constants/colors'
import { ICONS } from '#shared/constants/icons'
import ToolBanner from '#shared/ui/components/base/ToolBanner/ToolBanner.vue'
import ToolInstitution from '#shared/ui/components/base/ToolInstitution/ToolInstitution.vue'
import FloatingIconCard from '#shared/ui/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { BANNER_RATIO } from '#shared/utils/image.config'
import { AvButton, AvTooltip, useAvBreakpoints, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

export interface ToolCardProps {
  tool: ToolDTO
  baseRouteName?: string
}

const { tool, baseRouteName } = defineProps<ToolCardProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()

const urlRef = ref<HTMLElement | null>(null)

const { isTruncated } = useTextTruncation(urlRef)

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
      :height="isMobile ? 'fit-content' : '26rem'"
      :width="isMobile ? '100%' : '27rem'"
      radius="var(--radius-xl)"
    >
      <template #body>
        <div class="av-col av-gap-sm av-pt-sm">
          <ToolBanner :banner-id="tool.banner?.id" />
          <span class="b2-regular">
            {{ tool.description }}
          </span>
        </div>
      </template>

      <template #footer>
        <div class="av-col av-gap-sm av-w-full">
          <ToolInstitution :tool="tool" />
          <div
            v-if="!baseRouteName"
            class="av-row av-w-full av-justify-end"
          >
            <AvButton
              :label="t(`${i18nKey}.button`)"
              :href="tool.url"
            />
          </div>
          <AvTooltip
            v-else
            :content="tool.url"
            :disabled="!isTruncated"
            force-focusable
          >
            <span
              ref="urlRef"
              class="url caption-regular av-wrap-anywhere av-max-lines"
            >
              {{ tool.url }}
            </span>
          </AvTooltip>
        </div>
      </template>
    </FloatingIconCard>
  </component>
</template>

<style lang="scss" scoped>
.url {
  --max-lines: 3;
}

.banner {
  width: 100%;
  height: auto;
  aspect-ratio: v-bind('bannerRatio');
  object-fit: cover;
}
</style>
