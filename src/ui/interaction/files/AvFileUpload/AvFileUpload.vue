<script setup lang="ts">
import type { Slot } from 'vue'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'
import { MDI_ICONS } from '@/ui/tokens'
import { useRandomId } from '@gouvminint/vue-dsfr'

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
}>()

defineSlots<{
  /**
   * Slot for the hint description.
   */
  hint?: Slot

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

function onDrop (event: DragEvent) {
  event.preventDefault()
  isDragging.value = false

  if (!props.disabled && event.dataTransfer?.files?.length) {
    emit('change', event.dataTransfer.files)
    emit('update:modelValue', event.dataTransfer.files[0]?.name ?? '')
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
    <div class="file-upload-container">
      <div class="file-upload-content">
        <div class="left-icon-container">
          <AvVIcon
            :size="2.5"
            :name="MDI_ICONS.ATTACHMENT_PLUS"
            color="var(--icon)"
          />
        </div>
        <div class="content-container">
          <slot />
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
          :style="{ display: 'none' }"
          class="fr-upload"
          type="file"
          :aria-describedby="error || validMessage ? `${id}-desc` : undefined"
          v-bind="$attrs"
          :value="modelValue"
          :disabled="disabled"
          :aria-disabled="disabled"
          :accept="acceptTypes"
          @change="onChange($event as InputEvent)"
        >
      </div>
      <div
        v-if="error || validMessage"
        class="fr-messages-group"
        role="alert"
      >
        <p
          v-if="error || validMessage"
          :id="`${id}-desc`"
          :class="{
            'fr-error-text fr-mt-3v': error,
            'fr-valid-text fr-mt-3v': !error && validMessage,
          }"
        >
          {{ error || validMessage }}
        </p>
      </div>
    </div>
    <span class="caption-light">
      <slot name="hint" />
    </span>
  </label>
</template>

<style lang="scss" scoped>
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

.left-icon-container {
  padding: var(--spacing-none) 0.75rem;
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

.left-icon-container, .right-icon-container {
    flex: 0 0 auto;
}

.fr-upload {
  margin: 0 !important;
}
</style>
