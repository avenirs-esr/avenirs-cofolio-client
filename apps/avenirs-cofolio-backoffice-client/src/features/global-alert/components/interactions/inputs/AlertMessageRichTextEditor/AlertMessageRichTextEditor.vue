<script setup lang="ts">
import type { RichTextEditorProps } from '@avenirs-esr/shared'
import { RichTextEditor } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'

interface AlertMessageRichTextEditorProps extends Omit<RichTextEditorProps, 'maxlength' | 'allowedHeadersLevels'> {}

const { errorMessage } = defineProps<AlertMessageRichTextEditorProps>()

const modelValue = defineModel<string>()

const { t } = useI18n()
</script>

<template>
  <div class="av-col av-gap-xs">
    <span
      class="caption-regular"
      data-testid="alert-message-rich-text-editor-label"
    >
      {{ t('global-alert.components.interactions.inputs.AlertMessageRichTextEditor.label') }}
    </span>

    <RichTextEditor
      v-model="modelValue"
      :error-message
      :allowed-headers-levels="[]"
    />
  </div>
</template>
