<script setup lang="ts">
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import DeclaredProgramDescriptionFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramDescriptionFormField/DeclaredProgramDescriptionFormField.vue'
import DeclaredProgramLinkFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramLinkFormField/DeclaredProgramLinkFormField.vue'
import DeclaredProgramOrganizationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramOrganizationFormField/DeclaredProgramOrganizationFormField.vue'
import DeclaredProgramPeriodFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramPeriodFormField/DeclaredProgramPeriodFormField.vue'
import DeclaredProgramResultFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramResultFormField/DeclaredProgramResultFormField.vue'
import DeclaredProgramSourceOfInformationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramSourceOfInformationFormField/DeclaredProgramSourceOfInformationFormField.vue'
import DeclaredProgramTitleFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramTitleFormField/DeclaredProgramTitleFormField.vue'
import { useAddDeclaredProgramForm } from '@/features/student/personalCareer/components/overlays/AddDeclaredProgramDrawer/use-add-declared-program-form/use-add-declared-program-form'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const declaredProgramsStore = usePersonalCareerStore()
const { addSuccessMessage } = useToasterStore()
const showDrawer = toRef(declaredProgramsStore, 'showAddDeclaredProgramDrawer')

const { form, isFormValid, isSubmitting } = useAddDeclaredProgramForm(() => {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.personalCareer.overlays.AddDeclaredProgramDrawer.success')
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

const activeAccordion = ref(0)
</script>

<template>
  <AvDrawer
    :show="showDrawer"
    position="right"
    width="40rem"
    @escape-pressed="handleCancel"
  >
    <div class="av-col av-gap-lg h-full">
      <span class="n5">
        {{ t('student.personalCareer.overlays.AddDeclaredProgramDrawer.title') }}
      </span>

      <div class="add-declared-program-drawer__content">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AvAccordionsGroup v-model:active-accordion="activeAccordion">
            <AvAccordion
              :title="t('student.personalCareer.overlays.AddDeclaredProgramDrawer.sections.addProgram')"
              :icon="MDI_ICONS.PENCIL_OUTLINE"
            >
              <div class="av-col av-gap-md">
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
              :title="t('student.personalCareer.overlays.AddDeclaredProgramDrawer.sections.specifyProgram')"
              :icon="MDI_ICONS.INFORMATION_OUTLINE"
            >
              <div class="av-col av-gap-md" />
            </AvAccordion>

            <AvAccordion
              :title="t('student.personalCareer.overlays.AddDeclaredProgramDrawer.sections.associateProgram')"
              :icon="MDI_ICONS.ATTACH_FILE"
            >
              <div class="av-col av-gap-md" />
            </AvAccordion>
          </AvAccordionsGroup>
        </form>
      </div>
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
    :description="t('student.personalCareer.overlays.AddDeclaredProgramDrawer.confirmationModal.description')"
    @close="hideConfirmationModal"
    @confirm="confirmCancel"
  />
</template>
