<script setup lang="ts">
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EAssociationContextType, useGetAssociations, useGetSkillProgressDetails } from '@/api/avenir-esr'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import DetailedPageTitle from '@/common/components/navigation/DetailedPageTitle/DetailedPageTitle.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'
import { ErrorCodes, ICONS } from '@/common/constants'
import { countElementAssociations, ElementAssociations } from '@/features/student/associations'
import DeclaredSkillDetails
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillDetails/DeclaredSkillDetails.vue'
import DeclaredSkillSettingDropdown
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillSettingDropdown/DeclaredSkillSettingDropdown.vue'
import DeleteDeclaredSkillConfirmModal from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeleteDeclaredSkillConfirmModal/DeleteDeclaredSkillConfirmModal.vue'

interface StudentDeclaredSkillViewProps {
  skillId: string
}

const { skillId } = defineProps<StudentDeclaredSkillViewProps>()

enum StudentDeclaredSkillViewTabs {
  DETAILS = 0,
}

const { t } = useI18n()
const {
  navigateToStudentUpdateDeclaredSkill,
  navigateToStudentToolsKitUpdateSkill,
  navigateToStudentSkills,
  navigateToStudentToolsKitSkills
} = useNavigation()
const { data: declaredSkillDetailed, error } = useGetSkillProgressDetails(skillId)
const { modalOpened, openModal, closeModal } = useModal()
const { isStudentToolsKitRoute } = useIdentifyRoute()

const activeTab = ref(StudentDeclaredSkillViewTabs.DETAILS)

const skillProgressId = computed(() => declaredSkillDetailed.value?.id ?? '')
const { data: associations, error: associationsError } = useGetAssociations(EAssociationContextType.DECLARED_SKILL, skillProgressId, undefined, { query: { enabled: computed(() => !!skillProgressId.value) } })

const { originalErrorCode, isNotFound, getErrorMessage } = useApiErrors(error)
const isDeclaredSkillNotFound = computed(() => originalErrorCode.value === ErrorCodes.SKILL_PROGRESS_NOT_FOUND || isNotFound.value)
const skillTitle = computed(() => declaredSkillDetailed.value?.title ?? '')
const associationsCount = computed(() => countElementAssociations(EAssociationContextType.DECLARED_SKILL, associations.value))

const trailingLinks = computed(() => [
  { text: t('student.declaredSkills.views.StudentDeclaredSkillView.breadcrumb.current.title', { skill: skillTitle.value }) }
])

function handleUpdateSelected () {
  isStudentToolsKitRoute.value ? navigateToStudentToolsKitUpdateSkill() : navigateToStudentUpdateDeclaredSkill()
}

function handleSkillDeleted () {
  closeModal()
  isStudentToolsKitRoute.value ? navigateToStudentToolsKitSkills({ replace: true }) : navigateToStudentSkills({ replace: true })
}
</script>

<template>
  <DetailedPageTitle
    :title="skillTitle"
    :trailing-links="trailingLinks"
  >
    <template #actions>
      <DeclaredSkillSettingDropdown
        @delete="openModal"
        @update="handleUpdateSelected"
      />
    </template>
  </DetailedPageTitle>

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
      :title="t('student.global.myAssociationsWithCount', { count: associationsCount })"
      :icon="ICONS.ASSOCIATIONS"
      data-testid="skill-associations-tab-item"
    >
      <ElementAssociations
        v-if="declaredSkillDetailed"
        :context-type="EAssociationContextType.DECLARED_SKILL"
        :element-id="declaredSkillDetailed.id"
        :associations="associations"
        :error="associationsError"
      />
    </AvTab>
  </AvTabs>

  <ErrorMessage
    v-if="error"
    :title="isDeclaredSkillNotFound ? t('student.declaredSkills.views.StudentDeclaredSkillView.errors.notFound.title') : t('global.error.generic')"
    :description="isDeclaredSkillNotFound ? t('student.declaredSkills.views.StudentDeclaredSkillView.errors.notFound.description') : getErrorMessage(error)"
  />

  <DeleteDeclaredSkillConfirmModal
    :opened="modalOpened"
    :skill-id="skillId"
    :skill-title="skillTitle"
    @skill-deleted="handleSkillDeleted"
    @close="closeModal"
  />
</template>
