<script setup lang="ts">
import { AvMessage, AvRichTextEditor, type AvRichTextEditorProps } from '@avenirs-esr/avenirs-dsav'
import { type ComputedRef, useAttrs } from 'vue'
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
    editorLabel: t('global.AvRichTextEditor.editor'),
    toolbarLabel: t('global.AvRichTextEditor.toolbar'),
    undoLabel: t('global.AvRichTextEditor.undo'),
    redoLabel: t('global.AvRichTextEditor.redo'),
    paragraphLabel: t('global.AvRichTextEditor.paragraph'),
    headingLabel: t('global.AvRichTextEditor.heading'),
    boldLabel: t('global.AvRichTextEditor.bold'),
    italicLabel: t('global.AvRichTextEditor.italic'),
    underlineLabel: t('global.AvRichTextEditor.underline'),
    linkLabel: t('global.AvRichTextEditor.link'),
    linkNameLabel: t('global.AvRichTextEditor.linkName'),
    linkNamePlaceholder: t('global.AvRichTextEditor.linkNamePlaceholder'),
    linkUrlLabel: t('global.AvRichTextEditor.linkUrl'),
    unsetLinkLabel: t('global.AvRichTextEditor.unsetLink'),
    imageLabel: t('global.AvRichTextEditor.image'),
    imageNameLabel: t('global.AvRichTextEditor.imageName'),
    imageNamePlaceholder: t('global.AvRichTextEditor.imageNamePlaceholder'),
    imageUrlLabel: t('global.AvRichTextEditor.imageUrl'),
    removeImageLabel: t('global.AvRichTextEditor.removeImage'),
    insertTableLabel: t('global.AvRichTextEditor.insertTable'),
    tableSettingsLabel: t('global.AvRichTextEditor.tableSettings'),
    deleteTableLabel: t('global.AvRichTextEditor.deleteTable'),
    addColumnBeforeLabel: t('global.AvRichTextEditor.addColumnBefore'),
    addColumnAfterLabel: t('global.AvRichTextEditor.addColumnAfter'),
    deleteColumnLabel: t('global.AvRichTextEditor.deleteColumn'),
    addRowBeforeLabel: t('global.AvRichTextEditor.addRowBefore'),
    addRowAfterLabel: t('global.AvRichTextEditor.addRowAfter'),
    deleteRowLabel: t('global.AvRichTextEditor.deleteRow'),
    alignLeftLabel: t('global.AvRichTextEditor.alignLeft'),
    alignCenterLabel: t('global.AvRichTextEditor.alignCenter'),
    alignRightLabel: t('global.AvRichTextEditor.alignRight'),
    alignJustifyLabel: t('global.AvRichTextEditor.alignJustify'),
    bulletListLabel: t('global.AvRichTextEditor.bulletList'),
    orderedListLabel: t('global.AvRichTextEditor.orderedList'),
    decreaseIndentLabel: t('global.AvRichTextEditor.decreaseIndent'),
    increaseIndentLabel: t('global.AvRichTextEditor.increaseIndent'),
    popoversCancelLabel: t('global.buttons.cancel'),
    popoversConfirmLabel: t('global.buttons.confirm'),
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
          {{ t('global.AvRichTextEditor.maxLengthCaption', { count: currentValue, maxlength }) }}
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
