<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { studentEducationSkillsRoute, studentHomeRoute } from '@/features/student/routes'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const mockedSkillName = 'Prévenir la pollution à la source'

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.education.items.skills'), to: studentEducationSkillsRoute },
  { text: mockedSkillName }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentSkillView.title', { skill: mockedSkillName })"
    :breadcrumb-links="breadcrumbLinks"
    :back="studentEducationSkillsRoute"
  />
</template>
