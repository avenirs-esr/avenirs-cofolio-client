<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import SkillsViewOtherTab from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewOtherTab/SkillsViewOtherTab.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('student.skills.views.StudentProjectSkillsView.title')" />
  <SkillsViewOtherTab />
</template>
