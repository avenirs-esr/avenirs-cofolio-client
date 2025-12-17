<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.views.studentEventsView.title') }
])
</script>

<template>
  <PageTitle
    :title="t('student.global.views.studentEventsView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="{ name: ROUTES.STUDENT.HOME.name }"
  />
</template>
