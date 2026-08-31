<script setup lang="ts">
import type { SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'
import { ConfirmationModal, CreationUpdateDateDetails, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import KitValorizationToggleFormField from '@/features/global/components/interaction/formFields/KitValorizationToggleFormField/KitValorizationToggleFormField.vue'
import CategoryElementDescriptionTextareaFormField
  from '@/features/selfKnowledge/components/interactions/formFields/CategoryElementDescriptionTextareaFormField/CategoryElementDescriptionTextareaFormField.vue'
import CategoryElementRatingRadioButtonSetFormField
  from '@/features/selfKnowledge/components/interactions/formFields/CategoryElementRatingRadioButtonSetFormField/CategoryElementRatingRadioButtonSetFormField.vue'
import CategoryElementTitleInputFormField
  from '@/features/selfKnowledge/components/interactions/formFields/CategoryElementTitleInputFormField/CategoryElementTitleInputFormField.vue'
import {
  useUpdateSelfKnowledgeElementForm
} from '@/features/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/use-update-self-knowledge-element-form/use-update-self-knowledge-element-form'
import { useToasterStore } from '@/store'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementUpdateFormProps {
  element: SelfKnowledgeElementDetailsDTO
  onCancel: () => void
}

const props = defineProps<SelfKnowledgeElementUpdateFormProps>()
const { t } = useI18n()
const { showModal: showConfirmationModal, displayModal: displayConfirmationModal, hideModal: hideConfirmationModal } = useModal()
const { addSuccessMessage } = useToasterStore()

const createdAtPrefix = computed(() => capitalize(t('student.selfKnowledge.element')))

const { form, isFormValid, isSubmitting } = useUpdateSelfKnowledgeElementForm(
  toRef(props, 'element'),
  onUpdated
)

async function onSubmit () {
  await form.handleSubmit()
}

function onUpdated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.selfKnowledge.views.SelfKnowledgeElementUpdateView.updateForm.success')
  })
  props.onCancel()
}

function confirmCancel () {
  form.reset()
  hideConfirmationModal()
  props.onCancel()
}
</script>

<template>
  <form
    class="self-knowledge-element-update-form av-col av-gap-lg"
    novalidate
    @submit.prevent.stop="onSubmit"
  >
    <KitValorizationToggleFormField :form="form" />

    <div class="av-row av-gap-md">
      <div class="self-knowledge-element-update-form__left-column av-flex-fill av-col av-gap-md">
        <CategoryElementTitleInputFormField :form="form" />

        <div class="av-col av-gap-sm">
          <span class="b2-light">
            {{ t('student.selfKnowledge.views.SelfKnowledgeCategoryView.selfKnowledgeElementDetails.ratingLabel') }}
          </span>
          <CategoryElementRatingRadioButtonSetFormField :form="form" />
        </div>
      </div>

      <div class="self-knowledge-element-update-form__right-column av-col av-flex-fill av-gap-md">
        <CategoryElementDescriptionTextareaFormField :form="form" />

        <div class="self-knowledge-element-update-form__dates av-col av-flex-fill av-gap-xs">
          <CreationUpdateDateDetails
            :updated-at="element.updatedAt"
            :created-at="element.createdAt"
            :created-at-prefix="createdAtPrefix"
          />
        </div>
      </div>
    </div>
  </form>

  <div class="av-row av-justify-end av-p-md">
    <FormCancelConfirmButtons
      :cancel-label="t('global.buttons.cancel')"
      :confirm-label="t('student.selfKnowledge.views.SelfKnowledgeCategoryView.selfKnowledgeElementUpdate.buttons.save')"
      :is-submitting="isSubmitting"
      :is-form-valid="isFormValid"
      @cancel="displayConfirmationModal"
      @submit="onSubmit"
    />
  </div>
  <ConfirmationModal
    :show="showConfirmationModal"
    :title="t('student.selfKnowledge.views.SelfKnowledgeCategoryView.selfKnowledgeElementUpdate.confirmationModal.title')"
    @close="hideConfirmationModal"
    @confirm="confirmCancel"
  />
</template>

<style scoped lang="scss">
.self-knowledge-element-update-form {
  &__left-column,
  &__right-column {
    :deep(.av-input__wrapper textarea) {
      min-height: 14rem;
    }
  }
}
</style>
