<script lang="ts" setup>
import { useGetSelfKnowledgeCategories } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import DeleteSelfKnowledgeCategoriesConfirmModal from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeCategoriesConfirmModal/DeleteSelfKnowledgeCategoriesConfirmModal.vue'
import { AvCheckbox, AvCheckboxesGroup, AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface DeleteSelfKnowledgeCategoriesModalProps {
  opened: boolean
}

const { opened } = defineProps<DeleteSelfKnowledgeCategoriesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const { data: fetchedCategories, isPending } = useGetSelfKnowledgeCategories()
const { modalOpened, openModal, closeModal } = useModal()

const categories = computed(() => (fetchedCategories.value ?? []).map(category => ({
  type: category.type,
  mandatory: category.mandatory,
  title: t(`student.selfKnowledge.categories.${category.type}.title`),
  description: t(`student.selfKnowledge.categories.${category.type}.description`),
})))

const selected = ref<string[]>([])

const selectedCategories = computed(() => categories.value.filter(category => selected.value.includes(category.type)))

function resetSelected () {
  selected.value = []
}

function onConfirmDeleted () {
  emit('deleted')
  closeModal()
}

watch(() => opened, (newVal) => {
  if (!newVal) {
    resetSelected()
  }
})
</script>

<template>
  <AvModal
    :opened="opened"
    :close-button-label="categories.length > 0 ? t('global.buttons.cancel') : t('global.buttons.close')"
    :confirm-button-label="categories.length > 0 ? t('global.buttons.delete') : undefined"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selected.length === 0"
    :confirm-button-disabled-tooltip="t('student.selfKnowledge.SelfKnowledgeMainSection.modals.DeleteSelfKnowledgeCategoriesModal.confirmButtonDisabledTooltip')"
    :is-loading="isPending"
    @close="onCancel"
    @confirm="openModal"
  >
    <template #header>
      <div class="av-row av-justify-center av-flex-fill">
        <span :class="categories.length > 0 ? 'b2-regular' : 'b2-bold'">
          {{ t('student.selfKnowledge.SelfKnowledgeMainSection.modals.DeleteSelfKnowledgeCategoriesModal.title', { count: categories.length }) }}
        </span>
      </div>
    </template>

    <div
      v-if="categories.length > 0"
      class="delete-self-knowledge-categories-modal__body"
    >
      <AvCheckboxesGroup id="delete-self-knowledge-categories-modal-checkboxes-group">
        <AvCheckbox
          v-for="category in categories"
          :id="category.type"
          :key="category.type"
          v-model="selected"
          :value="category.type"
          :name="category.type"
          :disabled="category.mandatory"
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

  <DeleteSelfKnowledgeCategoriesConfirmModal
    :opened="modalOpened"
    :categories="selectedCategories"
    @close="closeModal"
    @deleted="onConfirmDeleted"
  />
</template>
