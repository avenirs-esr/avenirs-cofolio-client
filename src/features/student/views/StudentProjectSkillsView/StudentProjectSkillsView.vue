<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { studentHomeRoute } from '@/features/student/routes'
import SkillsViewTabs from '@/features/student/views/StudentProjectSkillsView/components/SkillsViewTabs/SkillsViewTabs.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.skills') }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentProjectSkillsView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
  <SkillsViewTabs />
</template>
