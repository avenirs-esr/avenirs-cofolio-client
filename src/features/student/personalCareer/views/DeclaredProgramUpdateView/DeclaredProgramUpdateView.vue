<script setup lang="ts">
import { useGetDeclaredProgram } from '@/api/avenir-esr'
import { ConfirmationModal } from '@/common/components'
import UpdateInProgressBadge from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import UpdatePageTitle from '@/common/components/UpdatePageTitle/UpdatePageTitle.vue'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ROUTES } from '@/common/constants'
import DeclaredProgramUpdateForm
  from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/components/DeclaredProgramUpdateForm/DeclaredProgramUpdateForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const selectedProgramId = computed(() => String(route.params.id ?? ''))
const isDirty = ref(false)

const { modalOpened, openModal, closeModal } = useModal()

const { data: declaredProgramDetailed } = useGetDeclaredProgram(selectedProgramId)

const programTitle = computed(() => declaredProgramDetailed.value?.title ?? '')
const trailingLinks = computed(() => [
  {
    text: programTitle.value,
    to: { name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: selectedProgramId.value } }
  },
  { text: `${t('global.buttons.update')} ${programTitle.value}` }
])

const { confirm, cancel } = useUnsavedChangesGuard({ isDirty, openModal, closeModal })

function onDirtyChange (value: boolean) {
  isDirty.value = value
}

function onProgramUpdated () {
  isDirty.value = false
  router.push({ name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: selectedProgramId.value } })
}
</script>

<template>
  <UpdatePageTitle
    :title="programTitle"
    :trailing-links="trailingLinks"
  />
  <div class="av-col av-gap-sm av-justify-start av-flex-fill">
    <UpdateInProgressBadge show />
    <DeclaredProgramUpdateForm
      v-if="declaredProgramDetailed"
      :key="declaredProgramDetailed.id"
      :declared-program-detailed="declaredProgramDetailed"
      @dirty-change="onDirtyChange"
      @program-updated="onProgramUpdated"
      @cancel="router.push({ name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: selectedProgramId } })"
    />
  </div>
  <ConfirmationModal
    :opened="modalOpened"
    :description="t('student.personalCareer.views.DeclaredProgramUpdateView.confirmationModal.description')"
    @close="cancel"
    @confirm="confirm"
  />
</template>
