<script setup lang="ts">
import { useGetDeclaredSkillProgressDetails, useGetDeclaredSkillWithDeclaredActivities } from '@/api/avenir-esr'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes, ICONS, ROUTES } from '@/common/constants'
import DeclaredSkillDetails
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillDetails/DeclaredSkillDetails.vue'
import DeclaredSkillSettingDropdown
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillSettingDropdown/DeclaredSkillSettingDropdown.vue'
import DeleteDeclaredSkillConfirmModal from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeleteDeclaredSkillConfirmModal/DeleteDeclaredSkillConfirmModal.vue'
import StudentDeclaredSkillAssociations
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/StudentDeclaredSkillAssociations/StudentDeclaredSkillAssociations.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentDeclaredSkillViewProps {
  skillId: string
}

const { skillId } = defineProps<StudentDeclaredSkillViewProps>()

enum StudentDeclaredSkillViewTabs {
  DETAILS = 0,
}

const { t } = useI18n()
const { navigateToStudentUpdateDeclaredSkill, navigateToStudentProjectSkills } = useNavigation()
const { data: declaredSkillDetailed, error } = useGetDeclaredSkillProgressDetails(skillId)
const { showModal, displayModal, hideModal } = useModal()

const activeTab = ref(StudentDeclaredSkillViewTabs.DETAILS)

const skillProgressId = computed(() => declaredSkillDetailed.value?.id ?? '')
const { data, error: associationsError } = useGetDeclaredSkillWithDeclaredActivities(skillProgressId)
const traceAssociations = computed(() => data.value?.traceAssociations ?? [])
const declaredActivityAssociations = computed(() => data.value?.declaredActivityAssociations ?? [])

const { originalErrorCode, isNotFound, getErrorMessage } = useApiErrors(error)
const isDeclaredSkillNotFound = computed(() => originalErrorCode.value === ErrorCodes.DECLARED_SKILL_PROGRESS_NOT_FOUND || isNotFound.value)
const skillTitle = computed(() => declaredSkillDetailed.value?.title ?? '')
const countAssociations = computed(() => (traceAssociations.value?.length ?? 0) + (declaredActivityAssociations.value?.length ?? 0))

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.skills'), to: ROUTES.STUDENT.PROJECT_SKILLS },
  { text: t('student.declaredSkills.views.StudentDeclaredSkillView.breadcrumb.current.title', { skill: skillTitle.value }) }
])

function handleUpdateSelected () {
  navigateToStudentUpdateDeclaredSkill()
}

function handleSkillDeleted () {
  hideModal()
  navigateToStudentProjectSkills({ replace: true })
}
</script>

<template>
  <DetailedPageTitle
    :title="skillTitle"
    :breadcrumb-links="breadcrumbLinks"
  />

  <div
    class="av-pb-md av-row av-justify-end"
    data-testid="student-declared-skill-view__title"
  >
    <DeclaredSkillSettingDropdown
      @delete-selected="displayModal"
      @update-selected="handleUpdateSelected"
    />
  </div>

  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.declaredSkills.views.StudentDeclaredSkillView.tabs.details.title')"
      :icon="MDI_ICONS.INFORMATION_OUTLINE"
    >
      <DeclaredSkillDetails
        v-if="declaredSkillDetailed"
        :declared-skill-progress-details="declaredSkillDetailed"
      />
    </AvTab>
    <AvTab
      :title="t('student.global.myAssociationsWithCount', { count: countAssociations })"
      :icon="ICONS.ASSOCIATIONS"
      data-testid="skill-associations-tab-item"
    >
      <StudentDeclaredSkillAssociations
        v-if="declaredSkillDetailed"
        :declared-skill-id="declaredSkillDetailed.id"
        :associated-traces="traceAssociations"
        :associated-declared-activities="declaredActivityAssociations"
        :associations-error="associationsError"
        :count-associations="countAssociations"
      />
    </AvTab>
  </AvTabs>

  <ErrorMessage
    v-if="error"
    :title="isDeclaredSkillNotFound ? t('student.declaredSkills.views.StudentDeclaredSkillView.errors.notFound.title') : t('global.error.generic')"
    :description="isDeclaredSkillNotFound ? t('student.declaredSkills.views.StudentDeclaredSkillView.errors.notFound.description') : getErrorMessage(error)"
  />

  <DeleteDeclaredSkillConfirmModal
    :show="showModal"
    :skill-id="skillId"
    :skill-title="skillTitle"
    @skill-deleted="handleSkillDeleted"
    @close="hideModal"
  />
</template>
