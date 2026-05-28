<script lang="ts" setup>
import { invalidateGetSelfKnowledgeCategories, useAddSelfKnowledgeCategories, useGetSelfKnowledgeCategoriesAvailable } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useToasterStore } from '@/store'
import { AvCheckbox, AvCheckboxesGroup, AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
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
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { data: fetchedCategoriesAvailable } = useGetSelfKnowledgeCategoriesAvailable()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const categoriesAvailable = computed(() => fetchedCategoriesAvailable.value ?? [])

const { mutate: mutateAddSelfKnowledgeCategories, isPending } = useAddSelfKnowledgeCategories()

const selected = ref<string[]>([])

function addSelfKnowledgeCategories () {
  mutateAddSelfKnowledgeCategories({ data: selected.value }, {
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetSelfKnowledgeCategories(queryClient))
      addSuccessMessage(t('student.selfKnowledge.SelfKnowledgeMainSection.modals.addSelfKnowledgeCategories.success', { count: selected.value.length }))
      emit('confirm')
      resetSelected()
    },
    onError: (error) => {
      addErrorMessage(getErrorMessage(error))
    }
  })
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
    :is-loading="isPending || isLoading"
    @close="onCancel"
    @confirm="addSelfKnowledgeCategories"
  >
    <template #header>
      <div class="av-row av-justify-center av-flex-fill">
        <span :class="categoriesAvailable.length > 0 ? 'b2-regular' : 'b2-bold'">
          {{ t('student.selfKnowledge.SelfKnowledgeMainSection.modals.addSelfKnowledgeCategories.title', { count: categoriesAvailable.length }) }}
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
            <span class="b2-regular av-text-text1">
              {{ t('global.colon', { before: category.title }) }}

              <span class="caption-regular av-text-text1">
                {{ category.description }}
              </span>
            </span>
          </template>
        </AvCheckbox>
      </AvCheckboxesGroup>
    </div>
  </AvModal>
</template>
