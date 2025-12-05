<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTE_NAMES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.tools.items.pages') }
])
</script>

<template>
  <PageTitle
    :title="t('student.global.views.studentToolsPagesView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTE_NAMES.STUDENT.HOME"
  />
</template>
