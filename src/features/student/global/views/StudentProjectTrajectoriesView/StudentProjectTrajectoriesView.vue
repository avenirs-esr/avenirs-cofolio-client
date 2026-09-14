<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import StudentProjectTrajectoriesContainer
  from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesContainer/StudentProjectTrajectoriesContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentSection = ref<string>('')

const trailingLinks = computed(() => [{ text: currentSection.value }])
</script>

<template>
  <PageTitle
    :title="t('student.global.views.studentProjectTrajectoriesView.title')"
    :trailing-links="trailingLinks"
  />
  <StudentProjectTrajectoriesContainer @selected-section="currentSection = $event" />
</template>
