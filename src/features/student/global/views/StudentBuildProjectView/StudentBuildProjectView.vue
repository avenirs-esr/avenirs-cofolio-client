<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import StudentProjectBuildProjectContainer
  from '@/features/student/global/views/StudentBuildProjectView/components/StudentProjectBuildProjectContainer/StudentProjectBuildProjectContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentSection = ref<string>('')

const trailingLinks = computed(() => [{ text: currentSection.value }])
</script>

<template>
  <PageTitle
    :title="t('student.global.views.StudentBuildProjectView.title')"
    :trailing-links="trailingLinks"
  />
  <StudentProjectBuildProjectContainer @selected-section="currentSection = $event" />
</template>
