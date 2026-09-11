<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useBreadcrumb } from '@/common/composables'
import PersonalCareerLayout
  from '@/features/student/personalCareer/views/PersonalCareerView/layouts/PersonalCareerLayout/PersonalCareerLayout.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const lastBreadcrumbLink = ref(t('student.global.navigation.tabs.project.items.experiences'))

const { breadcrumbLinks } = useBreadcrumb(() => [{ text: lastBreadcrumbLink.value }])
</script>

<template>
  <PageTitle
    :title="t('student.global.navigation.tabs.project.items.experiences')"
    :breadcrumb-links="breadcrumbLinks"
  />

  <PersonalCareerLayout @selected-item="lastBreadcrumbLink = $event" />
</template>
