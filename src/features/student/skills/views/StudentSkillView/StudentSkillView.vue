<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useBaseApiExceptionToast } from '@/common/composables'
import { ROUTE_NAMES } from '@/common/constants'
import { useSkillDetailedQuery } from '@/features/student/skills/queries/use-skills-view.query/use-skills-view.query'
import StudentSkillViewContainer
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillViewContainer/StudentSkillViewContainer.vue'
import { useI18n } from 'vue-i18n'

export interface StudentSkillDetailedProps {
  skillId: string
}

const props = defineProps<StudentSkillDetailedProps>()
const { skillId } = toRefs(props)
const { t } = useI18n()

const { skillDetailed, error } = useSkillDetailedQuery(skillId)
useBaseApiExceptionToast(error)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.education.items.skills'), to: ROUTE_NAMES.STUDENT.EDUCATION_SKILLS },
  { text: skillDetailed.value?.name || '' }
])
</script>

<template>
  <PageTitle
    :title="t('student.skills.views.StudentSkillView.title', { skill: skillDetailed?.name ?? '' })"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTE_NAMES.STUDENT.HOME"
  />
  <StudentSkillViewContainer
    :key="skillDetailed?.id"
    :skill-detailed="skillDetailed"
  />
</template>
