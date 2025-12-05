<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTE_NAMES } from '@/common/constants'
import { useStudentApcAccess } from '@/features/student/global/composables/use-student-apc-access/use-student-apc-access'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
const { showApcGenericInfoPage } = useStudentApcAccess()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.apcUnavailable.title') }
])

watchEffect(() => {
  if (!showApcGenericInfoPage.value) {
    router.replace(ROUTE_NAMES.STUDENT.HOME)
  }
})
</script>

<template>
  <PageTitle
    :title="t('student.global.navigation.tabs.apcUnavailable.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTE_NAMES.STUDENT.HOME"
  />
</template>

<style scoped lang="scss">

</style>
