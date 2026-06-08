<script setup lang="ts">
import { useGetDeclaredProgram } from '@/api/avenir-esr'
import { ConfirmationModal } from '@/common/components'
import UpdatePageTitle from '@/common/components/UpdatePageTitle/UpdatePageTitle.vue'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ROUTES } from '@/common/constants'
import UpdateInProgressBadge from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import DeclaredProgramSideMenu
  from '@/features/student/personalCareer/components/navigation/DeclaredProgramSideMenu/DeclaredProgramSideMenu.vue'
import {
  usePaginatedDeclaredPrograms
} from '@/features/student/personalCareer/composables/use-paginated-declared-programs/use-paginated-declared-programs'
import DeclaredProgramUpdateForm
  from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/components/DeclaredProgramUpdateForm/DeclaredProgramUpdateForm.vue'
import { useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { isMobile } = useAvBreakpoints()
const selectedProgramId = computed(() => String(route.params.id ?? ''))
const isDirty = ref(false)

const { showModal, displayModal, hideModal } = useModal()

const { declaredPrograms, pageInfo, loadMoreDeclaredPrograms } = usePaginatedDeclaredPrograms({ pageSize: 3 })
const { data: declaredProgramDetailed } = useGetDeclaredProgram(selectedProgramId)

const programTitle = computed(() => declaredProgramDetailed.value?.title ?? '')
const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.experiences') },
  { text: t('student.personalCareer.views.PersonalCareerView.ProgramsSection.breadcrumb'), to: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS },
  {
    text: programTitle.value,
    to: { name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: selectedProgramId.value } }
  },
  { text: `${t('global.buttons.update')} ${programTitle.value}` }
])

const {
  canLeave,
  confirm,
  cancel
} = useUnsavedChangesGuard({
  isDirty,
  openModal: displayModal,
  closeModal: hideModal
})

async function onSelectProgram (programId: string) {
  if (await canLeave()) {
    router.replace({
      name: ROUTES.STUDENT.PERSONAL_CAREER_UPDATE_DECLARED_PROGRAM.name,
      params: { id: programId },
      state: { preserveScroll: true }
    })
  }
}

function onDirtyChange (value: boolean) {
  isDirty.value = value
}

function onProgramUpdated () {
  isDirty.value = false
  router.push({ name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: selectedProgramId.value } })
}
</script>

<template>
  <UpdatePageTitle
    :title="programTitle"
    :breadcrumb-links="breadcrumbLinks"
  />
  <div class="av-row av-gap-sm">
    <DeclaredProgramSideMenu
      v-if="!isMobile"
      :selected-program-id="selectedProgramId"
      :programs="declaredPrograms"
      :count-programs="pageInfo.totalElements"
      @select-program="onSelectProgram"
      @load-more-programs="loadMoreDeclaredPrograms"
    />
    <div class="av-col av-gap-sm av-justify-start av-flex-fill">
      <UpdateInProgressBadge :show="isDirty" />
      <DeclaredProgramUpdateForm
        v-if="declaredProgramDetailed"
        :key="declaredProgramDetailed.id"
        :declared-program-detailed="declaredProgramDetailed"
        @dirty-change="onDirtyChange"
        @program-updated="onProgramUpdated"
        @cancel="router.push({ name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: selectedProgramId } })"
      />
    </div>
  </div>
  <ConfirmationModal
    :show="showModal"
    :description="t('student.personalCareer.views.DeclaredProgramUpdateView.confirmationModal.description')"
    @close="cancel"
    @confirm="confirm"
  />
</template>
