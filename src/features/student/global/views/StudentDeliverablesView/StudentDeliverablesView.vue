<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.views.studentDeliverablesView.title') }
])
</script>

<template>
  <PageTitle
    :title="t('student.global.views.studentDeliverablesView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
</template>
