<script setup lang="ts">
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes, ROUTES } from '@/common/constants'
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

const { originalErrorCode, isNotFound } = useApiErrors(error)
const isSkillNotFound = computed(() => originalErrorCode.value === ErrorCodes.SKILL_NOT_FOUND || isNotFound.value)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.education.items.skills'), to: ROUTES.STUDENT.EDUCATION_SKILLS },
  { text: skillDetailed.value?.name || '' }
])
</script>

<template>
  <PageTitle
    :title="skillDetailed ? t('student.skills.views.StudentSkillView.title', { skill: skillDetailed?.name ?? '' }) : ''"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.HOME"
  />
  <ErrorMessage
    v-if="error"
    :title="isSkillNotFound ? t('student.skills.views.StudentSkillView.errors.notFound.title') : t('global.error.generic')"
    :description="isSkillNotFound ? t('student.skills.views.StudentSkillView.errors.notFound.description') : error.message"
  />
  <StudentSkillViewContainer
    v-else
    :key="skillDetailed?.id"
    :skill-detailed="skillDetailed"
  />
</template>
