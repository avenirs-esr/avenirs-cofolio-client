<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.activities.header') }
])
</script>

<template>
  <PageTitle
    :title="t('staff.global.views.ActivitiesView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STAFF.HOME"
  />
</template>
