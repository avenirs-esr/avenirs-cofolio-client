<script setup lang="ts">
import type { Slot } from 'vue'
import PageTitle, { type PageTitleProps } from '@/common/components/PageTitle/PageTitle.vue'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineProps<PageTitleProps>()

defineSlots<{
  actions?: Slot
}>()

const { t } = useI18n()

const titleRef = ref<HTMLElement | null>(null)

const { isTruncated } = useTextTruncation(titleRef)
</script>

<template>
  <PageTitle v-bind="$props">
    <template #title>
      <h1 class="av-text-title av-row av-gap-sm av-align-baseline">
        {{ t('global.buttons.update') }}
        <AvTooltip
          :disabled="!isTruncated"
          :content="title"
          force-focusable
        >
          <span
            ref="titleRef"
            class="n4 av-max-lines"
          >{{ title }}</span>
        </AvTooltip>
      </h1>
    </template>
    <template #actions>
      <slot name="actions" />
    </template>
  </PageTitle>
</template>

<style lang="scss" scoped>
.n4 {
  --max-lines: 1;
  color: var(--dark-background-neutral)
}
</style>
