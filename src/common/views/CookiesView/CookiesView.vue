<script setup lang="ts">
import type { RoutePageProps } from '@/common/types'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useI18n } from 'vue-i18n'

const { breadcrumbLinksRaw = [] } = defineProps<RoutePageProps>()

const { t } = useI18n()

const title = computed(() => t('global.views.cookiesView.title'))

const allBreadcrumbLinks = computed(() => [
  ...breadcrumbLinksRaw.map(link => ({ text: t(link.textKey), to: link.to })),
  { text: title.value },
])
</script>

<template>
  <PageTitle
    :title="title"
    :breadcrumb-links="allBreadcrumbLinks"
  />
</template>
