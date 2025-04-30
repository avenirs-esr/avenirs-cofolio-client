<script setup lang="ts">
import type { MessageProps } from './types'
import { DSFR } from '@/utils'

const props = withDefaults(defineProps<MessageProps>(), {
  status: undefined,
  error: undefined,
  warning: undefined,
  info: undefined,
  valid: undefined,
  idParent: '',
})
const { status, error, warning, info, valid, idParent } = props

const messageMap = {
  error,
  warning,
  info,
  valid,
}
</script>

<template>
  <p
    v-if="status && !!messageMap[status]"
    :id="`${idParent}-message-${status}`"
    class="fr-message"
    :class="[`${DSFR.MESSAGE_PREFIX}--${status}`]"
  >
    {{ messageMap[status] }}
  </p>
</template>

<style lang="scss" scoped></style>
