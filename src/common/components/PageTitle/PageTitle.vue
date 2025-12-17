<script setup lang="ts">
import type { Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { ROUTES } from '@/common/constants'
import { AvBreadcrumb, type AvBreadcrumbProps, AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const {
  breadcrumbLinks,
  title,
  back = ROUTES.STUDENT.HOME
} = defineProps<{
  breadcrumbLinks: AvBreadcrumbProps['links']
  title: string
  back?: RouteLocationRaw
}>()

defineSlots<{
  title: Slot
}>()

const router = useRouter()
const { t } = useI18n()

function goBack () {
  if (window.history.state?.back) {
    router.back()
  }
  else {
    router.push(back)
  }
}
</script>

<template>
  <h1 class="av-sr-only">
    {{ title }}
  </h1>
  <div class="page-title-container">
    <AvBreadcrumb :links="breadcrumbLinks" />
    <div class="page-title">
      <AvButton
        :label="t('global.buttons.goBack')"
        :icon-only="true"
        variant="OUTLINED"
        :icon="MDI_ICONS.ARROW_LEFT_THIN"
        @click="goBack"
      />
      <slot name="title">
        <span class="n2">{{ title }}</span>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-title-container {
  padding-bottom: var(--spacing-xl);
}

.page-title {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-sm);
  align-items: center;
}

.av-button {
  width: var(--dimension-xl);
  height: var(--dimension-xl);
}
</style>
