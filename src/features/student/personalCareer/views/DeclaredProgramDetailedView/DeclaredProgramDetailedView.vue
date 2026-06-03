<script setup lang="ts">
import { useGetDeclaredProgram } from '@/api/avenir-esr'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes, ROUTES } from '@/common/constants'
import DeclaredProgramSideMenu from '@/features/student/personalCareer/components/navigation/DeclaredProgramSideMenu/DeclaredProgramSideMenu.vue'
import DeleteDeclaredProgramConfirmModal from '@/features/student/personalCareer/components/overlays/DeleteDeclaredProgramConfirmModal/DeleteDeclaredProgramConfirmModal.vue'
import { usePaginatedDeclaredPrograms } from '@/features/student/personalCareer/composables/use-paginated-declared-programs/use-paginated-declared-programs'
import DeclaredProgramDetailed from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramDetailed/DeclaredProgramDetailed.vue'
import ManageDeclaredProgramDropdown from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const selectedProgramId = computed(() => String(route.params.id ?? ''))

const { declaredPrograms, pageInfo, loadMoreDeclaredPrograms } = usePaginatedDeclaredPrograms()
const { data: declaredProgramDetailed, isLoading, isError, error } = useGetDeclaredProgram(selectedProgramId)
const { navigateToStudentUpdateDeclaredProgram, navigateToStudentDeclaredPrograms } = useNavigation()
const { showModal, displayModal, hideModal } = useModal()

const { originalErrorCode, isNotFound, getErrorMessage } = useApiErrors(error)
const isDeclaredProgramNotFound = computed(() => originalErrorCode.value === ErrorCodes.DECLARED_PROGRAM_NOT_FOUND || isNotFound.value)

const programTitle = computed(() => declaredProgramDetailed.value?.title ?? '')
const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.experiences'), to: ROUTES.STUDENT.PERSONAL_CAREER },
  { text: t('student.personalCareer.views.PersonalCareerView.ProgramsSection.breadcrumb'), to: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS },
  { text: programTitle.value }
])

function onSelectProgram (programId: string) {
  router.replace({
    name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name,
    params: { id: programId },
    state: { preserveScroll: true }
  })
}

function handleConfirmDelete () {
  hideModal()
  navigateToStudentDeclaredPrograms({ replace: true })
}
</script>

<template>
  <DetailedPageTitle
    :title="programTitle"
    :breadcrumb-links="breadcrumbLinks"
  />
  <div class="av-row av-gap-2xl">
    <div class="av-col">
      <DeclaredProgramSideMenu
        :selected-program-id="selectedProgramId"
        :programs="declaredPrograms"
        :count-programs="pageInfo.totalElements"
        @select-program="onSelectProgram"
        @load-more-programs="loadMoreDeclaredPrograms"
      />
    </div>
    <QuerySuspense
      :error="error"
      :is-loading="isLoading && !isError"
      :error-title="isDeclaredProgramNotFound ? t('student.personalCareer.views.DeclaredProgramDetailedView.errors.notFound.title') : t('global.error.generic')"
      :error-description="isDeclaredProgramNotFound ? t('student.personalCareer.views.DeclaredProgramDetailedView.errors.notFound.description') : getErrorMessage(error)"
    >
      <div
        v-if="declaredProgramDetailed"
        class="av-col av-gap-md av-flex-fill"
      >
        <ManageDeclaredProgramDropdown
          @update-selected="navigateToStudentUpdateDeclaredProgram"
          @delete-selected="displayModal"
        />
        <DeclaredProgramDetailed
          :key="declaredProgramDetailed.id"
          :declared-program-detailed="declaredProgramDetailed"
        />
      </div>
    </QuerySuspense>
  </div>

  <DeleteDeclaredProgramConfirmModal
    :show="showModal"
    :declared-program-ids="[selectedProgramId]"
    @close="hideModal"
    @confirm="handleConfirmDelete"
  />
</template>
