<script setup lang="ts">
import { PageTitle } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import PersonalCareerLayout
  from '@/features/student/personalCareer/views/PersonalCareerView/layouts/PersonalCareerLayout/PersonalCareerLayout.vue'

const { t } = useI18n()

const lastBreadcrumbLink = ref(t('student.global.navigation.tabs.project.items.experiences'))

const trailingLinks = computed(() => [{ text: lastBreadcrumbLink.value }])
</script>

<template>
  <PageTitle
    :title="t('student.global.navigation.tabs.project.items.experiences')"
    :trailing-links="trailingLinks"
  />

  <PersonalCareerLayout @selected-item="lastBreadcrumbLink = $event" />
</template>
