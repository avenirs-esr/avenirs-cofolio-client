<script lang="ts" setup>
import { useStorageImage } from '#shared/composables/index'
import { BANNER_RATIO } from '#shared/utils/image.config'
import { useI18n } from 'vue-i18n'

export interface ToolBannerProps {
  bannerId?: string
}

const { bannerId } = defineProps<ToolBannerProps>()

const { t } = useI18n()
const { url: bannerUrl } = useStorageImage(() => bannerId, 'cover')

const bannerRatio = `${BANNER_RATIO}`
</script>

<template>
  <img
    :src="bannerUrl"
    :alt="t(`global.components.base.ToolBanner.alt`)"
    class="banner av-w-full av-h-full av-radius-md"
    data-testid="tool-banner"
  >
</template>

<style lang="scss" scoped>
.banner {
  aspect-ratio: v-bind('bannerRatio');
  object-fit: cover;
}
</style>
