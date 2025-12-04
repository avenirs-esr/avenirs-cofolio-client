<script setup lang="ts">
import type { SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'
import { ConfirmationModal, CreationUpdateDateDetails } from '@/common/components'
import { useModal } from '@/common/composables'
import CategoryElementDescriptionTextareaFormField
  from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementDescriptionTextareaFormField/CategoryElementDescriptionTextareaFormField.vue'
import CategoryElementRatingRadioButtonSetFormField
  from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementRatingRadioButtonSetFormField/CategoryElementRatingRadioButtonSetFormField.vue'
import CategoryElementTitleInputFormField
  from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementTitleInputFormField/CategoryElementTitleInputFormField.vue'
import {
  useUpdateSelfKnowledgeElementForm
} from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/use-update-self-knowledge-element-form/use-update-self-knowledge-element-form'
import { useToasterStore } from '@/store'
import { AvCancelConfirmButtons, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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
    description: t('student.selfKnowledge.updateSelfKnowledgeElementForm.success')
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
    class="self-knowledge-element-update-form av-flex-row-lg"
    novalidate
    @submit.prevent.stop="onSubmit"
  >
    <div class="self-knowledge-element-update-form__left-column av-flex-col-md">
      <CategoryElementTitleInputFormField :form="form" />

      <div class="av-flex-col-sm">
        <span class="b2-light">
          {{ t('student.views.selfKnowledgeCategoryView.selfKnowledgeElementDetails.ratingLabel') }}
        </span>
        <CategoryElementRatingRadioButtonSetFormField :form="form" />
      </div>
    </div>

    <div class="self-knowledge-element-update-form__right-column av-flex-col-md">
      <CategoryElementDescriptionTextareaFormField :form="form" />

      <div class="self-knowledge-element-update-form__dates av-flex-col-xs">
        <CreationUpdateDateDetails
          :updated-at="element.updatedAt"
          :created-at="element.createdAt"
          :created-at-prefix="createdAtPrefix"
        />
      </div>
    </div>
  </form>

  <div class="av-row av-row--right av-p-md">
    <AvCancelConfirmButtons
      :cancel-label="t('global.buttons.cancel')"
      :confirm-label="t('student.views.selfKnowledgeCategoryView.selfKnowledgeElementUpdate.buttons.save')"
      :confirm-disabled="!isFormValid"
      :confirm-is-loading="isSubmitting"
      :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
      :confirm-icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
      @cancel="displayConfirmationModal"
      @confirm="onSubmit"
    />
  </div>
  <ConfirmationModal
    :show="showConfirmationModal"
    :title="t('student.views.selfKnowledgeCategoryView.selfKnowledgeElementUpdate.confirmationModal.title')"
    @close="hideConfirmationModal"
    @confirm="confirmCancel"
  />
</template>

<style scoped lang="scss">
.self-knowledge-element-update-form {
  &__left-column,
  &__right-column {
    flex: 1;

    :deep(.av-input__wrapper textarea) {
      min-height: 14rem;
    }
  }
}
</style>
