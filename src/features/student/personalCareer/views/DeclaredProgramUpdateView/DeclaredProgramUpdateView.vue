<script setup lang="ts">
import { ConfirmationModal } from '@/common/components'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ROUTES } from '@/common/constants'
import UpdateInProgressBadge from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import DeclaredProgramSideMenu
  from '@/features/student/personalCareer/components/navigation/DeclaredProgramSideMenu/DeclaredProgramSideMenu.vue'
import {
  usePaginatedDeclaredPrograms
} from '@/features/student/personalCareer/composables/use-paginated-declared-programs/use-paginated-declared-programs'
import { useDeclaredProgramDetailedQuery } from '@/features/student/personalCareer/queries/use-declared-programs.query'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const selectedProgramId = computed(() => String(route.params.id ?? ''))
const isDirty = computed(() => true)

const { showModal, displayModal, hideModal } = useModal()

const { declaredPrograms, pageInfo, loadMoreDeclaredPrograms } = usePaginatedDeclaredPrograms({ pageSize: 3 })
const { declaredProgramDetailed } = useDeclaredProgramDetailedQuery(selectedProgramId)

const programTitle = computed(() => declaredProgramDetailed.value?.title)
const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.experiences') }
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
    router.push({
      name: ROUTES.STUDENT.PERSONAL_CAREER_UPDATE_DECLARED_PROGRAM.name,
      params: { id: programId }
    })
  }
}
</script>

<template>
  <PageTitle
    :title="t('student.personalCareer.views.DeclaredProgramUpdateView.title', { programTitle })"
    :breadcrumb-links="breadcrumbLinks"
    :back="{ name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: selectedProgramId } }"
  />
  <UpdateInProgressBadge :show="isDirty" />
  <div class="av-row av-gap-sm">
    <DeclaredProgramSideMenu
      :selected-program-id="selectedProgramId"
      :programs="declaredPrograms"
      :count-programs="pageInfo.totalElements"
      @select-program="onSelectProgram"
      @load-more-programs="loadMoreDeclaredPrograms"
    />
  </div>
  <ConfirmationModal
    :show="showModal"
    :description="t('student.personalCareer.views.DeclaredProgramUpdateView.confirmationModal.description')"
    @close="cancel"
    @confirm="confirm"
  />
</template>
