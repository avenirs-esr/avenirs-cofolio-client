<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { useBaseApiExceptionToast } from '@/common/composables'
import { studentEducationSkillsRoute, studentHomeRoute } from '@/features/student/routes'
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
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.education.items.skills'), to: studentEducationSkillsRoute },
  { text: skillDetailed.value?.name || '' }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentSkillView.title', { skill: skillDetailed?.name ?? '' })"
    :breadcrumb-links="breadcrumbLinks"
    :back="studentHomeRoute"
  />
  <StudentSkillViewContainer
    :key="skillDetailed?.id"
    :skill-detailed="skillDetailed"
  />
</template>
