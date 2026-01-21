<script setup lang="ts">
import { ConfirmationModal } from '@/common/components'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ROUTES } from '@/common/constants'
import DeclaredProgramSideMenu
  from '@/features/student/personalCareer/components/navigation/DeclaredProgramSideMenu/DeclaredProgramSideMenu.vue'
import {
  usePaginatedDeclaredPrograms
} from '@/features/student/personalCareer/composables/use-paginated-declared-programs/use-paginated-declared-programs'
import { useDeclaredProgramDetailedQuery } from '@/features/student/personalCareer/queries/use-declared-programs.query'
import { AvBadge, ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const selectedProgramId = computed(() => String(route.params.id ?? ''))
const isDirty = computed(() => true)
let newSelectedProgramId = selectedProgramId.value

const { showModal, displayModal, hideModal } = useModal()

const { declaredPrograms, pageInfo, loadMoreDeclaredPrograms } = usePaginatedDeclaredPrograms({ pageSize: 3 })
const { declaredProgramDetailed } = useDeclaredProgramDetailedQuery(selectedProgramId)

const programTitle = computed(() => declaredProgramDetailed.value?.title)
const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.experiences') }
])

const pendingConfirmResolve = ref<((value: boolean) => void) | null>(null)
const confirmationContext = ref<'leave' | 'switch-program'>('switch-program')

function awaitConfirmation () {
  confirmationContext.value = 'leave'
  displayModal()

  return new Promise<boolean>((resolve) => {
    pendingConfirmResolve.value = resolve
  })
}

useUnsavedChangesGuard({
  isDirty,
  confirmLeave: awaitConfirmation
})

function onSelectProgram (programId: string) {
  newSelectedProgramId = programId
  confirmationContext.value = 'switch-program'
  displayModal()
}

function cancelLeave () {
  if (confirmationContext.value === 'leave') {
    pendingConfirmResolve.value?.(false)
    pendingConfirmResolve.value = null
    hideModal()
    return
  }

  newSelectedProgramId = selectedProgramId.value
  hideModal()
}

function confirmLeave () {
  if (confirmationContext.value === 'leave') {
    pendingConfirmResolve.value?.(true)
    pendingConfirmResolve.value = null
    hideModal()
    return
  }

  router.push({
    name: ROUTES.STUDENT.PERSONAL_CAREER_UPDATE_DECLARED_PROGRAM.name,
    params: { id: newSelectedProgramId }
  })
  hideModal()
}
</script>

<template>
  <PageTitle
    :title="t('student.personalCareer.views.DeclaredProgramUpdateView.title', { programTitle })"
    :breadcrumb-links="breadcrumbLinks"
    :back="{ name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: selectedProgramId } }"
  />
  <div
    class="av-row av-justify-end av-py-md"
    data-testid="update-declared-program-view__uip"
  >
    <AvBadge
      :label="t('student.personalCareer.views.DeclaredProgramUpdateView.wipBadge')"
      background-color="var(--dark-background-primary1)"
      color="var(--dark-foreground)"
      :icon="ICONS_DATA_URL.MDI_PENCIL_OUTLINE"
    />
  </div>
  <div class="av-row av-gap-sm">
    <DeclaredProgramSideMenu
      :selected-program-id="selectedProgramId"
      :programs="declaredPrograms"
      :count-programs="pageInfo.totalElements"
      @select-program="onSelectProgram"
      @load-more-programs="loadMoreDeclaredPrograms"
    />
  </div>
  <ConfirmationModal
    :show="showModal"
    :description="t('student.personalCareer.views.DeclaredProgramUpdateView.confirmationModal.description')"
    @close="cancelLeave"
    @confirm="confirmLeave"
  />
</template>
