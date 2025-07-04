<script setup lang="ts">
import { formatTextToUnderlineHtml } from '@/ui/utils/string/string'
import { DsfrNotice } from '@gouvminint/vue-dsfr'

/**
 * AvNotice component props.
 */
interface AvNoticeProps {
  /**
   * The banner title.
   * @default ''
   */
  title?: string

  /**
   * The banner text. Any text surrounded by a ** will be underlined.
   * @default ''
   */
  text?: string

  /**
   * The banner type.
   * Can be 'info', 'warning', or 'alert'.
   */
  type: 'info' | 'warning' | 'alert'
}

const { title = '', text = '', type } = defineProps<AvNoticeProps>()

const formattedDesc = computed(() => {
  return formatTextToUnderlineHtml(text)
})
</script>

<template>
  <DsfrNotice
    :title="title"
    :type="type"
  >
    <template #desc>
      <span v-html="formattedDesc" />
    </template>
  </DsfrNotice>
</template>

<style lang="scss">
.text-underline {
  text-decoration: underline;
}
</style>
