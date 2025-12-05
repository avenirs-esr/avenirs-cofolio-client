<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTE_NAMES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const isStudentRoute = computed(() => route.path.startsWith('/student'))

const homeRoute = computed(() => isStudentRoute.value
  ? ROUTE_NAMES.STUDENT.HOME
  : ROUTE_NAMES.TEACHER.HOME)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: homeRoute.value },
  { text: t('global.views.accessibilityView.title') },
])
</script>

<template>
  <PageTitle
    :title="t('global.views.accessibilityView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="homeRoute"
  />
</template>
