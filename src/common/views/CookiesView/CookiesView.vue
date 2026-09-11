<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useBreadcrumb } from '@/common/composables'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const title = computed(() => t('global.views.cookiesView.title'))

const { breadcrumbLinks } = useBreadcrumb(() => [{ text: title.value }])
</script>

<template>
  <PageTitle
    :title="title"
    :breadcrumb-links="breadcrumbLinks"
  />
</template>
