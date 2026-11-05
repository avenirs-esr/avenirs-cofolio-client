<script setup lang="ts">
import type { AvRichTextEditorProps } from '@avenirs-esr/avenirs-dsav'
import type { ComputedRef } from 'vue'
import { AvMessage, AvRichTextEditor } from '@avenirs-esr/avenirs-dsav'
import { computed, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface RichTextEditorProps {
  maxlength?: number
  errorMessage?: string | string[]
  allowedHeadersLevels?: AvRichTextEditorProps['allowedHeadersLevels']
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<RichTextEditorProps>()

const { t } = useI18n()
const attrs = useAttrs()

const content = defineModel<string>()
const charCount = defineModel<number>('charCount')

const errorMessages = computed(() => {
  if (!props.errorMessage) {
    return []
  }
  return Array.isArray(props.errorMessage) ? props.errorMessage : [props.errorMessage]
})

const avRichTextEditorProps: ComputedRef<AvRichTextEditorProps> = computed(() => {
  const { errorMessage: _errorMessage, allowedHeadersLevels, ...rest } = props
  return {
    ...attrs,
    ...rest,
    allowedHeadersLevels: allowedHeadersLevels ?? [4, 5, 6],
    editorLabel: t('global.components.interactions.inputs.AvRichTextEditor.editor'),
    toolbarLabel: t('global.components.interactions.inputs.AvRichTextEditor.toolbar'),
    undoLabel: t('global.components.interactions.inputs.AvRichTextEditor.undo'),
    redoLabel: t('global.components.interactions.inputs.AvRichTextEditor.redo'),
    paragraphLabel: t('global.components.interactions.inputs.AvRichTextEditor.paragraph'),
    headingLabel: t('global.components.interactions.inputs.AvRichTextEditor.heading'),
    boldLabel: t('global.components.interactions.inputs.AvRichTextEditor.bold'),
    italicLabel: t('global.components.interactions.inputs.AvRichTextEditor.italic'),
    underlineLabel: t('global.components.interactions.inputs.AvRichTextEditor.underline'),
    linkLabel: t('global.components.interactions.inputs.AvRichTextEditor.link'),
    linkNameLabel: t('global.components.interactions.inputs.AvRichTextEditor.linkName'),
    linkNamePlaceholder: t('global.components.interactions.inputs.AvRichTextEditor.linkNamePlaceholder'),
    linkUrlLabel: t('global.components.interactions.inputs.AvRichTextEditor.linkUrl'),
    unsetLinkLabel: t('global.components.interactions.inputs.AvRichTextEditor.unsetLink'),
    imageLabel: t('global.components.interactions.inputs.AvRichTextEditor.image'),
    imageNameLabel: t('global.components.interactions.inputs.AvRichTextEditor.imageName'),
    imageNamePlaceholder: t('global.components.interactions.inputs.AvRichTextEditor.imageNamePlaceholder'),
    imageUrlLabel: t('global.components.interactions.inputs.AvRichTextEditor.imageUrl'),
    removeImageLabel: t('global.components.interactions.inputs.AvRichTextEditor.removeImage'),
    insertTableLabel: t('global.components.interactions.inputs.AvRichTextEditor.insertTable'),
    tableSettingsLabel: t('global.components.interactions.inputs.AvRichTextEditor.tableSettings'),
    deleteTableLabel: t('global.components.interactions.inputs.AvRichTextEditor.deleteTable'),
    addColumnBeforeLabel: t('global.components.interactions.inputs.AvRichTextEditor.addColumnBefore'),
    addColumnAfterLabel: t('global.components.interactions.inputs.AvRichTextEditor.addColumnAfter'),
    deleteColumnLabel: t('global.components.interactions.inputs.AvRichTextEditor.deleteColumn'),
    addRowBeforeLabel: t('global.components.interactions.inputs.AvRichTextEditor.addRowBefore'),
    addRowAfterLabel: t('global.components.interactions.inputs.AvRichTextEditor.addRowAfter'),
    deleteRowLabel: t('global.components.interactions.inputs.AvRichTextEditor.deleteRow'),
    alignLeftLabel: t('global.components.interactions.inputs.AvRichTextEditor.alignLeft'),
    alignCenterLabel: t('global.components.interactions.inputs.AvRichTextEditor.alignCenter'),
    alignRightLabel: t('global.components.interactions.inputs.AvRichTextEditor.alignRight'),
    alignJustifyLabel: t('global.components.interactions.inputs.AvRichTextEditor.alignJustify'),
    bulletListLabel: t('global.components.interactions.inputs.AvRichTextEditor.bulletList'),
    orderedListLabel: t('global.components.interactions.inputs.AvRichTextEditor.orderedList'),
    decreaseIndentLabel: t('global.components.interactions.inputs.AvRichTextEditor.decreaseIndent'),
    increaseIndentLabel: t('global.components.interactions.inputs.AvRichTextEditor.increaseIndent'),
    popoversCancelLabel: t('global.components.interactions.inputs.AvRichTextEditor.cancel'),
    popoversConfirmLabel: t('global.components.interactions.inputs.AvRichTextEditor.confirm'),
  }
})
</script>

<template>
  <div class="av-col av-gap-xxs">
    <AvRichTextEditor
      v-bind="avRichTextEditorProps"
      v-model="content"
      v-model:char-count="charCount"
    >
      <template #maxLengthCaption="{ currentValue }">
        <span
          v-if="maxlength"
          class="b2-regular"
          :class="{
            'av-text-text1': (currentValue ?? 0) <= maxlength,
            'av-text-error': (currentValue ?? 0) > maxlength,
          }"
        >
          {{ t('global.components.interactions.inputs.AvRichTextEditor.maxLengthCaption', { count: currentValue, maxlength }) }}
        </span>
      </template>
    </AvRichTextEditor>
    <AvMessage
      v-if="errorMessages.length > 0"
      :message="errorMessages"
      type="error"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep() {
  .ProseMirror {
    cursor: text;
  }
}
</style>
