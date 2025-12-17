<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const mockedAmsCode = 'SAE 1.1'
const mockedAmsName = `${mockedAmsCode} Réaliser l'audit environnemental d'un procédé de synthèse chimique`

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.ams.views.StudentEducationAmsView.breadcrumb.current.title'), to: ROUTES.STUDENT.EDUCATION_ACTIVITIES },
  { text: t('student.ams.views.StudentAmsView.breadcrumb.current.title', { ams: mockedAmsCode }) }
])
</script>

<template>
  <PageTitle
    :title="t('student.ams.views.StudentAmsView.title', { ams: mockedAmsName })"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.HOME"
  />
</template>
