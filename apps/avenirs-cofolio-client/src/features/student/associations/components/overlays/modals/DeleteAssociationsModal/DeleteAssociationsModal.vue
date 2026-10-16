<script lang="ts" setup>
import type { AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import type { EAssociationContextType } from '@/api/avenir-esr'
import type { IdTitleList } from '@/types'
import { AvModal, AvSelect, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useGetAssociations } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import AssociationsSelector from '@/features/student/associations/components/interactions/AssociationsSelector/AssociationsSelector.vue'
import DeleteAssociationsConfirmModal
  from '@/features/student/associations/components/overlays/modals/DeleteAssociationsConfirmModal/DeleteAssociationsConfirmModal.vue'
import { useAssociationMutations } from '@/features/student/associations/composables/use-association-mutations/use-association-mutations'
import { countAssociations, getAssociableContextTypes, getElementAssociations } from '@/features/student/associations/utils/associations.utils'

export interface DeleteAssociationsModalProps {
  opened: boolean
  /** Context type of the element whose associations are deleted. */
  contextType: EAssociationContextType
  /** Id of the element whose associations are deleted. */
  elementId: string
}

const { opened, contextType, elementId, } = defineProps<DeleteAssociationsModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { data: associations } = useGetAssociations(contextType, elementId, undefined, {
  query: {
    enabled: computed(() => !!elementId)
  }
})

const { t } = useI18n()

const associableContextTypes = computed(() => getAssociableContextTypes(contextType))
const isTypeSelectable = computed(() => associableContextTypes.value.length > 0)

const internalType = ref<EAssociationContextType | undefined>(associableContextTypes.value?.[0])

const typeOptions = computed(() =>
  associableContextTypes.value.filter(type => type !== contextType)
    .map((type) => {
      const disabled = countAssociations(associations.value, [type]) === 0
      return {
        value: type,
        label: t(`student.associations.availableContextTypes.${type}`),
        disabled,
        disabledTooltip: disabled
          ? t(`student.associations.contextTypes.${type}.unassociateDisabledTooltip`)
          : undefined

      }
    })
)
const selectedType = computed<AvSelectSelectedOption | null>({
  get () {
    const type = internalType?.value
    if (!type) {
      return null
    }
    return typeOptions.value.find(option => String(option.value) === type) ?? null
  },
  set (typeOption) {
    if (typeOption) {
      internalType.value = typeOption.value as EAssociationContextType
    }
  }
})

const {
  modalOpened: confirmModalOpened,
  openModal: openConfirmModal,
  closeModal: closeConfirmModal
} = useModal()

const { unassociate, isPending } = useAssociationMutations()

const selectedAssociationIds = ref<string[]>([])

const elementAssociations = computed(() => getElementAssociations(associations.value, internalType.value))

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
    associatedContextType: internalType.value!,
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

    <AvSelect
      v-if="isTypeSelectable"
      :model-value="selectedType"
      :options="typeOptions"
      :label="t('student.associations.overlays.associateModal.chooseType')"
      :placeholder="t(`student.associations.overlays.associateModal.chooseTypePlaceholder`)"
      data-testid="association-type-select"
      @update:model-value="(option) => { selectedType = option as AvSelectSelectedOption | null }"
    />

    <template v-if="internalType && associations">
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
