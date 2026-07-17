<script setup lang="ts">
import type { FileDTO } from '@/api/avenir-esr'
import type { ActivityResourcesListProps } from '@/common/components/lists/ActivityResourcesList/ActivityResourcesList.vue'
import type { AddActivityResourceFormData } from '@/features/staff/activities/types/forms.types'
import type { ActivityResource } from '@/features/staff/activities/types/resource.types'
import ActivityResourceCard from '@/common/components/cards/ActivityResourceCard/ActivityResourceCard.vue'
import AddCard from '@/common/components/cards/AddCard/AddCard.vue'
import SelectorOverlay from '@/common/components/overlay/SelectorOverlay/SelectorOverlay.vue'
import { useModal } from '@/common/composables'
import DeleteActivityResourcesConfirmationModal from '@/features/staff/activities/components/modals/DeleteActivityResourcesConfirmationModal/DeleteActivityResourcesConfirmationModal.vue'
import { isActivityResourceFile, isActivityResourceLink, isActivityResourcePendingFile } from '@/features/staff/activities/utils/resource.types-guard'
import AddActivityResourceModal from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/AddActivityResourceModal.vue'
import { isActivityResourceFileType, isActivityResourceLinkType } from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/utils/resource-form.types-guard'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityResourcesListEditableProps extends Omit<ActivityResourcesListProps, 'readonly'> {
  isFormDirty?: boolean
  isUpdating?: boolean
}

const {
  activityId,
  files,
  links,
  isFormDirty = false,
  isUpdating = false,
} = defineProps<ActivityResourcesListEditableProps>()

const emit = defineEmits<{
  (e: 'add', payload: AddActivityResourceFormData): void
  (e: 'delete', files: (FileDTO | File)[], links: string[]): void
}>()

const { t } = useI18n()
const {
  showModal: showAddResourceModal,
  displayModal: displayAddResourceModal,
  hideModal: hideAddResourceModal
} = useModal()
const {
  showModal: showDeleteResourcesModal,
  displayModal: displayDeleteResourcesModal,
  hideModal: hideDeleteResourcesModal
} = useModal()

const localFiles = ref([...files])
const localLinks = ref([...links])

const resourceKeysSelected = ref<string[]>([])
const resourceKeysDeleted = ref<string[]>([])
const resourceKeysToBeDeleted = computed(() => resourceKeysSelected.value.filter(key => !resourceKeysDeleted.value.includes(key)))

const selectableResources = computed(() => [...localFiles.value, ...localLinks.value].map((resource) => {
  let label: string
  let value: string

  if (isActivityResourceLink(resource)) {
    label = resource
    value = `link-${resource}`
  }
  else if (isActivityResourcePendingFile(resource)) {
    label = resource.name
    value = `pending-file-${resource.name}`
  }
  else {
    label = resource.fileName
    value = `file-${resource.id}`
  }

  return {
    label,
    value,
    baseElement: resource,
    isLoading: resourceKeysDeleted.value.includes(value)
  }
}))
const resourcesToBeDeleted = computed(() => selectableResources.value.filter(({ value }) => resourceKeysToBeDeleted.value.includes(value)).map(({ baseElement }) => baseElement))
const filesToBeDeleted = computed(() => resourcesToBeDeleted.value.filter(isActivityResourceFile))
const linksToBeDeleted = computed(() => resourcesToBeDeleted.value.filter(isActivityResourceLink))

function onResourceAdded (payload: AddActivityResourceFormData) {
  if (isActivityResourceFileType(payload) && payload.file) {
    localFiles.value = [...localFiles.value, payload.file]
  }
  else if (isActivityResourceLinkType(payload)) {
    localLinks.value = [...localLinks.value, payload.link]
  }
  emit('add', payload)
  hideAddResourceModal()
}

function onResourcesDeleted () {
  emit('delete', filesToBeDeleted.value, linksToBeDeleted.value)
  resourceKeysDeleted.value = [...resourceKeysDeleted.value, ...resourceKeysToBeDeleted.value]
  hideDeleteResourcesModal()
}

watch(() => isFormDirty, (dirty) => {
  if (!dirty) {
    localFiles.value = [...files]
    localLinks.value = [...links]

    resourceKeysSelected.value = resourceKeysSelected.value.filter(key => selectableResources.value.some(resource => resource.value === key))
    resourceKeysDeleted.value = []
  }
})
</script>

<template>
  <div
    class="activity-resources-list av-row"
    data-testid="activity-resources-list-editable"
  >
    <div class="av-col av-gap-sm av-w-full">
      <div class="activity-resources-list-editable-content av-row av-wrap av-gap-xs av-p-md av-radius-2xl av-border-width-sm av-border-style-solid">
        <SelectorOverlay
          v-model:selected-elements="resourceKeysSelected"
          :selectable-elements="selectableResources"
          small
          compact
        >
          <template #default="{ baseElement }">
            <ActivityResourceCard
              :activity-id="activityId"
              :resource="(baseElement as ActivityResource)"
              disabled
            />
          </template>
        </SelectorOverlay>

        <AddCard
          data-testid="activity-resources-list-add-card"
          @click="displayAddResourceModal"
        />
      </div>

      <div class="av-row av-justify-end">
        <AvButton
          :label="t('global.buttons.delete')"
          :icon="MDI_ICONS.TRASH_CAN_OUTLINE"
          :disabled="resourceKeysToBeDeleted.length === 0"
          :is-loading="isUpdating"
          variant="OUTLINED"
          small
          @click="displayDeleteResourcesModal"
        />
      </div>
    </div>

    <AddActivityResourceModal
      :opened="showAddResourceModal"
      @close="hideAddResourceModal"
      @added="onResourceAdded"
    />

    <DeleteActivityResourcesConfirmationModal
      :show="showDeleteResourcesModal"
      :activity-id="activityId"
      :files="filesToBeDeleted"
      :links="linksToBeDeleted"
      :is-updating="isUpdating"
      @cancel="hideDeleteResourcesModal"
      @confirm="onResourcesDeleted"
    />
  </div>
</template>

<style scoped lang="scss">
.activity-resources-list-editable-content {
  background: var(--other-background-base);
  border-color: var(--stroke);
}
</style>
