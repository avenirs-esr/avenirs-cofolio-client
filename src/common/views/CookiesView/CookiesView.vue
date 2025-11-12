<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { ROUTE_NAMES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const isStudentRoute = computed(() => route.path.startsWith('/student'))

const homeRoute = computed(() => isStudentRoute.value
  ? ROUTE_NAMES.STUDENT.HOME
  : ROUTE_NAMES.TEACHER.HOME)

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: homeRoute.value },
  { text: t('global.views.cookiesView.title') },
])
</script>

<template>
  <PageTitle
    :title="t('global.views.cookiesView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="homeRoute"
  />
</template>
