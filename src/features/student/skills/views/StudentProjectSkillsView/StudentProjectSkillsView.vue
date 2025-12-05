<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTE_NAMES } from '@/common/constants'
import SkillsViewTabs from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewTabs/SkillsViewTabs.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.skills') }
])
</script>

<template>
  <PageTitle
    :title="t('student.skills.views.StudentProjectSkillsView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="{ name: ROUTE_NAMES.STUDENT.HOME.name }"
  />
  <SkillsViewTabs />
</template>
