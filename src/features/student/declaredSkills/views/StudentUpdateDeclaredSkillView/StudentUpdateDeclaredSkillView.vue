<script setup lang="ts">
import { useGetDeclaredSkillAssociations, useGetDeclaredSkillProgressDetails } from '@/api/avenir-esr'
import { ConfirmationModal } from '@/common/components'
import UpdateInProgressBadge from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import UpdatePageTitle from '@/common/components/UpdatePageTitle/UpdatePageTitle.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ICONS, ROUTES } from '@/common/constants'
import StudentDeclaredSkillAssociations
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/StudentDeclaredSkillAssociations/StudentDeclaredSkillAssociations.vue'
import UpdateDeclaredSkillForm from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/UpdateDeclaredSkillForm/UpdateDeclaredSkillForm.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentUpdateDeclaredSkillViewProps {
  skillId: string
}

const { skillId } = defineProps<StudentUpdateDeclaredSkillViewProps>()

enum StudentUpdateDeclaredSkillViewTabs {
  DETAILS = 0,
  ASSOCIATIONS = 1
}

const { t } = useI18n()
const { navigateToStudentProjectDeclaredSkill } = useNavigation()
const { data: declaredSkillDetailed } = useGetDeclaredSkillProgressDetails(skillId)

const skillProgressId = computed(() => declaredSkillDetailed.value?.id ?? '')
const { data: declaredSkillAssociations, error: associationsError } = useGetDeclaredSkillAssociations(
  skillProgressId,
  { query: { enabled: computed(() => !!skillProgressId.value) } }
)
const traceAssociations = computed(() => declaredSkillAssociations.value?.traceAssociations ?? [])
const declaredActivityAssociations = computed(() => declaredSkillAssociations.value?.declaredActivityAssociations ?? [])
const declaredExperienceAssociations = computed(() => declaredSkillAssociations.value?.declaredExperienceAssociations ?? [])
const countAssociations = computed(() =>
  traceAssociations.value.length + declaredActivityAssociations.value.length + declaredExperienceAssociations.value.length)

const activeTab = ref(StudentUpdateDeclaredSkillViewTabs.DETAILS)
const updateInProgress = ref(false)

const trailingLinks = computed(() => [
  {
    text: t('student.declaredSkills.views.StudentDeclaredSkillView.breadcrumb.current.title', { skill: declaredSkillDetailed?.value?.title ?? '' }),
    to: { name: ROUTES.STUDENT.DECLARED_SKILL.name, params: { id: skillId } }
  },
  { text: `${t('global.buttons.update')} ${declaredSkillDetailed?.value?.title ?? ''}` }
])

function backToStudentDeclaredSkillViewTabs () {
  navigateToStudentProjectDeclaredSkill()
}

const isDirty = computed(() => updateInProgress.value)

const { modalOpened, openModal, closeModal } = useModal()

const { canLeave, confirm, cancel } = useUnsavedChangesGuard({
  isDirty,
  openModal,
  closeModal
})

async function handleCancel () {
  if (await canLeave()) {
    backToStudentDeclaredSkillViewTabs()
  }
}
</script>

<template>
  <UpdatePageTitle
    :title="declaredSkillDetailed?.title ?? ''"
    :trailing-links="trailingLinks"
  />

  <UpdateInProgressBadge
    class="av-pb-sm"
    show
  />

  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.tabs.details.title')"
      :icon="MDI_ICONS.INFORMATION_OUTLINE"
    >
      <UpdateDeclaredSkillForm
        v-if="declaredSkillDetailed"
        :declared-skill-progress-details="declaredSkillDetailed!"
        :on-skill-updated="backToStudentDeclaredSkillViewTabs"
        :on-cancel="handleCancel"
        @dirty-change="updateInProgress = $event"
      />
    </AvTab>
    <AvTab
      :title="t('student.global.myAssociationsWithCount', { count: countAssociations })"
      :icon="ICONS.ASSOCIATIONS"
      data-testid="update-declared-skill-associations-tab"
    >
      <StudentDeclaredSkillAssociations
        v-if="declaredSkillDetailed"
        :declared-skill-id="declaredSkillDetailed.id"
        :associated-traces="traceAssociations"
        :associated-declared-activities="declaredActivityAssociations"
        :associated-declared-experiences="declaredExperienceAssociations"
        :associations-error="associationsError"
        :count-associations="countAssociations"
        disabled
        :show-actions="false"
      />
    </AvTab>
  </AvTabs>

  <ConfirmationModal
    :opened="modalOpened"
    @confirm="confirm"
    @close="cancel"
  />
</template>
