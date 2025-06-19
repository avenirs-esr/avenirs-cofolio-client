<script setup lang="ts">
import { formatTextToUnderlineHtml } from '@/common/utils/string/string'
import { DsfrNotice } from '@gouvminint/vue-dsfr'

const {
  title = '',
  text = '',
  type
} = defineProps<{
  title?: string
  text?: string
  type: 'info' | 'warning' | 'alert'
}>()

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
