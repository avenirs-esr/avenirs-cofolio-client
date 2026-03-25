<script setup lang="ts">
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import Loader from '@/common/components/Loader/Loader.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes, ROUTES } from '@/common/constants'
import DeclaredProgramSideMenu
  from '@/features/student/personalCareer/components/navigation/DeclaredProgramSideMenu/DeclaredProgramSideMenu.vue'
import DeleteDeclaredProgramConfirmModal from '@/features/student/personalCareer/components/overlays/DeleteDeclaredProgramConfirmModal/DeleteDeclaredProgramConfirmModal.vue'
import { usePaginatedDeclaredPrograms } from '@/features/student/personalCareer/composables/use-paginated-declared-programs/use-paginated-declared-programs'
import { useDeclaredProgramDetailedQuery } from '@/features/student/personalCareer/queries/use-declared-programs.query'
import DeclaredProgramDetailed
  from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramDetailed/DeclaredProgramDetailed.vue'
import ManageDeclaredProgramDropdown from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const selectedProgramId = computed(() => String(route.params.id ?? ''))

const { declaredPrograms, pageInfo, loadMoreDeclaredPrograms } = usePaginatedDeclaredPrograms()
const { declaredProgramDetailed, isLoading, isError, error } = useDeclaredProgramDetailedQuery(selectedProgramId)
const { navigateToStudentUpdateDeclaredProgram, navigateToStudentDeclaredPrograms } = useNavigation()
const { showModal, displayModal, hideModal } = useModal()

const { originalErrorCode, isNotFound } = useApiErrors(error)
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
  router.push({ name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: programId } })
}

function handleConfirmDelete () {
  hideModal()
  navigateToStudentDeclaredPrograms({ replace: true })
}
</script>

<template>
  <DetailedPageTitle
    v-if="declaredProgramDetailed"
    :title="programTitle"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.PROJECT_SKILLS"
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
    <Loader
      :is-loading="isLoading && !isError"
      size="2xl"
    >
      <div
        v-if="error"
        class="av-col av-gap-md av-flex-fill"
      >
        <ErrorMessage
          v-if="error"
          :title="isDeclaredProgramNotFound ? t('student.personalCareer.views.DeclaredProgramDetailedView.errors.notFound.title') : t('global.error.generic')"
          :description="isDeclaredProgramNotFound ? t('student.personalCareer.views.DeclaredProgramDetailedView.errors.notFound.description') : error.message"
        />
      </div>
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
    </Loader>
  </div>

  <DeleteDeclaredProgramConfirmModal
    :show="showModal"
    :declared-program-ids="[selectedProgramId]"
    @close="hideModal"
    @confirm="handleConfirmDelete"
  />
</template>
