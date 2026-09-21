<script setup lang="ts">
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { ACCEPTED_IMAGE_TYPES, PROFILE_PICTURE_RATIO } from '@/common/components/ImageUpload/config'
import { useImageUpload, useModal } from '@/common/composables'
import { canvasToFile } from '@/common/utils/file/file'
import { AvFileUpload } from '@avenirs-esr/avenirs-dsav'
import { Cropper } from 'vue-advanced-cropper'
import { useI18n } from 'vue-i18n'
import 'vue-advanced-cropper/dist/style.css'

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
   * Aspect ratio for the cropper
   * @default PROFILE_PICTURE_RATIO
   */
  aspectRatio?: number

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

const {
  defaultImageName,
  defaultImageUrl,
  imageAlt,
  onUpdate,
  onDeleteImage,
  aspectRatio = PROFILE_PICTURE_RATIO,
} = defineProps<ImageUploadProps>()

const modelValue = defineModel<File | null>({
  required: false,
  default: null
})

const { t } = useI18n()
const imageUpload = useImageUpload()
const { modalOpened, openModal, closeModal } = useModal()
const { modalOpened: cropperModalOpened, openModal: openCropperModal, closeModal: closeCropperModal } = useModal()

/**
 * File displayed by AvFileUpload.
 * This is intentionally independent from modelValue:
 * selecting a file must not update the model before the crop is confirmed.
 */
const files = ref<File[]>([])

const errorId = 'image-upload-error'
const hintId = 'image-upload-hint'

const describedBy = computed(() => {
  return imageUpload.error.value
    ? `${hintId} ${errorId}`
    : hintId
})

const currentImage = ref<File | null>(null)
const currentImageUrl = ref<string | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

async function onUpdateImage () {
  if (!canvasRef.value) {
    return false
  }

  const canvasFile = await canvasToFile(
    canvasRef.value,
    currentImage.value?.name ?? 'image'
  )

  if (!canvasFile) {
    return false
  }

  await imageUpload.update([canvasFile])

  if (!imageUpload.valid.value) {
    return false
  }

  modelValue.value = canvasFile
  files.value = [canvasFile]

  onUpdate(canvasFile)

  return true
}

function onConfirmDeleteImage () {
  closeModal()

  imageUpload.clear()
  files.value = []
  modelValue.value = null

  if (onDeleteImage) {
    onDeleteImage()
  }
}

function onSelectImage (selectedFiles: FileList | File[]) {
  const file = selectedFiles[0]

  if (!file) {
    return
  }

  if (currentImageUrl.value) {
    URL.revokeObjectURL(currentImageUrl.value)
  }

  currentImage.value = file
  currentImageUrl.value = URL.createObjectURL(file)

  files.value = [file]

  openCropperModal()
}

function cropperChange ({ canvas }: { canvas: HTMLCanvasElement }) {
  canvasRef.value = canvas
}

async function onConfirmCropper () {
  const updated = await onUpdateImage()

  if (!updated) {
    return
  }

  closeCropperModal()
  cleanupCropper()
}

function onCloseCropper () {
  files.value = modelValue.value ? [modelValue.value] : []

  closeCropperModal()
  cleanupCropper()
}

function cleanupCropper () {
  if (currentImageUrl.value) {
    URL.revokeObjectURL(currentImageUrl.value)
  }

  currentImage.value = null
  currentImageUrl.value = null
  canvasRef.value = null
}
</script>

<template>
  <div v-bind="$attrs">
    <AvFileUpload
      v-model:error="imageUpload.error.value"
      v-model:valid-message="imageUpload.valid.value"
      v-model="files"
      :title="t('global.information.imageUpload.title')"
      :description="t('global.information.imageUpload.dragAndDrop')"
      :delete-button-label="t('global.buttons.delete')"
      :file-name="defaultImageName"
      :aria-describedby="describedBy"
      :accept="ACCEPTED_IMAGE_TYPES"
      :max-file-size-mb="5"
      @change="onSelectImage"
      @accept-type-error="() => { imageUpload.error.value = t('global.error.file.acceptType') }"
      @delete-file="openModal"
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
    :opened="cropperModalOpened"
    :close-button-label="t('global.buttons.close')"
    @confirm="onConfirmCropper"
    @close="onCloseCropper"
  >
    <Cropper
      class="cropper"
      :src="currentImageUrl"
      :stencil-props="{
        aspectRatio,
      }"
      @change="cropperChange"
    />
  </ConfirmationModal>

  <ConfirmationModal
    :opened="modalOpened"
    :title="t('global.information.imageUpload.deleteConfirmation')"
    description=""
    @confirm="onConfirmDeleteImage"
    @close="closeModal"
  />
</template>

<style lang="scss" scoped>
img {
  object-fit: cover;
}

.cropper {
  width: 100%;
  height: 100%;
}
</style>
