<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { studentHomeRoute } from '@/features/student/routes'
import { teacherHomeRoute } from '@/features/teacher/routes'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const isStudentRoute = computed(() => route.path.startsWith('/student'))

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: isStudentRoute.value ? studentHomeRoute : teacherHomeRoute },
  { text: t('global.views.accessibilityView.title') },
])
</script>

<template>
  <PageTitle
    :title="t('global.views.accessibilityView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="isStudentRoute ? studentHomeRoute : teacherHomeRoute"
  />
</template>
