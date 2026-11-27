<script lang="ts" setup>
import type { ToolDTO } from '#shared/api/avenir-esr/index'
import {
  EToolType,
  invalidateGetLocalTools,
  invalidateGetNationalTools,
  useDeleteLocalTools,
  useDeleteNationalTools
} from '#shared/api/avenir-esr/index'
import { useTaskLoading } from '#shared/composables/index'
import { useToasterStore } from '#shared/stores/index'
import ToolInstitution from '#shared/ui/components/base/ToolInstitution/ToolInstitution.vue'
import ConfirmationModal from '#shared/ui/components/overlay/modals/ConfirmationModal/ConfirmationModal.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface DeleteToolModalProps {
  opened: boolean
  tool: ToolDTO
}

const { opened, tool } = defineProps<DeleteToolModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { withTaskLoading, isLoading: isTaskLoading } = useTaskLoading()
const queryClient = useQueryClient()

const { mutate: deleteNationalTools, isPending: isDeletingNationalTools } = useDeleteNationalTools({
  mutation: { onError, onSuccess }
})

const { mutate: deleteLocalTools, isPending: isDeletingLocalTools } = useDeleteLocalTools({
  mutation: { onError, onSuccess }
})

const isNational = computed(() => tool.type === EToolType.NATIONAL)
const isLoading = computed(() => isDeletingNationalTools.value || isDeletingLocalTools.value || isTaskLoading.value)

const i18nKey = 'global.components.overlay.modals.DeleteToolModal'

const title = computed(() => t(`${i18nKey}.title`, { type: t(`${i18nKey}.type.${tool.type}`) }))

function onCancel () {
  emit('cancel')
}

function onError () {
  addErrorMessage(t(`${i18nKey}.error`))
}

async function onSuccess () {
  emit('deleted')

  addSuccessMessage(t(`${i18nKey}.success`))

  await withTaskLoading(() => isNational.value
    ? invalidateGetNationalTools(queryClient)
    : invalidateGetLocalTools(queryClient))
}

async function deleteTools () {
  if (isNational.value) {
    deleteNationalTools({ data: [tool.id] })
  }
  else {
    deleteLocalTools({ data: [tool.id] })
  }
}
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :title="title"
    :confirm-button-label="t(`${i18nKey}.confirm`)"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :is-loading="isLoading"
    data-testid="delete-tool-modal"
    @close="onCancel"
    @confirm="deleteTools"
  >
    <template #description>
      <div class="av-col av-gap-xxs">
        <span class="b2-regular">{{ tool.name }}</span>
        <ToolInstitution :tool="tool" />
      </div>
    </template>
  </ConfirmationModal>
</template>
