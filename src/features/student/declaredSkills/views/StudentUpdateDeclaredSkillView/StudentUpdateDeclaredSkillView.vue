<script setup lang="ts">
import { useGetDeclaredSkillProgressDetails } from '@/api/avenir-esr'
import { ConfirmationModal } from '@/common/components'
import UpdatePageTitle from '@/common/components/UpdatePageTitle/UpdatePageTitle.vue'
import { useBreadcrumb, useModal, useNavigation } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ICONS, ROUTES } from '@/common/constants'
import UpdateDeclaredSkillAssociations from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/UpdateDeclaredSkillAssociations/UpdateDeclaredSkillAssociations.vue'
import UpdateDeclaredSkillForm from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/UpdateDeclaredSkillForm/UpdateDeclaredSkillForm.vue'
import UpdateInProgressBadge from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
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

const activeTab = ref(StudentUpdateDeclaredSkillViewTabs.DETAILS)
const updateInProgress = ref(false)

const { breadcrumbLinks } = useBreadcrumb(() => [
  {
    text: t('student.declaredSkills.views.StudentDeclaredSkillView.breadcrumb.current.title', { skill: declaredSkillDetailed?.value?.title ?? '' }),
    to: { name: ROUTES.STUDENT.PROJECT_DECLARED_SKILL.name, params: { id: skillId } }
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
    :breadcrumb-links="breadcrumbLinks"
  />

  <UpdateInProgressBadge
    class="av-pb-sm"
    :show="updateInProgress"
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
      :title="t('student.global.myAssociationsWithCount', { count: declaredSkillDetailed?.traceAssociations?.length ?? 0 })"
      :icon="ICONS.ASSOCIATIONS"
    >
      <UpdateDeclaredSkillAssociations
        v-if="declaredSkillDetailed"
        :trace-associations="declaredSkillDetailed.traceAssociations"
        :declared-skill-id="declaredSkillDetailed.id"
      />
    </AvTab>
  </AvTabs>

  <ConfirmationModal
    :opened="modalOpened"
    @confirm="confirm"
    @close="cancel"
  />
</template>
