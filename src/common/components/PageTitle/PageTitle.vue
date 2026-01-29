<script setup lang="ts">
import type { Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { ROUTES } from '@/common/constants'
import { AvBreadcrumb, type AvBreadcrumbProps, AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface PageTitleProps {
  breadcrumbLinks: AvBreadcrumbProps['links']
  title: string
  back?: RouteLocationRaw
}

const {
  breadcrumbLinks,
  title,
  back = ROUTES.STUDENT.HOME
} = defineProps<PageTitleProps>()

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
  <div class="page-title">
    <h1 class="av-sr-only">
      {{ title }}
    </h1>
    <div class="av-pb-xl">
      <AvBreadcrumb
        :navigation-label="t('global.breadcrumb.ariaLabel')"
        :show-breadcrumb-label="t('global.breadcrumb.expandButtonLabel')"
        :links="breadcrumbLinks"
      />
      <div class="av-row av-gap-sm av-align-center">
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
  </div>
</template>
