<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const isStudentRoute = computed(() => route.path.startsWith('/student'))

const homeRoute = computed(() => isStudentRoute.value
  ? ROUTES.STUDENT.HOME
  : ROUTES.STAFF.HOME)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: homeRoute.value },
  { text: t('global.views.personalDataView.title') },
])
</script>

<template>
  <PageTitle
    :title="t('global.views.personalDataView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="homeRoute"
  />
</template>
