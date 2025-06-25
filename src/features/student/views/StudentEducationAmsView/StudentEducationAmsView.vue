<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { studentHomeRoute } from '@/features/student/routes'
import AmsViewTabs from '@/features/student/views/StudentEducationAmsView/components/AmsViewTabs/AmsViewTabs.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.views.studentEducationAmsView.breadcrumb.current.title') }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentEducationAmsView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
  <AmsViewTabs />
</template>

<style lang="scss" scoped></style>
