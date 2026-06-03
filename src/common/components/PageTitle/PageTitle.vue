<script setup lang="ts">
import type { Slot } from 'vue'
import { AvBreadcrumb, type AvBreadcrumbProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface PageTitleProps {
  breadcrumbLinks: AvBreadcrumbProps['links']
  title: string
}

const {
  breadcrumbLinks,
  title,
} = defineProps<PageTitleProps>()

defineSlots<{
  title: Slot
}>()

const { t } = useI18n()
</script>

<template>
  <div
    class="page-title"
    data-testid="page-title"
  >
    <div class="av-col av-gap-sm av-pb-lg">
      <AvBreadcrumb
        :navigation-label="t('global.breadcrumb.ariaLabel')"
        :show-breadcrumb-label="t('global.breadcrumb.expandButtonLabel')"
        :links="breadcrumbLinks"
      />
      <slot name="title">
        <h1>{{ title }}</h1>
      </slot>
    </div>
  </div>
</template>
