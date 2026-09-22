<script lang="ts" setup>
import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { IdTitleList } from '@/types'
import { useModal } from '@/common/composables'
import AssociationsSelector from '@/features/student/associations/components/interactions/AssociationsSelector/AssociationsSelector.vue'
import DeleteAssociationsConfirmModal
  from '@/features/student/associations/components/overlays/modals/DeleteAssociationsConfirmModal/DeleteAssociationsConfirmModal.vue'
import { useAssociationMutations } from '@/features/student/associations/composables/use-association-mutations/use-association-mutations'
import { getElementAssociations } from '@/features/student/associations/utils/associations.utils'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteAssociationsModalProps {
  opened: boolean
  /** Context type of the element whose associations are deleted. */
  contextType: EAssociationContextType
  /** Id of the element whose associations are deleted. */
  elementId: string
  /** Context type of the associated elements to unassociate. */
  associatedContextType: EAssociationContextType
  associations: AssociationsDTO
}

const { opened, contextType, elementId, associatedContextType, associations } = defineProps<DeleteAssociationsModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()

const {
  modalOpened: confirmModalOpened,
  openModal: openConfirmModal,
  closeModal: closeConfirmModal
} = useModal()

const { unassociate, isPending } = useAssociationMutations()

const selectedAssociationIds = ref<string[]>([])

const elementAssociations = computed(() => getElementAssociations(associations, associatedContextType))

const selectedAssociations = computed<IdTitleList>(() =>
  elementAssociations.value
    .filter(({ associationId }) => selectedAssociationIds.value.includes(associationId))
    .map(({ associationId, title }) => ({ id: associationId, title }))
)

watch(() => opened, (isOpened) => {
  if (!isOpened) {
    closeConfirmModal()
    selectedAssociationIds.value = []
  }
})

function onCancel () {
  selectedAssociationIds.value = []
  emit('cancel')
}

function onConfirm () {
  closeConfirmModal()

  unassociate({
    contextType,
    elementId,
    associatedContextType,
    associationIds: selectedAssociationIds.value
  }, () => {
    selectedAssociationIds.value = []
    emit('deleted')
  })
}
</script>

<template>
  <AvModal
    :opened="opened"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.associations.overlays.modals.DeleteAssociationsModal.confirmButton', { count: selectedAssociationIds.length })"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selectedAssociationIds.length === 0"
    :is-loading="isPending"
    data-testid="delete-associations-modal"
    @close="onCancel"
    @confirm="openConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center av-flex-fill"
        data-testid="delete-associations-modal-header"
      >
        <span class="b2-regular av-text-text1">
          {{ t('student.associations.overlays.modals.DeleteAssociationsModal.title', { count: elementAssociations.length }) }}
        </span>
      </div>
    </template>

    <AssociationsSelector
      v-model="selectedAssociationIds"
      :associated-context-type="associatedContextType"
      :associations="associations"
    />
  </AvModal>

  <DeleteAssociationsConfirmModal
    :opened="confirmModalOpened"
    :associations="selectedAssociations"
    @cancel="closeConfirmModal"
    @confirm="onConfirm"
  />
</template>
