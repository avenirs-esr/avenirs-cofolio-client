<script setup lang="ts">
import { EAssociationContextType, useGetAssociations, useGetDeclaredProgram } from '@/api/avenir-esr'
import { ConfirmationModal, QuerySuspense } from '@/common/components'
import UpdateInProgressBadge from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import UpdatePageTitle from '@/common/components/UpdatePageTitle/UpdatePageTitle.vue'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ICONS, ROUTES } from '@/common/constants'
import { countElementAssociations, ElementAssociations } from '@/features/student/associations'
import DeclaredProgramUpdateForm
  from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/components/DeclaredProgramUpdateForm/DeclaredProgramUpdateForm.vue'
import { DeclaredProgramUpdateViewTabs } from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/DeclaredProgramUpdateView.types'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const selectedProgramId = computed(() => String(route.params.id ?? ''))
const isDirty = ref(false)
const activeTab = ref(DeclaredProgramUpdateViewTabs.DETAILS)

const { modalOpened, openModal, closeModal } = useModal()

const { data: declaredProgramDetailed, isLoading, error } = useGetDeclaredProgram(selectedProgramId)
const { data: declaredProgramAssociations, error: associationsError } = useGetAssociations(EAssociationContextType.DECLARED_PROGRAM, selectedProgramId)

const associationsCount = computed(() => countElementAssociations(EAssociationContextType.DECLARED_PROGRAM, declaredProgramAssociations.value))

const programTitle = computed(() => declaredProgramDetailed.value?.title ?? '')
const declaredProgramDetailedRoute = computed(() => ({
  name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name,
  params: { id: selectedProgramId.value }
}))
const trailingLinks = computed(() => [
  { text: programTitle.value, to: declaredProgramDetailedRoute.value },
  { text: `${t('global.buttons.update')} ${programTitle.value}` }
])

const { confirm, cancel } = useUnsavedChangesGuard({ isDirty, openModal, closeModal })

function onDirtyChange (value: boolean) {
  isDirty.value = value
}

function navigateToDeclaredProgramDetailed () {
  router.push(declaredProgramDetailedRoute.value)
}

function onProgramUpdated () {
  isDirty.value = false
  navigateToDeclaredProgramDetailed()
}
</script>

<template>
  <UpdatePageTitle
    :title="programTitle"
    :trailing-links="trailingLinks"
  >
    <template #actions>
      <UpdateInProgressBadge show />
    </template>
  </UpdatePageTitle>

  <QuerySuspense
    :error="error"
    :is-loading="isLoading"
  >
    <div class="av-col av-gap-sm av-justify-start av-flex-fill">
      <AvTabs v-model="activeTab">
        <AvTab
          :title="t('student.personalCareer.views.DeclaredProgramUpdateView.tabs.program.title')"
          :icon="MDI_ICONS.INFORMATION_OUTLINE"
        >
          <DeclaredProgramUpdateForm
            v-if="declaredProgramDetailed"
            :key="declaredProgramDetailed.id"
            :declared-program-detailed="declaredProgramDetailed"
            @dirty-change="onDirtyChange"
            @program-updated="onProgramUpdated"
            @cancel="navigateToDeclaredProgramDetailed"
          />
        </AvTab>

        <AvTab
          :title="t('student.global.myAssociationsWithCount', { count: associationsCount })"
          :icon="ICONS.ASSOCIATIONS"
          data-testid="update-declared-program-associations-tab"
        >
          <ElementAssociations
            :context-type="EAssociationContextType.DECLARED_PROGRAM"
            :element-id="selectedProgramId"
            :associations="declaredProgramAssociations"
            :error="associationsError"
            readonly
          />
        </AvTab>
      </AvTabs>
    </div>
  </QuerySuspense>

  <ConfirmationModal
    :opened="modalOpened"
    :description="t('student.personalCareer.views.DeclaredProgramUpdateView.confirmationModal.description')"
    @close="cancel"
    @confirm="confirm"
  />
</template>
