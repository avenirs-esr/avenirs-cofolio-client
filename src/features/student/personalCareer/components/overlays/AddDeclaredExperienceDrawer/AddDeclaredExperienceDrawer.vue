<script setup lang="ts">
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import DeclaredExperienceActivitySectorFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceActivitySectorFormField/DeclaredExperienceActivitySectorFormField.vue'
import DeclaredExperienceDescriptionFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceDescriptionFormField/DeclaredExperienceDescriptionFormField.vue'
import DeclaredExperienceLinkFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceLinkFormField/DeclaredExperienceLinkFormField.vue'
import DeclaredExperienceLocationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceLocationFormField/DeclaredExperienceLocationFormField.vue'
import DeclaredExperienceOrganizationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceOrganizationFormField/DeclaredExperienceOrganizationFormField.vue'
import DeclaredExperiencePeriodFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperiencePeriodFormField/DeclaredExperiencePeriodFormField.vue'
import DeclaredExperienceReviewFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceReviewFormField/DeclaredExperienceReviewFormField.vue'
import DeclaredExperienceSourceOfInformationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSourceOfInformationFormField/DeclaredExperienceSourceOfInformationFormField.vue'
import DeclaredExperienceTitleFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTitleFormField/DeclaredExperienceTitleFormField.vue'
import DeclaredExperienceTypeFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTypeFormField/DeclaredExperienceTypeFormField.vue'
import { useAddDeclaredExperienceForm } from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/use-add-declared-experience-form/use-add-declared-experience-form'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const personalCareerStore = usePersonalCareerStore()
const { addSuccessMessage } = useToasterStore()
const showDrawer = toRef(personalCareerStore, 'showAddDeclaredExperienceDrawer')

const { form, isFormValid, isSubmitting } = useAddDeclaredExperienceForm(() => {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.success')
  })
  form.reset()
  personalCareerStore.hideAddDeclaredExperienceDrawer()
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
  personalCareerStore.hideAddDeclaredExperienceDrawer()
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
      <AvIconText
        :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
        :text="t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.title')"
        typography-class="n5"
        icon-color="var(--text2)"
      />

      <div class="add-declared-experience-drawer__content">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AvAccordionsGroup v-model:active-accordion="activeAccordion">
            <AvAccordion
              :title="t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.sections.addExperience')"
              :icon="MDI_ICONS.SCHOOL_OUTLINE"
            >
              <div class="av-col av-gap-md">
                <DeclaredExperienceTitleFormField :form="form" />
                <DeclaredExperienceTypeFormField :form="form" />
                <DeclaredExperienceOrganizationFormField :form="form" />
                <div class="av-row av-gap-md">
                  <div class="av-flex-fill">
                    <DeclaredExperienceActivitySectorFormField :form="form" />
                  </div>

                  <div class="av-flex-fill">
                    <DeclaredExperienceLocationFormField :form="form" />
                  </div>
                </div>
                <DeclaredExperiencePeriodFormField :form="form" />
                <DeclaredExperienceSourceOfInformationFormField :form="form" />
                <DeclaredExperienceDescriptionFormField :form="form" />
                <DeclaredExperienceReviewFormField :form="form" />
                <DeclaredExperienceLinkFormField :form="form" />
              </div>
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
    :description="t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.confirmationModal.description')"
    @close="hideConfirmationModal"
    @confirm="confirmCancel"
  />
</template>
