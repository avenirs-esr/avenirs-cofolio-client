<script lang="ts" setup>
import { ETraceAssociationType, type TraceDetailDTO } from '@/api/avenir-esr'
import AssociateSkillAutocompleteField
  from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceAssociateModal/components/AssociateSkillAutocompleteField/AssociateSkillAutocompleteField.vue'
import {
  useAssociateTraceForm
} from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceAssociateModal/components/use-associate-trace-form/use-associate-trace-form'
import { useToasterStore } from '@/store'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { trace, show, onClose } = defineProps<{
  trace: TraceDetailDTO
  show: boolean
  onClose: () => void
}>()

const { t } = useI18n()
const { addSuccessMessage } = useToasterStore()

const { form, isSubmitting } = useAssociateTraceForm({
  trace,
  onAssociated: () => {
    addSuccessMessage({
      timeout: 2000,
      description: t('student.views.studentToolsTracesView.studentDetailedTraceAssociateModal.success'),
    })
    form.reset()
    onClose()
  },
})

const formState = form.useStore(s => s)

const isDisabled = computed(() => {
  const hasSelection = !!formState.value.values.selectedAssociation
  return !hasSelection || isSubmitting.value
})
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.views.studentToolsTracesView.studentDetailedTraceAssociateModal.buttons.associate')"
    :confirm-button-icon="MDI_ICONS.ATTACH_FILE"
    :confirm-button-disabled="isDisabled"
    :is-loading="isSubmitting"
    @close="onClose"
    @confirm="form.handleSubmit"
  >
    <template #header>
      <h3>{{ t('student.views.studentToolsTracesView.studentDetailedTraceAssociateModal.title') }}</h3>
      <span class="n5">{{ trace.title }}</span>
    </template>
    <div class="content-container">
      <AssociateSkillAutocompleteField
        :form="form"
        :association-type="ETraceAssociationType.SKILL_LEVEL"
      />
    </div>
  </AvModal>
</template>

<style lang="scss" scoped>
.content-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  // TODO: Padding bottom to avoid a display bug while adding content (remove when fixed)
  padding-bottom: 20vh;
}
</style>
