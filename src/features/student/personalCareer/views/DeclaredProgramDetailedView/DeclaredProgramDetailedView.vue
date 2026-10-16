<script setup lang="ts">
import { EAssociationContextType, useGetAssociations, useGetDeclaredProgram } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import DetailedPageTitle from '@/common/components/navigation/DetailedPageTitle/DetailedPageTitle.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'
import { ErrorCodes, ICONS } from '@/common/constants'
import { countElementAssociations, ElementAssociations } from '@/features/student/associations'
import AssociateModal from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.vue'
import DeleteAssociationsModal from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { availableTypes } from '@/features/student/associations/constants/associations.constants'
import DeleteDeclaredProgramConfirmModal from '@/features/student/personalCareer/components/overlays/DeleteDeclaredProgramConfirmModal/DeleteDeclaredProgramConfirmModal.vue'
import DeclaredProgramDetailed from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramDetailed/DeclaredProgramDetailed.vue'
import ManageDeclaredProgramDropdown from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.vue'
import { DeclaredProgramDetailedViewTabs } from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.types'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const activeTab = ref(DeclaredProgramDetailedViewTabs.DETAILS)
const selectedProgramId = computed(() => String(route.params.id ?? ''))
const { isStudentToolsKitRoute } = useIdentifyRoute()

const { data: declaredProgramDetailed, isLoading, isError, error } = useGetDeclaredProgram(selectedProgramId)
const {
  navigateToStudentUpdateDeclaredProgram,
  navigateToStudentToolsKitUpdateDeclaredProgram,
  navigateToStudentDeclaredPrograms,
  navigateToStudentToolsKitDeclaredPrograms,
} = useNavigation()

const {
  modalOpened: associateModalOpened,
  openModal: openAssociateModal,
  closeModal: closeAssociateModal
} = useModal()

const {
  modalOpened: unassociateModalOpened,
  openModal: openUnassociateModal,
  closeModal: closeUnassociateModal
} = useModal()

const { modalOpened, openModal, closeModal } = useModal()

const { data: associations, isLoading: areAssociationsLoading, error: associationsError } = useGetAssociations(
  EAssociationContextType.DECLARED_PROGRAM,
  selectedProgramId,
  undefined,
  {
    query: {
      enabled: computed(() => !!selectedProgramId.value),
      placeholderData: keepPreviousData
    }
  }
)

const { originalErrorCode, isNotFound, getErrorMessage } = useApiErrors(error)
const isDeclaredProgramNotFound = computed(() => originalErrorCode.value === ErrorCodes.DECLARED_PROGRAM_NOT_FOUND || isNotFound.value)

const programTitle = computed(() => declaredProgramDetailed.value?.title ?? '')
const trailingLinks = computed(() => [{ text: programTitle.value }])
const associationsCount = computed(() => countElementAssociations(EAssociationContextType.DECLARED_PROGRAM, associations.value))

function handleUpdateSelected () {
  isStudentToolsKitRoute.value
    ? navigateToStudentToolsKitUpdateDeclaredProgram()
    : navigateToStudentUpdateDeclaredProgram()
}

function handleConfirmDelete () {
  closeModal()
  isStudentToolsKitRoute.value
    ? navigateToStudentToolsKitDeclaredPrograms({ replace: true })
    : navigateToStudentDeclaredPrograms({ replace: true })
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
        @update="handleUpdateSelected"
        @delete="openModal"
        @associate="openAssociateModal"
        @dissociate="openUnassociateModal"
      />

      <AssociateModal
        v-if="declaredProgramDetailed"
        :opened="associateModalOpened"
        :context-type="EAssociationContextType.DECLARED_PROGRAM"
        :element-id="declaredProgramDetailed.id"
        :associated-context-type="EAssociationContextType.DECLARED_PROGRAM"
        :available-types="availableTypes"
        @cancel="closeAssociateModal"
        @associated="closeAssociateModal"
      />

      <DeleteAssociationsModal
        v-if="declaredProgramDetailed && associations"
        :opened="unassociateModalOpened"
        :context-type="EAssociationContextType.DECLARED_PROGRAM"
        :element-id="declaredProgramDetailed.id"
        :associated-context-type="EAssociationContextType.DECLARED_PROGRAM"
        :associations="associations"
        :available-types="availableTypes"
        @cancel="closeUnassociateModal"
        @deleted="closeUnassociateModal"
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
      <AvTabs v-model="activeTab">
        <AvTab
          :title="t('student.personalCareer.views.DeclaredProgramDetailedView.tabs.details.title')"
          :icon="MDI_ICONS.INFORMATION_OUTLINE"
        >
          <DeclaredProgramDetailed
            :key="declaredProgramDetailed.id"
            :declared-program-detailed="declaredProgramDetailed"
          />
        </AvTab>

        <AvTab
          :title="t('student.global.myAssociationsWithCount', { count: associationsCount })"
          :icon="ICONS.ASSOCIATIONS"
          data-testid="declared-program-associations-tab-item"
        >
          <ElementAssociations
            :context-type="EAssociationContextType.DECLARED_PROGRAM"
            :associations="associations"
            :error="associationsError"
            :is-loading="areAssociationsLoading"
          />
        </AvTab>
      </AvTabs>
    </div>
  </QuerySuspense>

  <DeleteDeclaredProgramConfirmModal
    :opened="modalOpened"
    :declared-program-ids="[selectedProgramId]"
    @close="closeModal"
    @confirm="handleConfirmDelete"
  />
</template>
