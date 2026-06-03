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

const { data: skillDetailed, error } = useGetDetailedSkill(skillId)

const { originalErrorCode, isNotFound, getErrorMessage } = useApiErrors(error)
const isSkillNotFound = computed(() => originalErrorCode.value === ErrorCodes.SKILL_NOT_FOUND || isNotFound.value)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.education.items.skills'), to: ROUTES.STUDENT.EDUCATION_SKILLS },
  { text: skillDetailed.value?.name || '' }
])
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
