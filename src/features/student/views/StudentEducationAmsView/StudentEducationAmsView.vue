<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { useAmsViewQuery } from '@/features/student/queries'
import { studentHomeRoute } from '@/features/student/routes'
import StudentDetailedAmsCard from '@/features/student/views/StudentEducationAmsView/components/StudentDetailedAmsCard/StudentDetailedAmsCard.vue'
import { useI18n } from 'vue-i18n'

const { data: amss } = useAmsViewQuery(ref(1), ref(1))
const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.views.studentEducationAmsView.breadcrumb.current.title') }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentEducationAmsView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
  <div
    v-if="amss && amss.data"
    class="ams-view-container__body"
  >
    <StudentDetailedAmsCard
      v-for="ams in amss.data"
      :key="ams.id"
      :ams="ams"
    />
  </div>
</template>

<style lang="scss" scoped>
.ams-view-container__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
