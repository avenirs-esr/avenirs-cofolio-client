<script setup lang="ts">
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useImageUpload, useModal } from '@/common/composables'
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

const { defaultImageName, imageAlt, onUpdate, onDeleteImage } = defineProps<ImageUploadProps>()

const { t } = useI18n()
const imageUpload = useImageUpload()

const ACCEPTED_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

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
async function onUpdateImage (files: FileList | File[]) {
  await imageUpload.update(files)
  if (imageUpload.valid.value) {
    onUpdate(files[0])
  }
}
const modelValue = defineModel<File | null>()

const { showModal, displayModal, hideModal } = useModal()

function onConfirmDeleteImage () {
  hideModal()
  imageUpload.clear()

  if (onDeleteImage) {
    onDeleteImage()
  }
}
</script>

<template>
  <div v-bind="$attrs">
    <AvFileUpload
      v-model:error="imageUpload.error.value"
      v-model:valid-message="imageUpload.valid.value"
      :title="t('global.information.imageUpload.title')"
      :description="t('global.information.imageUpload.dragAndDrop')"
      :delete-button-label="t('global.buttons.delete')"
      :model-value="modelValue"
      :file-name="defaultImageName"
      :aria-describedby="describedBy"
      :accept="ACCEPTED_FILE_TYPES"
      :max-file-size-mb="5"
      @update:model-value="(value) => modelValue = value"
      @change="onUpdateImage"
      @accept-type-error="() => { imageUpload.error.value = t('global.error.file.acceptType') }"
      @delete-file="displayModal"
    >
      <template
        v-if="defaultImageName || imageUpload.previewUrl.value"
        #left
      >
        <img
          :src="defaultImageUrl ?? imageUpload.previewUrl.value!"
          :alt="imageAlt"
          class="av-w-full av-h-full"
        >
      </template>
    </AvFileUpload>
    <span class="caption-light av-text-text2">
      {{ t('global.information.imageUpload.filesIndication') }}
      <span class="caption-bold av-text-text2">
        {{ t('global.information.imageUpload.filesTypes') }}
      </span>
      {{ t('global.information.imageUpload.sizeIndication') }}
      <span class="caption-bold av-text-text2">
        {{ t('global.information.imageUpload.size') }}
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
  </div>

  <ConfirmationModal
    :show="showModal"
    :title="t('global.information.imageUpload.deleteConfirmation')"
    description=""
    @confirm="onConfirmDeleteImage"
    @close="hideModal"
  />
</template>

<style lang="scss" scoped>
img {
  object-fit: cover;
}
</style>
