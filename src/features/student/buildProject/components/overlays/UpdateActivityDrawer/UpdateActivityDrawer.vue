<script setup lang="ts">
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import FormCancelConfirmButtons from '@/common/components/FormCancelConfirmButtons/FormCancelConfirmButtons.vue'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import ActivityPeriodFormField
  from '@/features/student/buildProject/components/interactions/formFields/ActivityPeriodFormField/ActivityPeriodFormField.vue'
import { useUpdateActivityForm } from '@/features/student/buildProject/components/overlays/UpdateActivityDrawer/use-update-activity-form/use-update-activity-form'
import KitValorizationToggleFormField
  from '@/features/student/global/components/interaction/formFields/KitValorizationToggleFormField/KitValorizationToggleFormField.vue'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { startOfDay } from 'date-fns'
import { useI18n } from 'vue-i18n'

export interface UpdateActivityDrawerProps {
  show: boolean
  declaredActivity: DeclaredActivityDetailsDTO
}

const { show, declaredActivity } = defineProps<UpdateActivityDrawerProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
const { addSuccessMessage } = useToasterStore()
const { form, isFormValid, isSubmitting } = useUpdateActivityForm(
  computed(() => declaredActivity),
  () => {
    addSuccessMessage({
      timeout: 2000,
      description: t('student.buildProject.activities.overlays.UpdateActivityDrawer.success')
    })
    form.reset()
    emit('close')
  }
)

const isActivityPeriodDefined = computed(() => !!declaredActivity.activity.startDate || !!declaredActivity.activity.endDate)

const { showModal: showConfirmationModal, displayModal: displayConfirmationModal, hideModal: hideConfirmationModal } = useModal()

const isDirty = computed(() => {
  const state = form.useStore(state => state)
  return state.value.isDirty
})

const {
  canLeave,
  confirm,
  cancel
} = useUnsavedChangesGuard({
  isDirty,
  openModal: displayConfirmationModal,
  closeModal: hideConfirmationModal
})

async function handleCancel () {
  if (await canLeave()) {
    form.reset()
    emit('close')
  }
}

const minStartDate = computed(() => {
  if (!declaredActivity.createdAt) {
    return
  }
  return startOfDay(new Date(declaredActivity.createdAt))
})

const isDemo = __DEMO_MODE__
</script>

<template>
  <AvDrawer
    :show="show"
    position="right"
    width="40rem"
    @escape-pressed="handleCancel"
  >
    <div class="av-col av-gap-md">
      <AvIconText
        :icon="MDI_ICONS.PENCIL_OUTLINE"
        icon-color="var(--text2)"
        :text="t('student.buildProject.activities.overlays.UpdateActivityDrawer.title')"
        text-color="var(--text1)"
        typography-class="n6"
      />

      <form
        novalidate
        @submit.prevent.stop="form.handleSubmit"
      >
        <AvAccordionsGroup :active-accordion="0">
          <AvAccordion
            :title="t('student.buildProject.activities.overlays.UpdateActivityDrawer.sections.valorization')"
            :icon="MDI_ICONS.STAR_OUTLINE"
          >
            <div class="av-flex-col-md">
              <KitValorizationToggleFormField :form="form" />
            </div>
          </AvAccordion>

          <AvAccordion
            v-if="!isActivityPeriodDefined"
            :title="t('student.buildProject.activities.overlays.UpdateActivityDrawer.sections.period')"
            :icon="MDI_ICONS.CALENDAR_OUTLINE"
          >
            <div class="av-flex-col-md">
              <ActivityPeriodFormField
                :form="form"
                :label="t('student.buildProject.activities.overlays.UpdateActivityDrawer.sections.periodLabel')"
                :start-min-date="minStartDate"
              />
              <span class="caption-bold">
                {{ t('student.buildProject.activities.overlays.UpdateActivityDrawer.sections.notificationHint') }}
              </span>
            </div>
          </AvAccordion>

          <AvAccordion
            v-if="!isDemo"
            :title="t('student.buildProject.activities.overlays.UpdateActivityDrawer.sections.reminder')"
            :icon="MDI_ICONS.STAR_SHOOTING_OUTLINE"
          >
            <div class="av-flex-col-md" />
          </AvAccordion>
        </AvAccordionsGroup>
      </form>
    </div>

    <template #footer>
      <div
        v-memo="[isFormValid, isSubmitting]"
        class="av-row av-justify-end av-p-md"
      >
        <FormCancelConfirmButtons
          :is-submitting="isSubmitting"
          :is-form-valid="isFormValid"
          @cancel="handleCancel"
          @submit="form.handleSubmit"
        />
      </div>
    </template>
  </AvDrawer>

  <ConfirmationModal
    :show="showConfirmationModal"
    :description="t('student.buildProject.activities.overlays.UpdateActivityDrawer.confirmationModal.description')"
    @close="cancel"
    @confirm="confirm"
  />
</template>
