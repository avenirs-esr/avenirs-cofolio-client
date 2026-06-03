<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useStudentApcAccess } from '@/features/student/global/composables/use-student-apc-access/use-student-apc-access'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
const { showApcGenericInfoPage } = useStudentApcAccess()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.apcUnavailable.title') }
])

watch(showApcGenericInfoPage, (value) => {
  if (!value) {
    router.replace(ROUTES.STUDENT.HOME)
  }
}, { immediate: true })
</script>

<template>
  <PageTitle
    :title="t('student.global.navigation.tabs.apcUnavailable.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
</template>

<style scoped lang="scss">

</style>
