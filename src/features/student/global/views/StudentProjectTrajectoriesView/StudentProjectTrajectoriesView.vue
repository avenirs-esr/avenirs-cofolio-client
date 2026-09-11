<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useBreadcrumb } from '@/common/composables'
import StudentProjectTrajectoriesContainer
  from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesContainer/StudentProjectTrajectoriesContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentSection = ref<string>('')

const { breadcrumbLinks } = useBreadcrumb(() => [{ text: currentSection.value }])
</script>

<template>
  <PageTitle
    :title="t('student.global.views.studentProjectTrajectoriesView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
  <StudentProjectTrajectoriesContainer @selected-section="currentSection = $event" />
</template>
