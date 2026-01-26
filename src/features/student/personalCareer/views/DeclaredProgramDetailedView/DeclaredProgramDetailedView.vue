<script setup lang="ts">
import Loader from '@/common/components/Loader/Loader.vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useModal, useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
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
const { declaredProgramDetailed, isLoading, isError } = useDeclaredProgramDetailedQuery(selectedProgramId)
const { navigateToStudentUpdateDeclaredProgram, navigateToStudentDeclaredPrograms } = useNavigation()
const { showModal, displayModal, hideModal } = useModal()

const programTitle = computed(() => declaredProgramDetailed.value?.title)
const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.experiences') }
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
  <PageTitle
    :title="t('student.personalCareer.views.DeclaredProgramDetailedView.title', { programTitle })"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.PROJECT_SKILLS"
  />
  <div class="av-row av-gap-2xl">
    <DeclaredProgramSideMenu
      :selected-program-id="selectedProgramId"
      :programs="declaredPrograms"
      :count-programs="pageInfo.totalElements"
      @select-program="onSelectProgram"
      @load-more-programs="loadMoreDeclaredPrograms"
    />
    <Loader
      :is-loading="isLoading && !isError"
      size="2xl"
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
    </Loader>
  </div>

  <DeleteDeclaredProgramConfirmModal
    :show="showModal"
    :declared-program-ids="[selectedProgramId]"
    @close="hideModal"
    @confirm="handleConfirmDelete"
  />
</template>
