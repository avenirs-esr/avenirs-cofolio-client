<script setup lang="ts">
import { AvButton, AvVIcon, MDI_ICONS } from '@/ui'
import AvFileUploadAlert from '@/ui/interaction/files/AvFileUpload/AvFileUploadAlert.vue'
import { useRandomId } from '@gouvminint/vue-dsfr'
import { nextTick, type Slot } from 'vue'

/**
 * AvFileUpload component props.
 */
export interface AvFileUploadProps {
  /**
   * Unique identifier for the file download component.
   * If not specified, a random ID is generated.
   *
   * @default () => useRandomId(...)
   */
  id?: string

  /**
   * ARIA label for file download button.
   *
   * @default ''
   */
  ariaLabel?: string

  /**
   * Accepted file types, specified as a string (like HTML `accept` attribute)
   * or an array of strings (which will be transformed into a string).
   *
   * @default undefined
   */
  accept?: string | string[]

  /**
   * Error message to be displayed in case of download problem.
   *
   * @default ''
   */
  error?: string

  /**
   * Message indicating that the downloaded file is valid.
   *
   * @default ''
   */
  validMessage?: string

  /**
   * Whether the file upload input is disabled.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Value linked to file upload input template.
   *
   * @default null
   */
  modelValue?: File | null

  /**
   * Max width of the component.
   *
   * @default undefined
   */
  maxWidth?: string

  /**
   * Title of the file upload section.
   */
  title: string

  /**
   * Description of the file upload section.
   * @default undefined
   */
  description: string

  /**
   * delete button label
   *
   */
  deleteButtonLabel: string

  /**
   * Name of actual file.
   *
   * @default undefined
   */
  fileName?: string

  /**
   * Method executed on delete file button click.
   *
   * @default undefined
   */
  onDeleteFile?: () => void

  /**
   * Whether the file upload input enable multiple file selection or not.
   *
   * @default false
   */
  enableMultiple?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AvFileUploadProps>(), {
  id: () => useRandomId('file-upload'),
  ariaLabel: '',
  accept: undefined,
  validMessage: '',
  error: '',
  modelValue: null,
  maxWidth: 'none',
  disabled: false,
  enableMultiple: false,
})

const emit = defineEmits<{
  /**
   * Event emitted when the model value linked to the file is updated.
   * @param payload The updated model value (File or null).
   */
  (e: 'update:modelValue', payload: File | null): void

  /**
   * Event emitted when the validMessage is updated.
   * @param payload The updated model value (string or null).
   */
  (e: 'update:validMessage', payload: string | null): void

  /**
   * Event emitted when the error is updated.
   * @param payload The updated model value (string or null).
   */
  (e: 'update:error', payload: string | null): void

  /**
   * Event emitted when the selected file is changed.
   * @param payload The new list of selected files (FileList).
   */
  (e: 'change', payload: FileList): void

  /**
   * Event emitted when a file of wrong type is dropped.
   */
  (e: 'onDropAcceptTypeError'): void
}>()

defineSlots<{
  /**
   * Slot for the hint description.
   */
  hint?: Slot

  /**
   * Slot for the left content.
   */
  left?: Slot

  /**
   * Default slot for global content between the left and right icons.
   */
  default?: Slot
}>()

const acceptTypes = computed(() => {
  if (Array.isArray(props.accept)) {
    return props.accept.join(',')
  }
  return props.accept
})

const isDragging = ref(false)

function isFileAccepted (file: File): boolean {
  const accept = acceptTypes.value
  if (!accept) {
    return true
  }

  const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase())

  return acceptedTypes.some((type) => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type)
    }
    else if (type.includes('/')) {
      return file.type === type || file.type.startsWith(`${type.split('/')[0]}/`)
    }
    return false
  })
}

async function onDrop (event: DragEvent) {
  event.preventDefault()
  isDragging.value = false

  if (props.disabled || !event.dataTransfer?.files?.length) {
    return
  }

  const files = Array.from(event.dataTransfer.files).filter(isFileAccepted)
  await nextTick()

  if (files.length) {
    emit('change', files as unknown as FileList)
    emit('update:modelValue', files[0] ?? '')
  }
  else {
    emit('onDropAcceptTypeError')
  }
}

function onDragOver (event: DragEvent) {
  event.preventDefault()
  if (!props.disabled) {
    isDragging.value = true
  }
}

function onDragLeave () {
  isDragging.value = false
}

function onChange ($event: InputEvent) {
  const files = ($event.target as HTMLInputElement).files
  emit('change', files as FileList)
  emit('update:modelValue', files?.[0] ?? null)
}

const isPreview = computed(() => props.fileName || (props.modelValue && !props.enableMultiple))

const uploadLabelAttrs = computed(() => {
  return {
    'for':
    props.id,
    'class':
    [
      'fr-upload-group',
      {
        'fr-upload-group--error': props.error,
        'fr-upload-group--valid': props.validMessage,
        'fr-upload-group--disabled': props.disabled,
        'drag-over': isDragging.value,
      },
    ],
    'aria-label':
    props.ariaLabel,
    'onDragover':
    onDragOver,
    'onDragleave':
    onDragLeave,
    'onDrop':
    onDrop,
  }
})

function onClear (modelValue: File | null) {
  if (modelValue) {
    emit('update:modelValue', null)
    emit('update:validMessage', null)
    emit('update:error', null)
    emit('change', [] as unknown as FileList)
  }
  else {
    props.onDeleteFile?.()
  }
}
</script>

<template>
  <component
    :is="isPreview ? 'div' : 'label'"
    v-bind="isPreview ? {} : uploadLabelAttrs"
    :class="isPreview ? 'file-preview-container' : ''"
  >
    <div :class="isPreview ? '' : 'file-upload-container'">
      <div class="file-upload-content">
        <div class="left-content-container">
          <slot name="left">
            <AvVIcon
              :size="2.5"
              :name="MDI_ICONS.ATTACHMENT_PLUS"
              color="var(--icon)"
            />
          </slot>
        </div>
        <div class="content-container">
          <div v-if="isPreview">
            <span class="b2-bold">{{ fileName || modelValue!.name }}</span>
          </div>
          <div
            v-else
            class="title-container"
          >
            <span class="b2-regular">{{ title }}</span>
            <span class="caption-light">{{ description }}</span>
          </div>

          <AvFileUploadAlert
            :valid-message="validMessage"
            :error="error"
          />
        </div>

        <div class="right-icon-container">
          <AvButton
            v-if="isPreview"
            :label="deleteButtonLabel"
            theme="SECONDARY"
            @click="() => onClear(modelValue)"
          />
          <AvVIcon
            v-else
            :size="1.5"
            :name="MDI_ICONS.TRAY_UPLOAD"
            color="var(--dark-background-primary1)"
          />
        </div>
        <input
          v-if="!isPreview"
          :id="id"
          class="fr-upload"
          type="file"
          :aria-describedby="error || validMessage ? `${id}-desc` : undefined"
          v-bind="$attrs"
          :disabled="disabled"
          :aria-disabled="disabled"
          :accept="acceptTypes"
          @change="onChange($event as InputEvent)"
        >
      </div>
    </div>
  </component>
  <span class="caption-light">
    <slot name="hint" />
  </span>
</template>

<style lang="scss" scoped>
.file-upload-container:focus-within {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

.title-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
}

.fr-upload {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
  padding: 0;
  margin: 0 !important;
}

.fr-upload-group {
  cursor: pointer;
  max-width: v-bind('maxWidth');
}

.fr-upload-group--disabled {
  cursor: not-allowed;
}

.file-preview-container {
  border: 1px solid var(--divider);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
}

.file-upload-container {
  border: 1px dashed var(--divider);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
}

.drag-over .file-upload-container {
  background-color: var(--light-background-primary1);
  border-color: var(--dark-background-primary1);
}

.file-upload-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-xs);
}

.left-content-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--dimension-4xl);
  width: var(--dimension-4xl);
  overflow: hidden;
  border-radius: var(--radius-md);
}

.content-container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}

.right-icon-container {
  padding: var(--spacing-none) var(--spacing-xs);
}

.left-content-container, .right-icon-container {
  flex: 0 0 auto;
}

.messages-group {
  padding-top: var(--spacing-xxs);
}
</style>
