<script setup lang="ts">
import { useImageUpload } from '#shared/composables/use-image-upload/use-image-upload'
import { useModal } from '#shared/composables/use-modal/use-modal'
import ConfirmationModal from '#shared/ui/components/overlay/modals/ConfirmationModal/ConfirmationModal.vue'
import { canvasToFile } from '#shared/utils/file/file'
import { ACCEPTED_IMAGE_TYPES, SQUARE_PICTURE_RATIO } from '#shared/utils/image.config'
import { AvButton, AvFileUpload, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { computed, nextTick, ref } from 'vue'
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
   * @default SQUARE_PICTURE_RATIO
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
  aspectRatio = SQUARE_PICTURE_RATIO,
} = defineProps<ImageUploadProps>()

const modelValue = defineModel<File | null>({
  required: false,
  default: null
})

const { t } = useI18n()
const imageUpload = useImageUpload()
const { modalOpened, openModal, closeModal } = useModal()
const { modalOpened: cropperModalOpened, openModal: openCropperModal, closeModal: closeCropperModal } = useModal()

const i18nKey = 'global.components.interactions.files.ImageUpload'

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

async function onRequestDeleteImage () {
  const { value: error } = imageUpload.error
  const { value: valid } = imageUpload.valid

  files.value = modelValue.value ? [modelValue.value] : []
  openModal()

  await nextTick()
  imageUpload.error.value = error
  imageUpload.valid.value = valid
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

function backToInitialCrop () {
  if (currentImageUrl.value) {
    URL.revokeObjectURL(currentImageUrl.value)
  }

  currentImageUrl.value = URL.createObjectURL(files.value[0])
  canvasRef.value = null
}

function onAcceptTypeError () {
  imageUpload.error.value = t(`${i18nKey}.errors.acceptType`)
}

function onFileSizeError () {
  imageUpload.error.value = t(`${i18nKey}.errors.size`)
}
</script>

<template>
  <div v-bind="$attrs">
    <AvFileUpload
      v-model:error="imageUpload.error.value"
      v-model:valid-message="imageUpload.valid.value"
      v-model="files"
      :accept="ACCEPTED_IMAGE_TYPES"
      :max-file-size-mb="5"
      :title="t(`${i18nKey}.title`)"
      :description="t(`${i18nKey}.dragAndDrop`)"
      :delete-button-label="t(`${i18nKey}.delete`)"
      :file-name="defaultImageName"
      :aria-describedby="describedBy"
      @change="onSelectImage"
      @accept-type-error="onAcceptTypeError"
      @file-size-error="onFileSizeError"
      @delete-file="onRequestDeleteImage"
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
      {{ t(`${i18nKey}.filesIndication`) }}
      <span class="caption-bold av-text-text2">
        {{ t(`${i18nKey}.filesTypes`) }}
      </span>
      {{ t(`${i18nKey}.sizeIndication`) }}
      <span class="caption-bold av-text-text2">
        {{ t(`${i18nKey}.size`) }}
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
    :close-button-label="t(`${i18nKey}.close`)"
    data-testid="image-upload-cropper-modal"
    @confirm="onConfirmCropper"
    @close="onCloseCropper"
  >
    <template #header>
      <div class="av-row av-justify-end av-w-full">
        <AvButton
          :label="t(`${i18nKey}.reset`)"
          :icon="MDI_ICONS.RESTORE"
          @click="backToInitialCrop"
        />
      </div>
    </template>

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
    :title="t(`${i18nKey}.deleteConfirmation`)"
    description=""
    data-testid="image-upload-confirm-modal"
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
