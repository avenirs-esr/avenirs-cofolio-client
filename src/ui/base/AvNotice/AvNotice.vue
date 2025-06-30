<script setup lang="ts">
import { formatTextToUnderlineHtml } from '@/common/utils/string/string'
import { DsfrNotice } from '@gouvminint/vue-dsfr'

/**
 * Props du composant AvNotice.
 */
interface AvNoticeProps {
  /**
   * Le titre du bandeau.
   * @default ''
   */
  title?: string

  /**
   * Le texte du bandeau. Toute partie de texte entourée de ** sera soulignée.
   * @default ''
   */
  text?: string

  /**
   * Le type de bandeau.
   * Peut être 'info', 'warning' ou 'alert'.
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
