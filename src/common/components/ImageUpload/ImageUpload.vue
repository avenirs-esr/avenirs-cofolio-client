<script setup lang="ts">
import { useImageUpload } from '@/common/composables'
import { AvFileUpload } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

/**
 * ImageUpload component props.
 */
interface ImageUploadProps {
  /**
   * Default image name displayed in the left part of the file upload (before any upload)
   */
  defaultImageName?: string

  /**
   * Default image link displayed in the left part of the file upload (before any upload)
   */
  defaultImageUrl?: string

  /**
   * Alt text for the image
   */
  imageAlt: string

  /**
   * Method executed on file update
   * @param file
   */
  onUpdate: (file: File) => void

  /**
   * Method executed on delete image button click.
   * @default undefined
   */
  onDeleteImage?: () => void
}

const { defaultImageName, imageAlt, onUpdate } = defineProps<ImageUploadProps>()

const { t } = useI18n()
const imageUpload = useImageUpload()

const ACCEPTED_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf']

const errorId = 'image-upload-error'
const hintId = 'image-upload-hint'

const describedBy = computed(() => {
  return imageUpload.error.value
    ? `${hintId} ${errorId}`
    : hintId
})

/**
 * Method executed on file update
 * We only keep the first file if a list is provided
 * @param files
 */
async function onUpdateImage (files: FileList) {
  await imageUpload.update(files)
  if (imageUpload.valid.value) {
    onUpdate(files[0])
  }
}
const modelValue = defineModel<File | null>()
</script>

<template>
  <AvFileUpload
    v-model:error="imageUpload.error.value"
    v-model:valid-message="imageUpload.valid.value"
    :title="t('global.information.fileUpload.title')"
    :description="t('global.information.fileUpload.dragAndDrop')"
    :delete-button-label="t('global.buttons.delete')"
    :model-value="modelValue"
    :file-name="defaultImageName"
    :aria-describedby="describedBy"
    :accept="ACCEPTED_FILE_TYPES"
    :on-delete-file="onDeleteImage"
    @update:model-value="(value) => modelValue = value"
    @change="onUpdateImage"
    @on-drop-accept-type-error="() => { imageUpload.error.value = t('global.error.file.acceptType') }"
  >
    <template
      v-if="defaultImageName || imageUpload.previewUrl.value"
      #left
    >
      <img
        :src="defaultImageUrl ?? imageUpload.previewUrl.value!"
        :alt="imageAlt"
      >
    </template>
  </AvFileUpload>
  <span class="caption-light">
    {{ t('global.information.fileUpload.filesIndication') }}
    <span class="caption-bold">
      {{ t('global.information.fileUpload.filesTypes') }}
    </span>
    {{ t('global.information.fileUpload.sizeIndication') }}
    <span class="caption-bold">
      {{ t('global.information.fileUpload.size') }}
    </span>
  </span>
  <template v-if="imageUpload.error.value">
    <span
      :id="errorId"
      class="av-sr-only"
    >
      {{ imageUpload.error.value }}
    </span>
  </template>
</template>

<style lang="scss" scoped>
.caption-light, .caption-bold {
  color: var(--text2);
}

.b2-bold {
  color: var(--text1);
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.file-upload-container {
  border: 1px solid var(--divider);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
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

.file-upload-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
