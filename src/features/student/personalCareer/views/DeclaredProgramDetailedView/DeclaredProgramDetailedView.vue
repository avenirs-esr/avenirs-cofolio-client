<script setup lang="ts">
import { EAssociationContextType, useGetAssociations, useGetDeclaredProgram } from '@/api/avenir-esr'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes, ICONS } from '@/common/constants'
import { countElementAssociations, ElementAssociations } from '@/features/student/associations'
import DeleteDeclaredProgramConfirmModal from '@/features/student/personalCareer/components/overlays/DeleteDeclaredProgramConfirmModal/DeleteDeclaredProgramConfirmModal.vue'
import DeclaredProgramDetailed from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramDetailed/DeclaredProgramDetailed.vue'
import ManageDeclaredProgramDropdown from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

enum DeclaredProgramDetailedViewTabs {
  DETAILS = 0,
  ASSOCIATIONS = 1
}

const { t } = useI18n()
const route = useRoute()
const selectedProgramId = computed(() => String(route.params.id ?? ''))

const activeTab = ref(DeclaredProgramDetailedViewTabs.DETAILS)

const { data: declaredProgramDetailed, isLoading, isError, error } = useGetDeclaredProgram(selectedProgramId)
const { navigateToStudentUpdateDeclaredProgram, navigateToStudentDeclaredPrograms } = useNavigation()
const { modalOpened, openModal, closeModal } = useModal()

const { data: associations, error: associationsError } = useGetAssociations(
  EAssociationContextType.DECLARED_PROGRAM,
  selectedProgramId,
  undefined,
  { query: { enabled: computed(() => !!selectedProgramId.value) } }
)

const { originalErrorCode, isNotFound, getErrorMessage } = useApiErrors(error)
const isDeclaredProgramNotFound = computed(() => originalErrorCode.value === ErrorCodes.DECLARED_PROGRAM_NOT_FOUND || isNotFound.value)

const programTitle = computed(() => declaredProgramDetailed.value?.title ?? '')
const trailingLinks = computed(() => [{ text: programTitle.value }])
const associationsCount = computed(() => countElementAssociations(EAssociationContextType.DECLARED_PROGRAM, associations.value))

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
        @update="navigateToStudentUpdateDeclaredProgram"
        @delete="openModal"
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
            :element-id="declaredProgramDetailed.id"
            :associations="associations"
            :error="associationsError"
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
