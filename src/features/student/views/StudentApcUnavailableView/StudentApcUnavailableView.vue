<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { useStudentApcAccess } from '@/features/student/composables'
import { studentHomeRoute } from '@/features/student/routes'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
const { showApcGenericInfoPage } = useStudentApcAccess()

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.apcUnavailable.title') }
])

watchEffect(() => {
  if (!showApcGenericInfoPage.value) {
    router.replace(studentHomeRoute)
  }
})
</script>

<template>
  <PageTitle
    :title="t('student.navigation.tabs.apcUnavailable.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
</template>

<style scoped lang="scss">

</style>
