<script setup lang="ts">
import { useImageUpload } from '@/common/composables'
import { AvFileUpload } from '@/ui'
import { useI18n } from 'vue-i18n'

/**
 * ImageUpload component props.
 */
interface ImageUploadProps {
  /**
   * Default image displayed in the left part of the file upload (before any upload)
   */
  defaultImage: string

  /**
   * Alt text for the image
   */
  imageAlt: string

  /**
   * Method executed on file update
   * @param file
   */
  onUpdate: (file: File) => void
}

const { defaultImage, imageAlt, onUpdate } = defineProps<ImageUploadProps>()

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
 * Method exectuted on file update
 * We only keep the first file if a list is provided
 * @param files
 */
async function onUpdateImage (files: FileList) {
  await imageUpload.update(files)
  if (imageUpload.valid.value) {
    onUpdate(files[0])
  }
}
</script>

<template>
  <AvFileUpload
    :aria-describedby="describedBy"
    :error="imageUpload.error.value"
    :valid-message="imageUpload.valid.value"
    :accept="ACCEPTED_FILE_TYPES"
    @change="onUpdateImage"
    @on-drop-accept-type-error="() => { imageUpload.error.value = t('global.error.file.acceptType') }"
  >
    <template #left>
      <img
        :src="imageUpload.previewUrl.value ?? defaultImage"
        :alt="imageAlt"
      >
    </template>
    <span class="b2-bold">{{ imageUpload.name.value }}</span>
    <template #hint>
      <span
        :id="hintId"
        class="caption-light"
      >
        {{ t('global.information.imageUpload.filesIndication') }}
        <span class="caption-bold">
          {{ t('global.information.imageUpload.filesTypes') }}
        </span>
        {{ t('global.information.imageUpload.sizeIndication') }}
        <span class="caption-bold">
          {{ t('global.information.imageUpload.size') }}
        </span>
      </span>
    </template>
  </AvFileUpload>
  <template v-if="imageUpload.error.value">
    <span
      :id="errorId"
      class="fr-sr-only"
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
</style>
