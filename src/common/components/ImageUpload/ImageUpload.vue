<script setup lang="ts">
import { useImageUpload } from '@/common/composables'
import { AvFileUpload } from '@/ui'
import { nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

interface ImageUploadProps {
  defaultImage: string
  imageAlt: string
  onUpdate: (file: File) => void
}

const { defaultImage, imageAlt, onUpdate } = defineProps<ImageUploadProps>()

const { t } = useI18n()
const imageUpload = useImageUpload()

const ACCEPTED_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf']

async function onUpdateImage (files: FileList) {
  imageUpload.update(files)
  await nextTick()
  if (imageUpload.valid.value) {
    onUpdate(files[0])
  }
}
</script>

<template>
  <AvFileUpload
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
      <span class="caption-light">
        {{ t('student.widgets.overview.updateProfileDrawer.pictures.format.filesIndication') }}
        <span class="caption-bold">
          {{ t('student.widgets.overview.updateProfileDrawer.pictures.format.filesTypes') }}
        </span>
        {{ t('student.widgets.overview.updateProfileDrawer.pictures.format.sizeIndication') }}
        <span class="caption-bold">
          {{ t('student.widgets.overview.updateProfileDrawer.pictures.format.size') }}
        </span>
      </span>
    </template>
  </AvFileUpload>
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
