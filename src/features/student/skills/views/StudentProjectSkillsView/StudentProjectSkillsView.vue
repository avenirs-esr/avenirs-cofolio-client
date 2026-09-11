<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useBreadcrumb } from '@/common/composables'
import SkillsViewOtherTab from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewOtherTab/SkillsViewOtherTab.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { breadcrumbLinks } = useBreadcrumb()
</script>

<template>
  <PageTitle
    :title="t('student.skills.views.StudentProjectSkillsView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
  <SkillsViewOtherTab />
</template>
