<script setup lang="ts">
import { useGetDeclaredProgram } from '@/api/avenir-esr'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes } from '@/common/constants'
import DeleteDeclaredProgramConfirmModal from '@/features/student/personalCareer/components/overlays/DeleteDeclaredProgramConfirmModal/DeleteDeclaredProgramConfirmModal.vue'
import DeclaredProgramDetailed from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramDetailed/DeclaredProgramDetailed.vue'
import ManageDeclaredProgramDropdown from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const selectedProgramId = computed(() => String(route.params.id ?? ''))

const { data: declaredProgramDetailed, isLoading, isError, error } = useGetDeclaredProgram(selectedProgramId)
const { navigateToStudentUpdateDeclaredProgram, navigateToStudentDeclaredPrograms } = useNavigation()
const { modalOpened, openModal, closeModal } = useModal()

const { originalErrorCode, isNotFound, getErrorMessage } = useApiErrors(error)
const isDeclaredProgramNotFound = computed(() => originalErrorCode.value === ErrorCodes.DECLARED_PROGRAM_NOT_FOUND || isNotFound.value)

const programTitle = computed(() => declaredProgramDetailed.value?.title ?? '')
const trailingLinks = computed(() => [{ text: programTitle.value }])

function handleConfirmDelete () {
  closeModal()
  navigateToStudentDeclaredPrograms({ replace: true })
}
</script>

<template>
  <DetailedPageTitle
    :title="programTitle"
    :trailing-links="trailingLinks"
  >
    <template #actions>
      <ManageDeclaredProgramDropdown
        v-if="declaredProgramDetailed"
        @update-selected="navigateToStudentUpdateDeclaredProgram"
        @delete-selected="openModal"
      />
    </template>
  </DetailedPageTitle>

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
      <DeclaredProgramDetailed
        :key="declaredProgramDetailed.id"
        :declared-program-detailed="declaredProgramDetailed"
      />
    </div>
  </QuerySuspense>

  <DeleteDeclaredProgramConfirmModal
    :opened="modalOpened"
    :declared-program-ids="[selectedProgramId]"
    @close="closeModal"
    @confirm="handleConfirmDelete"
  />
</template>
