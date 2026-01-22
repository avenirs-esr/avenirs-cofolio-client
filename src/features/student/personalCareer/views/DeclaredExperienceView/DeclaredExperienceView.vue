<script lang="ts" setup>
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useModal, useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants/route-names'
import DeclaredExperienceSideMenu
  from '@/features/student/personalCareer/components/navigation/DeclaredExperienceSideMenu/DeclaredExperienceSideMenu.vue'
import DeleteDeclaredExperienceConfirmModal from '@/features/student/personalCareer/components/overlays/DeleteDeclaredExperienceConfirmModal/DeleteDeclaredExperienceConfirmModal.vue'
import {
  usePaginatedDeclaredExperiences
} from '@/features/student/personalCareer/composables/use-paginated-declared-experiences/use-paginated-declared-experiences'
import { useDeclaredExperienceDetailedViewQuery } from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import DeclaredExperienceDetailsDropdown
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.vue'
import { useI18n } from 'vue-i18n'

export interface DeclaredExperienceViewProps {
  experienceId: string
}

const { experienceId } = defineProps<DeclaredExperienceViewProps>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { declaredExperience } = useDeclaredExperienceDetailedViewQuery({ experienceId })
const selectedExperienceId = computed(() => String(route.params.id ?? ''))

const { navigateToStudentDeclaredExperiences, navigateToStudentUpdateDeclaredExperience } = useNavigation()
const { showModal, displayModal, hideModal } = useModal()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.personalCareer.views.PersonalCareerView.MyCareerSection.title'), to: ROUTES.STUDENT.PERSONAL_CAREER },
  { text: t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.breadcrumb') }
])

const {
  declaredExperiences,
  pageInfo,
  loadMoreDeclaredExperiences
} = usePaginatedDeclaredExperiences({})

function onSelectExperience (experienceId: string) {
  router.push({ name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name, params: { id: experienceId } })
}

function handleUpdateSelected () {
  navigateToStudentUpdateDeclaredExperience({ replace: true })
}

function handleConfirmDelete () {
  hideModal()
  navigateToStudentDeclaredExperiences({ replace: true })
}
</script>

<template>
  <PageTitle
    title=""
    :breadcrumb-links="breadcrumbLinks"
  >
    <template #title>
      <span class="n2">
        {{ t('global.detail') }}
        <span class="n4">{{ declaredExperience?.title }}</span>
      </span>
    </template>
  </PageTitle>
  <div class="declared-experience-update-view av-row av-gap-sm">
    <DeclaredExperienceSideMenu
      :experience-count="pageInfo.totalElements"
      :experiences="declaredExperiences"
      :selected-experience-id="selectedExperienceId"
      @select-experience="onSelectExperience"
      @load-more-experiences="loadMoreDeclaredExperiences"
    />
    <div class="av-col av-flex-fill av-gap-md">
      <div class="declared-experience-details-container__title av-row--lg av-align-start--lg av-justify-between--lg">
        <span class="n4">title</span>
        <DeclaredExperienceDetailsDropdown
          @delete-selected="displayModal"
          @update-selected="handleUpdateSelected"
        />
      </div>
      <div class="av-col av-flex-fill av-gap-md av-row--md av-gap-2xl--md ">
        <div class="av-row av-flex-fill">
          <span>declared experience detailed left col placeholder with a very long text to see how it looks with the two cols.
            You can keep this layout for next devs, just remove this placeholder text
          </span>
        </div>
        <div class="av-row av-flex-fill">
          <span>declared experience detailed right col placeholder with a very long text to see how it looks with the two cols.
            You can keep this layout for next devs, just remove this placeholder text
          </span>
        </div>
      </div>
    </div>
  </div>
  <DeleteDeclaredExperienceConfirmModal
    :show="showModal"
    :declared-experience-ids="[selectedExperienceId]"
    @close="hideModal"
    @confirm="handleConfirmDelete"
  />
</template>

<style lang="scss" scoped>
.n2 {
  color: var(--title)
}

.n4 {
  color: var(--dark-background-neutral)
}
</style>
