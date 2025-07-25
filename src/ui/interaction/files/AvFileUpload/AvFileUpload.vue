<script setup lang="ts">
import AvIconText from '@/ui/base/AvIconText/AvIconText.vue'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'
import { MDI_ICONS } from '@/ui/tokens'
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
   * @default ''
   */
  modelValue?: string

  /**
   * Max width of the component.
   *
   * @default undefined
   */
  maxWidth?: string
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
  modelValue: '',
  maxWidth: 'none'
})

/**
 * Emits available for the AvFileUpload component.
 *
 * @emits update:modelValue - Event emitted when the model value linked to the file is updated.
 * @param payload - The updated model value (string).
 *
 * @emits change - Event emitted when the selected file is changed.
 * @param payload - The new list of selected files (FileList).
 */
const emit = defineEmits<{
  /**
   * Event emitted when the model value linked to the file is updated.
   * @param payload The updated model value (string).
   */
  (e: 'update:modelValue', payload: string): void

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
    emit('update:modelValue', files[0]?.name ?? '')
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
  emit('update:modelValue', ($event.target as HTMLInputElement)?.value)
  emit('change', ($event.target as (InputEvent['target'] & { files: FileList }))?.files)
}
</script>

<template>
  <label
    :for="id"
    class="fr-upload-group"
    :class="{
      'fr-upload-group--error': error,
      'fr-upload-group--valid': validMessage,
      'fr-upload-group--disabled': disabled,
      'drag-over': isDragging,
    }"
    :aria-label="ariaLabel"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div
      class="file-upload-container"
      :class="{
        'file-upload-container--error': error,
        'file-upload-container--valid': validMessage,
      }"
    >
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
          <slot />
          <div
            v-if="error || validMessage"
            class="messages-group"
            role="alert"
          >
            <AvIconText
              :icon="error ? MDI_ICONS.CLOSE_CIRCLE_OUTLINE : MDI_ICONS.CHECK_CIRCLE_OUTLINE"
              :icon-color="error ? 'var(--dark-background-error)' : 'var(--dark-background-success)'"
              :text="error ? error : validMessage"
              :text-color="error ? 'var(--dark-background-error)' : 'var(--dark-background-success)'"
              typography-class="caption-regular"
            />
          </div>
        </div>
        <div class="right-icon-container">
          <AvVIcon
            :size="1.5"
            :name="MDI_ICONS.TRAY_UPLOAD"
            color="var(--dark-background-primary1)"
          />
        </div>
        <input
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
    <span class="caption-light">
      <slot name="hint" />
    </span>
  </label>
</template>

<style lang="scss" scoped>
.file-upload-container:focus-within {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
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
  margin: 0;
}

.fr-upload-group {
  cursor: pointer;
  max-width: v-bind('maxWidth');
}

.fr-upload-group--disabled {
  cursor: not-allowed;
}

.file-upload-container {
  border: 1px dashed var(--divider);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
}

.file-upload-container--error {
  border: 1px solid var(--dark-background-error)
}

.file-upload-container--valid {
  border: 1px solid var(--dark-background-success)
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

.fr-upload {
  margin: 0 !important;
}
</style>
