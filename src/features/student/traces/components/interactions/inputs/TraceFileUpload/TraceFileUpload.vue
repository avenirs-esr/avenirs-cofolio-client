<script setup lang="ts">
import type { FileUploadProps } from '@/common/components/interaction/files/FileUpload/FileUpload.vue'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'
import FileUpload from '@/common/components/interaction/files/FileUpload/FileUpload.vue'
import { useFileValidation } from '@/common/composables/use-file-validation/use-file-validation'
import { useSingletonArray } from '@/common/composables/use-singleton-array/use-singleton-array'
import { bytesToMegabytes } from '@/common/utils/file/file'
import { TRACE_ACCEPTED_FILE_TYPES } from '@/features/student/traces/components/interactions/inputs/TraceFileUpload/types'
import { TRACE_MAX_SIZE_BYTES } from '@/features/student/traces/config'

interface TraceFileUploadProps extends Omit<FileUploadProps, 'title' | 'description' | 'ariaLabel' | 'accept' | 'modelValue'> {
  title?: string
  description?: string
  accept?: string[]
  label?: string
}

const {
  title = undefined,
  description = undefined,
  accept = [...TRACE_ACCEPTED_FILE_TYPES],
  disabled = false,
  ...restProps
} = defineProps<TraceFileUploadProps>()

const modelValue = defineModel<File | null>({
  required: true
})

const { t } = useI18n()
const attrs = useAttrs()

const files = useSingletonArray(modelValue)
const { getMaxSizeForFile } = useFileValidation({
  acceptedFileTypes: accept,
  maxSizeConfig: TRACE_MAX_SIZE_BYTES
})

function getMaxSizeMb (file: File) {
  const bytes = getMaxSizeForFile(file)
  return bytes ? bytesToMegabytes(bytes) : undefined
}

const filesTypesMaxSize = computed(() => [
  { type: 'global.images', fileType: 'image/*' },
  { type: 'global.text', fileType: 'text/*' },
  { type: 'global.audio', fileType: 'audio/*' },
  { type: 'global.video', fileType: 'video/*' },
  { type: 'global.application', fileType: 'application/*' }
].map(item => ({
  ...item,
  size: `${bytesToMegabytes(TRACE_MAX_SIZE_BYTES[item.fileType]!)}${t('global.megabyteUnit')}`
})))

const avFileUploadProps = computed<FileUploadProps>(() => ({
  ...attrs,
  ...restProps,
  accept,
  disabled,
  title: title ?? t('global.information.FileUpload.title'),
  ariaLabel: title ?? t('global.information.FileUpload.title'),
  description: description ?? t('global.information.FileUpload.dragAndDrop')
}))
</script>

<template>
  <div class="trace-file-upload">
    <div
      v-if="label"
      class="av-pb-xxs"
      data-testid="trace-file-upload__label"
    >
      <span class="b2-light av-text-text1">
        {{ label }}
      </span>
    </div>
    <FileUpload
      v-bind="avFileUploadProps"
      v-model="files"
      :max-file-size-mb="getMaxSizeMb"
      confirm-delete
    />
    <div>
      <span
        v-for="(item, index) in filesTypesMaxSize"
        :key="item.type"
        class="caption-light"
      >
        {{ t(item.type) }} : <span class="caption-bold">{{ item.size }}</span>
        <span v-if="index < filesTypesMaxSize.length - 1"> • </span>
      </span>
    </div>
  </div>
</template>
