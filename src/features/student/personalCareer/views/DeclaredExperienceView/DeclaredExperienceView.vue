<script lang="ts" setup>
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import Loader from '@/common/components/Loader/Loader.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes } from '@/common/constants'
import { ROUTES } from '@/common/constants/route-names'
import DeclaredExperienceSideMenu
  from '@/features/student/personalCareer/components/navigation/DeclaredExperienceSideMenu/DeclaredExperienceSideMenu.vue'
import DeleteDeclaredExperienceConfirmModal from '@/features/student/personalCareer/components/overlays/DeleteDeclaredExperienceConfirmModal/DeleteDeclaredExperienceConfirmModal.vue'
import {
  usePaginatedDeclaredExperiences
} from '@/features/student/personalCareer/composables/use-paginated-declared-experiences/use-paginated-declared-experiences'
import { useDeclaredExperienceDetailedViewQuery } from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import DeclaredExperienceDetails
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetails/DeclaredExperienceDetails.vue'
import DeclaredExperienceDetailsDropdown
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const experienceId = computed(() => String(route.params.id ?? ''))

const { declaredExperience: declaredExperienceDetailed, isLoading, isError, error } = useDeclaredExperienceDetailedViewQuery({ experienceId })

const { originalErrorCode, isNotFound } = useApiErrors(error)
const isDeclaredExperienceNotFound = computed(() => originalErrorCode.value === ErrorCodes.DECLARED_EXPERIENCE_NOT_FOUND || isNotFound.value)
const experienceTitle = computed(() => declaredExperienceDetailed.value?.title ?? '')
const selectedExperienceId = computed(() => String(route.params.id ?? ''))

const { navigateToStudentDeclaredExperiences, navigateToStudentUpdateDeclaredExperience } = useNavigation()
const { showModal, displayModal, hideModal } = useModal()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.personalCareer.views.PersonalCareerView.MyCareerSection.title'), to: ROUTES.STUDENT.PERSONAL_CAREER },
  { text: t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.breadcrumb'), to: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES },
  { text: experienceTitle.value }
])

const {
  declaredExperiences,
  pageInfo,
  loadMoreDeclaredExperiences
} = usePaginatedDeclaredExperiences()

function onSelectExperience (experienceId: string) {
  router.replace({ name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name, params: { id: experienceId } })
}

function handleUpdateSelected () {
  navigateToStudentUpdateDeclaredExperience({})
}

function handleConfirmDelete () {
  hideModal()
  navigateToStudentDeclaredExperiences({ replace: true })
}
</script>

<template>
  <DetailedPageTitle
    v-if="declaredExperienceDetailed"
    :title="experienceTitle"
    :breadcrumb-links="breadcrumbLinks"
  />
  <div class="declared-experience-update-view av-row av-gap-sm">
    <div class="av-col">
      <DeclaredExperienceSideMenu
        :experience-count="pageInfo.totalElements"
        :experiences="declaredExperiences"
        :selected-experience-id="selectedExperienceId"
        @select-experience="onSelectExperience"
        @load-more-experiences="loadMoreDeclaredExperiences"
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
          :title="isDeclaredExperienceNotFound ? t('student.personalCareer.views.DeclaredExperienceView.errors.notFound.title') : t('global.error.generic')"
          :description="isDeclaredExperienceNotFound ? t('student.personalCareer.views.DeclaredExperienceView.errors.notFound.description') : error.message"
        />
      </div>
      <div
        v-if="declaredExperienceDetailed"
        class="av-col av-gap-md av-flex-fill"
      >
        <DeclaredExperienceDetailsDropdown
          @delete-selected="displayModal"
          @update-selected="handleUpdateSelected"
        />
        <DeclaredExperienceDetails
          :key="declaredExperienceDetailed.id"
          :declared-experience-details="declaredExperienceDetailed"
        />
      </div>
    </Loader>
  </div>
  <DeleteDeclaredExperienceConfirmModal
    :show="showModal"
    :declared-experience-ids="[selectedExperienceId]"
    @close="hideModal"
    @confirm="handleConfirmDelete"
  />
</template>
