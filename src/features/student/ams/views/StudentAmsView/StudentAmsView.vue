<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTE_NAMES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const mockedAmsCode = 'SAE 1.1'
const mockedAmsName = `${mockedAmsCode} Réaliser l'audit environnemental d'un procédé de synthèse chimique`

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.views.studentEducationAmsView.breadcrumb.current.title'), to: ROUTE_NAMES.STUDENT.EDUCATION_ACTIVITIES },
  { text: t('student.views.studentAmsView.breadcrumb.current.title', { ams: mockedAmsCode }) }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentAmsView.title', { ams: mockedAmsName })"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTE_NAMES.STUDENT.HOME"
  />
</template>
