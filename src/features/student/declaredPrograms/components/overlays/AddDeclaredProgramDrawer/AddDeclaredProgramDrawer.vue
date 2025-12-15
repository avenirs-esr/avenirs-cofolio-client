<script setup lang="ts">
import { ConfirmationModal } from '@/common/components'
import { useModal } from '@/common/composables'
import DeclaredProgramDescriptionFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramDescriptionFormField/DeclaredProgramDescriptionFormField.vue'
import DeclaredProgramLinkFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramLinkFormField/DeclaredProgramLinkFormField.vue'
import DeclaredProgramOrganizationFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramOrganizationFormField/DeclaredProgramOrganizationFormField.vue'
import DeclaredProgramPeriodFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramPeriodFormField/DeclaredProgramPeriodFormField.vue'
import DeclaredProgramResultFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramResultFormField/DeclaredProgramResultFormField.vue'
import DeclaredProgramSourceOfInformationFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramSourceOfInformationFormField/DeclaredProgramSourceOfInformationFormField.vue'
import DeclaredProgramTitleFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramTitleFormField/DeclaredProgramTitleFormField.vue'
import { useAddDeclaredProgramForm } from '@/features/student/declaredPrograms/components/overlays/AddDeclaredProgramDrawer/use-add-declared-program-form/use-add-declared-program-form'
import { useDeclaredProgramsStore } from '@/features/student/declaredPrograms/stores/declaredPrograms.store'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvCancelConfirmButtons, AvDrawer, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const declaredProgramsStore = useDeclaredProgramsStore()
const { addSuccessMessage } = useToasterStore()
const showDrawer = toRef(declaredProgramsStore, 'showAddDeclaredProgramDrawer')

const { form, isFormValid, isSubmitting } = useAddDeclaredProgramForm(() => {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.declaredPrograms.overlays.AddDeclaredProgramDrawer.success')
  })
  form.reset()
  declaredProgramsStore.hideAddDeclaredProgramDrawer()
})

const { showModal: showConfirmationModal, displayModal: displayConfirmationModal, hideModal: hideConfirmationModal } = useModal()

const isDirty = computed(() => {
  const state = form.useStore(state => state)
  return state.value.isDirty
})

function handleCancel () {
  if (isDirty.value) {
    displayConfirmationModal()
  }
  else {
    confirmCancel()
  }
}

function confirmCancel () {
  form.reset()
  declaredProgramsStore.hideAddDeclaredProgramDrawer()
  hideConfirmationModal()
}
</script>

<template>
  <AvDrawer
    :show="showDrawer"
    position="right"
    width="40rem"
    @escape-pressed="handleCancel"
  >
    <div class="av-flex-col-lg h-full">
      <span class="n5">
        {{ t('student.declaredPrograms.overlays.AddDeclaredProgramDrawer.title') }}
      </span>

      <div class="add-declared-program-drawer__content">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AvAccordionsGroup>
            <AvAccordion
              :title="t('student.declaredPrograms.overlays.AddDeclaredProgramDrawer.sections.addProgram')"
              :icon="MDI_ICONS.PENCIL_OUTLINE"
            >
              <div class="av-flex-col-md">
                <DeclaredProgramTitleFormField :form="form" />
                <DeclaredProgramDescriptionFormField :form="form" />
                <DeclaredProgramOrganizationFormField :form="form" />
                <DeclaredProgramPeriodFormField :form="form" />
                <DeclaredProgramResultFormField :form="form" />
                <DeclaredProgramSourceOfInformationFormField :form="form" />
                <DeclaredProgramLinkFormField :form="form" />
              </div>
            </AvAccordion>

            <AvAccordion
              :title="t('student.declaredPrograms.overlays.AddDeclaredProgramDrawer.sections.specifyProgram')"
              :icon="MDI_ICONS.INFORMATION_OUTLINE"
            >
              <div class="av-flex-col-md" />
            </AvAccordion>

            <AvAccordion
              :title="t('student.declaredPrograms.overlays.AddDeclaredProgramDrawer.sections.associateProgram')"
              :icon="MDI_ICONS.ATTACH_FILE"
            >
              <div class="av-flex-col-md" />
            </AvAccordion>
          </AvAccordionsGroup>
        </form>
      </div>
    </div>

    <template #footer>
      <div
        v-memo="[isFormValid, isSubmitting]"
        class="av-row av-row--right av-p-md"
      >
        <AvCancelConfirmButtons
          :cancel-label="t('global.buttons.cancel')"
          :confirm-label="t('global.buttons.save')"
          :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          :confirm-icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
          :cancel-disabled="isSubmitting"
          :confirm-disabled="!isFormValid || isSubmitting"
          :confirm-is-loading="isSubmitting"
          @cancel="handleCancel"
          @confirm="form.handleSubmit"
        />
      </div>
    </template>
  </AvDrawer>

  <ConfirmationModal
    :show="showConfirmationModal"
    :description="t('student.declaredPrograms.overlays.AddDeclaredProgramDrawer.confirmationModal.description')"
    @close="hideConfirmationModal"
    @confirm="confirmCancel"
  />
</template>
