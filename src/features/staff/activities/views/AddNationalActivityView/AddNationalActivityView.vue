<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.activities.header'), to: ROUTES.STAFF.ACTIVITIES },
  { text: t('staff.global.navigation.tabs.activities.items.addNationalActivity') }
])
</script>

<template>
  <PageTitle
    :title="t('staff.global.views.AddNationalActivityView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STAFF.ACTIVITIES"
  />
</template>
