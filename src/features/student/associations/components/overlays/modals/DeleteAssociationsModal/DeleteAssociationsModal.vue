<script lang="ts" setup>
import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { IdTitleList } from '@/types'
import { useModal } from '@/common/composables'
import AssociationsSelector from '@/features/student/associations/components/interactions/AssociationsSelector/AssociationsSelector.vue'
import DeleteAssociationsConfirmModal
  from '@/features/student/associations/components/overlays/modals/DeleteAssociationsConfirmModal/DeleteAssociationsConfirmModal.vue'
import { useAssociationMutations } from '@/features/student/associations/composables/use-association-mutations/use-association-mutations'
import { availableTypes } from '@/features/student/associations/constants/associations.constants'
import { getElementAssociations } from '@/features/student/associations/utils/associations.utils'
import { AvModal, AvSelect, type AvSelectSelectedOption, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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

  availableTypes: EAssociationContextType []
}

const { opened, contextType, elementId, associatedContextType, associations, } = defineProps<DeleteAssociationsModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()

const isTypeSelectable = computed(() => availableTypes.length > 0)

const internalType = ref<EAssociationContextType | undefined>(
  isTypeSelectable.value ? undefined : associatedContextType
)

const typeOptions = computed(() =>
  availableTypes.filter(type => type !== associatedContextType)
    .map(type => ({
      id: type,
      label: t(`student.associations.types.${type}`)
    }))
)
const selectedItem = computed<AvSelectSelectedOption>({
  get: () => ({
    itemId: internalType.value ?? ''
  }),
  set: ({ itemId }) => {
    internalType.value = itemId as EAssociationContextType
  }
})

const {
  modalOpened: confirmModalOpened,
  openModal: openConfirmModal,
  closeModal: closeConfirmModal
} = useModal()

const { unassociate, isPending } = useAssociationMutations()

const selectedAssociationIds = ref<string[]>([])

const elementAssociations = computed(() => getElementAssociations(associations, internalType.value ?? associatedContextType))

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
    associatedContextType: internalType.value ?? associatedContextType,
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
    :confirm-button-disabled-tooltip="t('student.associations.overlays.modals.DeleteAssociationsModal.confirmButtonDisabledTooltip')"
    :is-loading="isPending"
    data-testid="delete-associations-modal"
    @close="onCancel"
    @confirm="openConfirmModal"
  >
    <div class="associate-type-select">
      <AvSelect
        v-if="isTypeSelectable"
        v-model:selected-item="selectedItem"
        :options="typeOptions"
        :placeholder="t(`student.associations.chooseType`)"
      />
    </div>

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
    <template v-if="internalType">
      <AssociationsSelector
        v-model="selectedAssociationIds"
        :associated-context-type="internalType"
        :associations="associations"
      />
    </template>
  </AvModal>

  <DeleteAssociationsConfirmModal
    :opened="confirmModalOpened"
    :associations="selectedAssociations"
    @cancel="closeConfirmModal"
    @confirm="onConfirm"
  />
</template>

<style lang="css">
.associate-type-select {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
</style>
