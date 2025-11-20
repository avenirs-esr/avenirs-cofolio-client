<script lang="ts" setup>
import { useSelfKnowledgeCategoriesAvailableQuery, useUpdateSelfKnowledgeCategoriesMutation } from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { useToasterStore } from '@/store'
import { AvCheckbox, AvCheckboxesGroup, AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface AddSelfKnowledgeCategoriesModalProps {
  show: boolean
}

defineProps<AddSelfKnowledgeCategoriesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { categoriesAvailable } = useSelfKnowledgeCategoriesAvailableQuery()

const { mutate: updateSelfKnowledgeCategories } = useUpdateSelfKnowledgeCategoriesMutation({
  onSuccess: (_data, variables) => {
    addSuccessMessage(t('student.views.studentProjectTrajectoriesView.selfKnowledge.modals.addSelfKnowledgeCategories.success', { count: variables.selectedIds.length }))
    emit('confirm')
    resetSelected()
  },
  onError: (error) => {
    addErrorMessage(error.message)
  }
})

const selected = ref<string[]>([])

function onConfirm () {
  updateSelfKnowledgeCategories({ selectedIds: selected.value })
}

function onCancel () {
  emit('cancel')
  resetSelected()
}

function resetSelected () {
  selected.value = []
}
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="categoriesAvailable.length > 0 ? t('global.buttons.cancel') : t('global.buttons.close')"
    :confirm-button-label="categoriesAvailable.length > 0 ? t('global.buttons.add') : undefined"
    :confirm-button-icon="MDI_ICONS.CHECK_CIRCLE"
    :confirm-button-disabled="selected.length === 0"
    @close="onCancel"
    @confirm="onConfirm"
  >
    <template #header>
      <div class="add-self-knowledge-categories-modal__header">
        <span :class="categoriesAvailable.length > 0 ? 'b2-regular' : 'b2-bold'">
          {{ t('student.views.studentProjectTrajectoriesView.selfKnowledge.modals.addSelfKnowledgeCategories.title', { count: categoriesAvailable.length }) }}
        </span>
      </div>
    </template>

    <div
      v-if="categoriesAvailable.length > 0"
      class="add-self-knowledge-categories-modal__body"
    >
      <AvCheckboxesGroup id="add-self-knowledge-categories-modal-checkboxes-group">
        <AvCheckbox
          v-for="category in categoriesAvailable"
          :id="category.id"
          :key="category.id"
          v-model="selected"
          :value="category.id"
          :name="category.id"
        >
          <template #label>
            <span class="b2-regular">
              {{ t('global.colon', { before: category.title }) }}

              <span class="caption-regular">
                {{ category.description }}
              </span>
            </span>
          </template>
        </AvCheckbox>
      </AvCheckboxesGroup>
    </div>
  </AvModal>
</template>

<style lang="scss" scoped>
.add-self-knowledge-categories-modal {
  &__header {
    display: flex;
    justify-content: center;
    flex: 1;
  }

  &__body {
    .b2-bold,
    .b2-regular {
      color: var(--text1);
    }
  }
}
</style>
