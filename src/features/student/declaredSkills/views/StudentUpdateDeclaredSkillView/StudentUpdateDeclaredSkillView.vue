<script setup lang="ts">
import { useGetDeclaredSkillProgressDetails } from '@/api/avenir-esr'
import { ConfirmationModal, PageTitle } from '@/common/components'
import { useModal, useNavigation } from '@/common/composables'
import { useQueryParamIndex } from '@/common/composables/use-query-param-index/use-query-param-index'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ROUTES } from '@/common/constants'
import UpdateDeclaredSkillAssociations from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/UpdateDeclaredSkillAssociations/UpdateDeclaredSkillAssociations.vue'
import UpdateDeclaredSkillForm from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/UpdateDeclaredSkillForm/UpdateDeclaredSkillForm.vue'
import UpdateInProgressBadge from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import { ICONS } from '@/features/student/global/icons'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentUpdateDeclaredSkillViewProps {
  skillId: string
}

const { skillId } = defineProps<StudentUpdateDeclaredSkillViewProps>()

const { t } = useI18n()
const { navigateToStudentDeclaredSkill } = useNavigation()
const { data: declaredSkillDetailed } = useGetDeclaredSkillProgressDetails(skillId)

const updateInProgress = ref(false)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.skills'), to: ROUTES.STUDENT.PROJECT_SKILLS },
  { text: t('student.global.navigation.tabs.project.items.declaredSkills') }
])

const tabs = ['details', 'associations']
const activeTab = useQueryParamIndex(tabs, 'tab')

function backToStudentDeclaredSkillViewTabs () {
  navigateToStudentDeclaredSkill()
}

const isDirty = computed(() => updateInProgress.value)

const { showModal, displayModal, hideModal } = useModal()

const { canLeave, confirm, cancel } = useUnsavedChangesGuard({
  isDirty,
  openModal: displayModal,
  closeModal: hideModal
})

async function handleCancel () {
  if (await canLeave()) {
    backToStudentDeclaredSkillViewTabs()
  }
}
</script>

<template>
  <ConfirmationModal
    :show="showModal"
    @confirm="confirm"
    @close="cancel"
  />

  <PageTitle
    :title="t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.PROJECT_SKILLS"
  />

  <div
    class="av-row av-py-md"
    data-testid="update-declared-skill-view__title"
  >
    <span class="n4 av-text-text2">{{ declaredSkillDetailed?.title ?? '' }}</span>
  </div>

  <UpdateInProgressBadge :show="updateInProgress" />

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
</template>
