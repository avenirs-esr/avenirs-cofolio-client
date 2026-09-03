<script setup lang="ts">
import PageTitle, { type PageTitleProps } from '@/common/components/PageTitle/PageTitle.vue'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineProps<PageTitleProps>()

const { t } = useI18n()

const titleRef = ref<HTMLElement | null>(null)

const { isTruncated } = useTextTruncation(titleRef)
</script>

<template>
  <PageTitle v-bind="$props">
    <template #title>
      <h1 class="av-text-title">
        {{ t('global.detail') }}
        <AvTooltip
          :disabled="!isTruncated"
          :content="title"
          force-focusable
        >
          <span
            ref="titleRef"
            class="n4 av-max-lines"
          >
            {{ title }}
          </span>
        </AvTooltip>
      </h1>
    </template>
  </PageTitle>
</template>

<style lang="scss" scoped>
.n4 {
  color: var(--dark-background-neutral)
}
</style>
