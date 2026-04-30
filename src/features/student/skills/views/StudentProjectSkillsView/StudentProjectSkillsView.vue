<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useQueryParamEnum } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import SkillsViewTabs from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewTabs/SkillsViewTabs.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.skills') }
])

enum StudentProjectSkillsTabs {
  EDUCATION = 0,
  OTHER = 1
}
const activeSkillsTab = useQueryParamEnum(StudentProjectSkillsTabs, 'tab')
</script>

<template>
  <PageTitle
    :title="t('student.skills.views.StudentProjectSkillsView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="{ name: ROUTES.STUDENT.HOME.name }"
  />
  <SkillsViewTabs
    v-model="activeSkillsTab"
  />
</template>
