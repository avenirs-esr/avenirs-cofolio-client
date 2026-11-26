<script lang="ts" setup>
import type { ToolDTO } from '#shared/api/avenir-esr/index'
import { EToolType, invalidateGetLocalTools, invalidateGetNationalTools, useDeleteLocalTools, useDeleteNationalTools } from '#shared/api/avenir-esr/index'
import { usePaginatedTools, useTaskLoading } from '#shared/composables/index'
import { useModal } from '#shared/composables/use-modal/use-modal'
import { BG_COLORS, ICON_COLORS, TEXT_COLORS } from '#shared/constants/colors'
import { ICONS } from '#shared/constants/icons'
import { useToasterStore } from '#shared/stores/index'
import ToolInstitution from '#shared/ui/components/base/ToolInstitution/ToolInstitution.vue'
import QuerySuspense from '#shared/ui/components/containers/QuerySuspense/QuerySuspense.vue'
import ConfirmationModal from '#shared/ui/components/overlay/modals/ConfirmationModal/ConfirmationModal.vue'
import CompactCardSelector from '#shared/ui/components/overlay/selectors/CompactCardSelector/CompactCardSelector.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { computed, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

export interface DeleteToolsModalProps {
  opened: boolean
  isNational?: boolean
}

const { opened, isNational = false } = defineProps<DeleteToolsModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const { modalOpened, openModal, closeModal, } = useModal()
const { addErrorMessage, addWarningMessage, addSuccessMessage } = useToasterStore()
const { withTaskLoading } = useTaskLoading()
const queryClient = useQueryClient()

const { pageInfo: nationalPageInfo, isFetching: isNationalPageInfoFetching, error: nationalPageInfoError } = usePaginatedTools({
  typeRef: toRef(EToolType.NATIONAL),
  currentPageRef: ref(0),
  pageSizeRef: ref(1),
  enabledRef: computed(() => opened)
})
const { pageInfo: localPageInfo, isFetching: isLocalPageInfoFetching, error: localPageInfoError } = usePaginatedTools({
  typeRef: toRef(undefined),
  currentPageRef: ref(0),
  pageSizeRef: ref(1),
  enabledRef: computed(() => opened && !isNational)
})

const { tools: nationalTools, isFetching: isNationalToolsFetching, error: nationalToolsError } = usePaginatedTools({
  typeRef: toRef(EToolType.NATIONAL),
  currentPageRef: ref(0),
  pageSizeRef: computed(() => nationalPageInfo.value?.totalElements ?? 0),
  enabledRef: computed(() => opened && (nationalPageInfo.value?.totalElements ?? 0) > 0)
})
const { tools: localTools, isFetching: isLocalToolsFetching, error: localToolsError } = usePaginatedTools({
  typeRef: toRef(undefined),
  currentPageRef: ref(0),
  pageSizeRef: computed(() => localPageInfo.value?.totalElements ?? 0),
  enabledRef: computed(() => opened && (localPageInfo.value?.totalElements ?? 0) > 0)
})

const { mutateAsync: deleteNationalTools, isPending: isDeletingNationalTools } = useDeleteNationalTools()

const { mutateAsync: deleteLocalTools, isPending: isDeletingLocalTools } = useDeleteLocalTools()

const selectedToolIds = ref<string[]>([])

const isLoading = computed(() => isNationalPageInfoFetching.value
  || isLocalPageInfoFetching.value || isNationalToolsFetching.value || isLocalToolsFetching.value
  || isDeletingNationalTools.value || isDeletingLocalTools.value)
const error = computed(() => nationalPageInfoError.value || localPageInfoError.value || nationalToolsError.value || localToolsError.value)

const tools = computed(() => [...nationalTools.value, ...localTools.value])
const selectableTools = computed(() => tools.value
  .map(tool => ({ id: tool.id, title: tool.name, baseElement: tool, showSlot: true })))

const selectedTools = computed(() => tools.value.filter(({ id }) => selectedToolIds.value.includes(id)))

const selectedNationalTools = computed(() => selectedTools.value.filter(({ type }) => type === EToolType.NATIONAL))
const selectedLocalTools = computed(() => selectedTools.value.filter(({ type }) => type === EToolType.LOCAL))
const selectedRegionalTools = computed(() => selectedTools.value.filter(({ type }) => type === EToolType.REGIONAL))

const selectedNationalToolsIds = computed(() => selectedNationalTools.value.map(({ id }) => id))
const selectedLocalToolsIds = computed(() => selectedLocalTools.value.map(({ id }) => id))
const selectedRegionalToolsIds = computed(() => selectedRegionalTools.value.map(({ id }) => id))
const selectedNonNationalToolsIds = computed(() => [...selectedLocalToolsIds.value, ...selectedRegionalToolsIds.value])

const i18nKey = 'global.components.overlay.modals.DeleteToolsModal'
const confirmDeleteModalKey = `${i18nKey}.confirmDeleteToolsModal`

function resetSelectedTools () {
  selectedToolIds.value = []
}

function onCancel () {
  resetSelectedTools()
  emit('cancel')
}

async function deleteTools () {
  const promises = [
    deleteNationalTools({ data: selectedNationalToolsIds.value }),
    deleteLocalTools({ data: selectedNonNationalToolsIds.value })
  ]
  const results = await withTaskLoading(() => Promise.allSettled(promises))
  const someRejected = results.some(result => result.status === 'rejected')
  const allRejected = results.every(result => result.status === 'rejected')
  const someFulfilled = results.some(result => result.status === 'fulfilled')
  const allFulfilled = results.every(result => result.status === 'fulfilled')

  if (someRejected) {
    allRejected
      ? addErrorMessage(t(`${confirmDeleteModalKey}.errors.all`))
      : addWarningMessage(t(`${confirmDeleteModalKey}.errors.some`))
  }

  if (someFulfilled) {
    addSuccessMessage(t(`${confirmDeleteModalKey}.success.${allFulfilled ? 'all' : 'some'}`))
    resetSelectedTools()
    await withTaskLoading(() => Promise.all([
      invalidateGetNationalTools(queryClient),
      invalidateGetLocalTools(queryClient)
    ]))
    closeModal()
    emit('deleted')
  }
}
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :confirm-button-label="t(`${i18nKey}.confirm`, { count: selectedTools.length })"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selectedTools.length === 0"
    :confirm-button-disabled-tooltip="t(`${i18nKey}.confirmDisabledTooltip`)"
    data-testid="delete-tools-modal"
    @close="onCancel"
    @confirm="openModal"
  >
    <template #header>
      <div class="av-row av-justify-center av-flex-fill">
        <span
          class="b1-bold av-text-text1"
          data-testid="delete-tools-modal-title"
        >
          {{ t(`${i18nKey}.title`, { count: tools.length }) }}
        </span>
      </div>
    </template>

    <QuerySuspense
      :error="error"
      :is-loading="isLoading"
      :is-empty="tools.length === 0"
    >
      <CompactCardSelector
        v-model="selectedToolIds"
        :elements="selectableTools"
        :icon="ICONS.TOOLS"
        :color="TEXT_COLORS.TOOLS"
        :icon-color="ICON_COLORS.TOOLS"
        :background-color="BG_COLORS.TOOLS"
        checkbox-color="var(--dark-background-primary1)"
        overlay-color="var(--dark-background-primary1)"
        :overlay-opacity="0.25"
      >
        <template #default="{ element }">
          <ToolInstitution
            :tool="(element as ToolDTO)"
            typography-class="caption-regular av-max-lines"
          />
        </template>
      </CompactCardSelector>
    </QuerySuspense>
  </ConfirmationModal>

  <ConfirmationModal
    :opened="modalOpened"
    @close="closeModal"
    @confirm="deleteTools"
  >
    <template #header>
      <div class="av-row av-justify-center av-flex-fill">
        <span
          class="b1-bold av-text-text1"
          data-testid="confirm-delete-tools-modal-title"
        >
          {{ t(`${confirmDeleteModalKey}.title`, { count: selectedTools.length }) }}
        </span>
      </div>
    </template>

    <div class="av-col av-gap-sm">
      <template
        v-for="(toolsList, index) in [selectedNationalTools, selectedRegionalTools, selectedLocalTools]"
        :key="index"
      >
        <div v-if="toolsList.length > 0">
          <span class="b2-bold">{{ t(`${confirmDeleteModalKey}.${toolsList[0].type}`) }}</span>
          <ul class="b2-regular">
            <li
              v-for="tool in toolsList"
              :key="tool.id"
            >
              <div class="av-col av-gap-xxs">
                <span class="b2-regular">{{ tool.name }}</span>
                <ToolInstitution :tool="tool" />
              </div>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </ConfirmationModal>
</template>
