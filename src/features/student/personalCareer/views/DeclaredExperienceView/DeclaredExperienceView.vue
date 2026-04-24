<script lang="ts" setup>
import { useGetDeclaredExperience, useGetDeclaredExperienceAssociations } from '@/api/avenir-esr'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes } from '@/common/constants'
import { ROUTES } from '@/common/constants/route-names'
import { ICONS } from '@/features/student/global/icons'
import DeclaredExperienceSideMenu from '@/features/student/personalCareer/components/navigation/DeclaredExperienceSideMenu/DeclaredExperienceSideMenu.vue'
import DeleteDeclaredExperienceConfirmModal from '@/features/student/personalCareer/components/overlays/DeleteDeclaredExperienceConfirmModal/DeleteDeclaredExperienceConfirmModal.vue'
import { usePaginatedDeclaredExperiences } from '@/features/student/personalCareer/composables/use-paginated-declared-experiences/use-paginated-declared-experiences'
import DeclaredExperienceAssociations from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceAssociations/DeclaredExperienceAssociations.vue'
import DeclaredExperienceDetails from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetails/DeclaredExperienceDetails.vue'
import DeclaredExperienceDetailsDropdown from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

enum DeclaredExperienceViewTabs {
  DETAILS = 0,
  ASSOCIATIONS = 1
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const activeTab = ref(DeclaredExperienceViewTabs.DETAILS)

const experienceId = computed(() => String(route.params.id ?? ''))

const { data: declaredExperienceDetailed, isLoading, error } = useGetDeclaredExperience(experienceId, { query: { placeholderData: keepPreviousData } })

const { originalErrorCode, isNotFound } = useApiErrors(error)
const isDeclaredExperienceNotFound = computed(() =>
  originalErrorCode.value === ErrorCodes.DECLARED_EXPERIENCE_NOT_FOUND || isNotFound.value
)

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

const { data: associations, error: associationsError } = useGetDeclaredExperienceAssociations(experienceId, {
  query: { placeholderData: keepPreviousData }
})

// TODO: Add other associations length
const countAssociations = computed(() => (associations.value?.traceAssociations.length ?? 0))
const traceAssociations = computed(() => associations.value?.traceAssociations ?? [])

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
    <QuerySuspense
      :error="error"
      :is-loading="isLoading"
    >
      <template #error>
        <ErrorMessage
          v-if="error"
          :title="isDeclaredExperienceNotFound ? t('student.personalCareer.views.DeclaredExperienceView.errors.notFound.title') : t('global.error.generic')"
          :description="isDeclaredExperienceNotFound ? t('student.personalCareer.views.DeclaredExperienceView.errors.notFound.description') : error.message"
        />
      </template>

      <div
        v-if="declaredExperienceDetailed"
        class="av-col av-gap-md av-flex-fill"
      >
        <DeclaredExperienceDetailsDropdown
          @delete-selected="displayModal"
          @update-selected="handleUpdateSelected"
        />

        <AvTabs v-model="activeTab">
          <AvTab
            :title="t('student.personalCareer.views.DeclaredExperienceView.tabs.details.title')"
            :icon="MDI_ICONS.INFORMATION_OUTLINE"
          >
            <DeclaredExperienceDetails
              :key="declaredExperienceDetailed.id"
              :declared-experience-details="declaredExperienceDetailed"
            />
          </AvTab>

          <AvTab
            :title="t('student.global.myAssociationsWithCount', { count: countAssociations })"
            :icon="ICONS.ASSOCIATIONS"
            data-testid="declared-experience-associations-tab-item"
          >
            <DeclaredExperienceAssociations
              :trace-associations="traceAssociations"
              :associations-error="associationsError"
            />
          </AvTab>
        </AvTabs>
      </div>
    </QuerySuspense>
  </div>

  <DeleteDeclaredExperienceConfirmModal
    :show="showModal"
    :declared-experience-ids="[selectedExperienceId]"
    @close="hideModal"
    @confirm="handleConfirmDelete"
  />
</template>
