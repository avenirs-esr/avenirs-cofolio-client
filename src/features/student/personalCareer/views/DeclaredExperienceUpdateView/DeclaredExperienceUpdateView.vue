<script lang="ts" setup>
import { useGetDeclaredExperience, useGetDeclaredExperienceAssociations } from '@/api/avenir-esr'
import { ConfirmationModal } from '@/common/components'
import UpdateInProgressBadge from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import Loader from '@/common/components/Loader/Loader.vue'
import UpdatePageTitle from '@/common/components/UpdatePageTitle/UpdatePageTitle.vue'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ICONS } from '@/common/constants'
import { ROUTES } from '@/common/constants/route-names'
import UpdateDeclaredExperienceForm
  from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/components/UpdateDeclaredExperienceForm/UpdateDeclaredExperienceForm.vue'
import DeclaredExperienceAssociations
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceAssociations/DeclaredExperienceAssociations.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

enum DeclaredExperienceUpdateViewTabs {
  DETAILS = 0,
  ASSOCIATIONS = 1
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const selectedExperienceId = computed(() => String(route.params.id ?? ''))
const isDirty = ref(false)

const { modalOpened, openModal, closeModal } = useModal()

const { data: declaredExperience, isLoading, isError } = useGetDeclaredExperience(selectedExperienceId)
const { data: declaredExperienceAssociations, error: associationsError } = useGetDeclaredExperienceAssociations(selectedExperienceId)

const traceAssociations = computed(() => declaredExperienceAssociations.value?.traceAssociations ?? [])
const declaredSkillAssociations = computed(() => declaredExperienceAssociations.value?.declaredSkillAssociations ?? [])
const countAssociations = computed(() => traceAssociations.value.length + declaredSkillAssociations.value.length)

const declaredExperienceTitle = computed(() => declaredExperience.value?.title ?? '')

const activeTab = ref(DeclaredExperienceUpdateViewTabs.DETAILS)
const trailingLinks = computed(() => [
  { text: `${t('global.detail')} ${declaredExperienceTitle.value}`, to: { name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name, params: { id: selectedExperienceId.value } } },
  { text: `${t('global.buttons.update')} ${declaredExperienceTitle.value}` }
])

const { confirm, cancel } = useUnsavedChangesGuard({ isDirty, openModal, closeModal })

function onDirtyChange (value: boolean) {
  isDirty.value = value
}

function onExperienceUpdated () {
  isDirty.value = false
  router.push({ name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name, params: { id: selectedExperienceId.value } })
}
</script>

<template>
  <UpdatePageTitle
    :title="declaredExperienceTitle"
    :trailing-links="trailingLinks"
  >
    <template #actions>
      <UpdateInProgressBadge show />
    </template>
  </UpdatePageTitle>

  <div class="av-col av-gap-sm av-justify-start av-flex-fill">
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
        :title="t('student.global.myAssociationsWithCount', { count: countAssociations })"
        :icon="ICONS.ASSOCIATIONS"
        data-testid="update-declared-experience-associations-tab"
      >
        <DeclaredExperienceAssociations
          :declared-experience-id="selectedExperienceId"
          :trace-associations="traceAssociations"
          :declared-skill-associations="declaredSkillAssociations"
          :associations-error="associationsError"
          disabled
          :show-actions="false"
        />
      </AvTab>
    </AvTabs>
  </div>
  <ConfirmationModal
    :opened="modalOpened"
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
