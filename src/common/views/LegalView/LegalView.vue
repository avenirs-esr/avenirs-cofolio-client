<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { studentHomeRoute } from '@/features/student/routes'
import { teacherHomeRoute } from '@/features/teacher'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const isStudentRoute = computed(() => route.path.startsWith('/student'))

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: isStudentRoute.value ? studentHomeRoute : teacherHomeRoute },
  { text: t('global.views.legalView.title') },
])
</script>

<template>
  <PageTitle
    :title="t('global.views.legalView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="isStudentRoute ? studentHomeRoute : teacherHomeRoute"
  />
</template>
