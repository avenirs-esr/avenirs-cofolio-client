<script setup lang="ts">
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import CategoryElementDescriptionTextareaFormField from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementDescriptionTextareaFormField/CategoryElementDescriptionTextareaFormField.vue'
import CategoryElementRatingRadioButtonSetFormField from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementRatingRadioButtonSetFormField/CategoryElementRatingRadioButtonSetFormField.vue'
import CategoryElementTitleInputFormField from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementTitleInputFormField/CategoryElementTitleInputFormField.vue'
import { useAddSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/components/overlays/AddSelfKnowledgeCategoryElementDrawer/use-add-self-knowledge-category-element-form/use-add-self-knowledge-category-element-form'
import { useSelfKnowledgeStore } from '@/features/student/selfKnowledge/stores/self-knowledge.store'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const selfKnowledgeStore = useSelfKnowledgeStore()
const { addSuccessMessage } = useToasterStore()

const showDrawer = toRef(selfKnowledgeStore, 'showAddElementDrawer')

const selectedCategoryType = computed(() => selfKnowledgeStore.selectedCategory!.type)
const selectedCategoryTypeTranslation = computed(() => t(`student.selfKnowledge.categoryType.${selectedCategoryType.value}`))

const selectedCategoryId = computed(() => selfKnowledgeStore.selectedCategory!.id)
const selectedCategoryIcon = computed(() => getSelfKnowledgeCategoryIcon(selectedCategoryType.value))

function onElementCreated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.selfKnowledge.overlays.AddSelfKnowledgeCategoryElementDrawer.success')
  })
  confirmCancel()
}

const { form, isFormValid, isSubmitting } = useAddSelfKnowledgeCategoryElementForm(selectedCategoryId, onElementCreated)

const isFormDirty = form.useStore(state => state.isDirty)

const {
  showModal: showDiscardChangesModal,
  displayModal: displayDiscardChangesModal,
  hideModal: hideDiscardChangesModal
} = useModal()

const { canLeave, confirm, cancel } = useUnsavedChangesGuard({
  isDirty: isFormDirty,
  openModal: displayDiscardChangesModal,
  closeModal: hideDiscardChangesModal
})

const activeAccordion = ref(0)

function confirmCancel () {
  form.reset()
  activeAccordion.value = 0
  selfKnowledgeStore.closeAddElementDrawer()
  hideDiscardChangesModal()
}

async function handleCancel () {
  if (await canLeave()) {
    confirmCancel()
  }
}

async function onSave () {
  await form.handleSubmit()
}

const drawerTitle = computed(() => {
  return t('student.selfKnowledge.overlays.AddSelfKnowledgeCategoryElementDrawer.titleWithCategory', {
    category: capitalize(selectedCategoryTypeTranslation.value)
  })
})

const isDemo = __DEMO_MODE__
</script>

<template>
  <ConfirmationModal
    :show="showDiscardChangesModal"
    :title="t('student.selfKnowledge.overlays.AddSelfKnowledgeCategoryElementDrawer.confirmationModal.title')"
    @confirm="confirm"
    @close="cancel"
  />
  <AvDrawer
    :show="showDrawer"
    position="right"
    width="50rem"
    @escape-pressed="handleCancel"
  >
    <div class="av-col av-gap-md h-full">
      <h2 class="n5">
        {{ drawerTitle }}
      </h2>

      <div class="av-col av-flex-fill">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AvAccordionsGroup v-model:active-accordion="activeAccordion">
            <AvAccordion
              :title="t('student.selfKnowledge.overlays.AddSelfKnowledgeCategoryElementDrawer.accordions.definition', { categoryType: selectedCategoryTypeTranslation })"
              :icon="selectedCategoryIcon"
            >
              <div class="av-col av-gap-md av-p-md">
                <CategoryElementTitleInputFormField :form="form" />
                <CategoryElementDescriptionTextareaFormField :form="form" />
              </div>
            </AvAccordion>

            <AvAccordion
              :title="t('student.selfKnowledge.overlays.AddSelfKnowledgeCategoryElementDrawer.accordions.rating', { categoryType: selectedCategoryTypeTranslation })"
              :icon="MDI_ICONS.RATE_REVIEW"
            >
              <div class="av-col av-gap-md av-p-sm">
                <CategoryElementRatingRadioButtonSetFormField :form="form" />
              </div>
            </AvAccordion>

            <AvAccordion
              v-if="!isDemo"
              :title="t('student.selfKnowledge.overlays.AddSelfKnowledgeCategoryElementDrawer.accordions.associate', { categoryType: selectedCategoryTypeTranslation })"
              :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
            >
              <div class="add-self-knowledge-category-element-drawer__placeholder av-p-md">
                <p>Placeholder for associations</p>
              </div>
            </AvAccordion>
          </AvAccordionsGroup>
        </form>
      </div>
    </div>

    <template #footer>
      <div class="av-row av-justify-end av-p-md">
        <FormCancelConfirmButtons
          :cancel-label="t('global.buttons.exit')"
          :is-submitting="isSubmitting"
          :is-form-valid="isFormValid"
          @cancel="handleCancel"
          @submit="onSave"
        />
      </div>
    </template>
  </AvDrawer>
</template>
