<script lang="ts" setup>
import { ConfirmationModal } from '@/common/components'
import Loader from '@/common/components/Loader/Loader.vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ROUTES } from '@/common/constants/route-names'
import UpdateInProgressBadge from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import DeclaredExperienceSideMenu
  from '@/features/student/personalCareer/components/navigation/DeclaredExperienceSideMenu/DeclaredExperienceSideMenu.vue'
import { usePaginatedDeclaredExperiences } from '@/features/student/personalCareer/composables/use-paginated-declared-experiences/use-paginated-declared-experiences'
import { useDeclaredExperienceDetailedViewQuery } from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import UpdateDeclaredExperienceForm
  from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/components/UpdateDeclaredExperienceForm/UpdateDeclaredExperienceForm.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeclaredExperienceUpdateViewProps {
  experienceId: string
}

const { experienceId } = defineProps<DeclaredExperienceUpdateViewProps>()
enum DeclaredExperienceUpdateViewTabs {
  DETAILS = 0,
  ASSOCIATIONS = 1
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const selectedExperienceId = computed(() => String(route.params.id ?? ''))
const isDirty = ref(false)

const { showModal, displayModal, hideModal } = useModal()

const { declaredExperiences, pageInfo, loadMoreDeclaredExperiences } = usePaginatedDeclaredExperiences({})
const { declaredExperience, isLoading, isError } = useDeclaredExperienceDetailedViewQuery({ experienceId: selectedExperienceId })

const declaredExperienceTitle = computed(() => declaredExperience.value?.title ?? '')

const activeTab = ref(DeclaredExperienceUpdateViewTabs.DETAILS)
const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.personalCareer.views.PersonalCareerView.MyCareerSection.title'), to: ROUTES.STUDENT.PERSONAL_CAREER },
  { text: t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.breadcrumb') },
  { text: declaredExperienceTitle.value }
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

async function onSelectExperience (experienceId: string) {
  if (await canLeave()) {
    router.push({
      name: ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE.name,
      params: { id: experienceId }
    })
  }
}

function onDirtyChange (value: boolean) {
  isDirty.value = value
}

function onExperienceUpdated () {
  isDirty.value = false
  router.push({ name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name, params: { id: selectedExperienceId.value } })
}
</script>

<template>
  <PageTitle
    title=""
    :breadcrumb-links="breadcrumbLinks"
    :back="{ name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name, params: { id: selectedExperienceId } }"
  >
    <template #title>
      <span class="n2 av-text-title">
        {{ t('global.buttons.update') }}
        <span class="n4">{{ declaredExperienceTitle }}</span>
      </span>
    </template>
  </PageTitle>

  <div class="av-row av-gap-sm">
    <DeclaredExperienceSideMenu
      :selected-experience-id="experienceId"
      :experiences="declaredExperiences"
      :experience-count="pageInfo.totalElements"
      @select-experience="onSelectExperience"
      @load-more-experiences="loadMoreDeclaredExperiences"
    />

    <div class="av-col av-gap-sm av-justify-start av-flex-fill">
      <UpdateInProgressBadge :show="isDirty" />
      <AvTabs v-model="activeTab">
        <AvTab
          :title="t('student.personalCareer.views.DeclaredExperienceUpdateView.tabs.experience.title')"
          :icon="MDI_ICONS.INFORMATION_OUTLINE"
        >
          <Loader
            :is-loading="isLoading && !isError"
            size="2xl"
          >
            <UpdateDeclaredExperienceForm
              v-if="declaredExperience"
              :key="declaredExperience.id"
              :declared-experience="declaredExperience"
              @dirty-change="onDirtyChange"
              @experience-updated="onExperienceUpdated"
              @cancel="router.push({ name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name, params: { id: selectedExperienceId } })"
            />
          </Loader>
        </AvTab>
        <AvTab
          :title="t('student.global.myAssociationsWithCount', { count: 0 })"
          :icon="MDI_ICONS.LINK"
        >
          <div class="av-row av-flex-fill">
            <span>declared experience update association right part placeholder with a very long text to see how it looks while waiting this part.
              You can keep this layout for next devs, just remove this placeholder text
            </span>
          </div>
        </AvTab>
      </AvTabs>
    </div>
  </div>
  <ConfirmationModal
    :show="showModal"
    :description="t('student.personalCareer.views.DeclaredExperienceUpdateView.confirmationModal.description')"
    @close="cancel"
    @confirm="confirm"
  />
</template>

<style lang="scss" scoped>
.n4 {
  color: var(--dark-background-neutral)
}
</style>
