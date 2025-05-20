<script setup lang="ts">
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import type { RouteLocationRaw } from 'vue-router'
import { studentHomeRoute } from '@/features/student/routes'
import { AvButton, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const {
  breadcrumbLinks,
  title,
  back = studentHomeRoute
} = defineProps<{
  breadcrumbLinks: DsfrBreadcrumbProps['links']
  title: string
  back?: RouteLocationRaw
}>()

const router = useRouter()
const { t } = useI18n()

function goBack () {
  router.push(back)
}
</script>

<template>
  <div>
    <DsfrBreadcrumb :links="breadcrumbLinks" />
    <div class="page-title">
      <AvButton
        :label="t('global.buttons.goBack')"
        :icon-only="true"
        variant="OUTLINED"
        :icon="MDI_ICONS.ARROW_LEFT"
        :on-click="goBack"
      />
      <span class="n2">{{ title }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-title {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}

.av-button {
  width: 2.5rem;
  height: 2.5rem;
}
</style>
