<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTE_NAMES } from '@/common/constants'
import AmsViewTabs from '@/features/student/ams/views/StudentEducationAmsView/components/AmsViewTabs/AmsViewTabs.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.ams.views.StudentEducationAmsView.breadcrumb.current.title') }
])
</script>

<template>
  <PageTitle
    :title="t('student.ams.views.StudentEducationAmsView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTE_NAMES.STUDENT.HOME"
  />
  <AmsViewTabs />
</template>

<style lang="scss" scoped></style>
