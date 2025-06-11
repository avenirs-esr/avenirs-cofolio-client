<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { studentEducationActivitiesRoute, studentHomeRoute } from '@/features/student/routes'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const mockedAmsCode = 'SAE 1.1'
const mockedAmsName = `${mockedAmsCode} Réaliser l’audit environnemental d’un procédé de synthèse chimique`

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.views.studentEducationActivitiesView.breadcrumb.current.title'), to: studentEducationActivitiesRoute },
  { text: t('student.views.studentActivityView.breadcrumb.current.title', { activity: mockedAmsCode }) }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentActivityView.title', { activity: mockedAmsName })"
    :breadcrumb-links="breadcrumbLinks"
    :back="studentEducationActivitiesRoute"
  />
</template>
