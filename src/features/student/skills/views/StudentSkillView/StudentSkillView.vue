<script setup lang="ts">
import { useGetDetailedSkill } from '@/api/avenir-esr'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes, ROUTES } from '@/common/constants'
import StudentSkillViewContainer
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillViewContainer/StudentSkillViewContainer.vue'
import { useI18n } from 'vue-i18n'

export interface StudentSkillDetailedProps {
  skillId: string
}

const props = defineProps<StudentSkillDetailedProps>()
const { skillId } = toRefs(props)
const { t } = useI18n()
const route = useRoute()

const { data: skillDetailed, error } = useGetDetailedSkill(skillId)

const { originalErrorCode, isNotFound, getErrorMessage } = useApiErrors(error)
const isSkillNotFound = computed(() => originalErrorCode.value === ErrorCodes.SKILL_NOT_FOUND || isNotFound.value)

const isEducationSkillRoute = computed(() => route.name === ROUTES.STUDENT.EDUCATION_SKILL.name)
const isProjectSkillRoute = computed(() => route.name === ROUTES.STUDENT.PROJECT_SKILL.name)

const projectSkillBreadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.skills'), to: ROUTES.STUDENT.PROJECT_SKILLS },
  { text: t('student.skills.views.StudentSkillView.breadcrumb.current.title', { skill: skillDetailed.value?.name || '' }) }
])

const educationSkillBreadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.education.header') },
  { text: t('student.global.navigation.tabs.education.items.skills'), to: ROUTES.STUDENT.EDUCATION_SKILLS },
  { text: skillDetailed.value?.name || '' }
])

const homeSkillBreadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.skills.views.StudentSkillView.breadcrumb.current.title', { skill: skillDetailed.value?.name || '' }) }
])

const breadcrumbLinks = computed(() => {
  if (isEducationSkillRoute.value) {
    return educationSkillBreadcrumbLinks.value
  }
  if (isProjectSkillRoute.value) {
    return projectSkillBreadcrumbLinks.value
  }

  return homeSkillBreadcrumbLinks.value
})
</script>

<template>
  <DetailedPageTitle
    :title="skillDetailed?.name ?? ''"
    :breadcrumb-links="breadcrumbLinks"
  />
  <ErrorMessage
    v-if="error"
    :title="isSkillNotFound ? t('student.skills.views.StudentSkillView.errors.notFound.title') : t('global.error.generic')"
    :description="isSkillNotFound ? t('student.skills.views.StudentSkillView.errors.notFound.description') : getErrorMessage(error)"
  />
  <StudentSkillViewContainer
    v-else
    :key="skillDetailed?.id"
    :skill-detailed="skillDetailed"
  />
</template>
