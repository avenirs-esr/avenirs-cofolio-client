<script setup lang="ts">
import type { RadioProps } from './types'
import { computeSizeClass, DSFR } from '@/utils'
import { computed } from 'vue'

const props = withDefaults(defineProps<RadioProps>(), {
  id: '',
  size: 'md',
  label: '',
  name: undefined,
  disabled: false,
  hint: undefined,
  rich: false,
})

const { id, size, label, name, disabled, hint, rich } = props

const sizeClass = computed(() => computeSizeClass(size, DSFR.RADIO_GROUP_PREFIX))
const richClass = computed(() => (rich ? `${DSFR.RADIO_PREFIX}-rich` : undefined))
</script>

<template>
  <div
    class="fr-radio-group"
    :class="[sizeClass, richClass]"
  >
    <input
      :id="id"
      :name="name"
      type="radio"
      :disabled="disabled"
      :aria-describedby="`${id}-messages`"
    >
    <label
      class="fr-label"
      :for="id"
    >
      {{ label }} <span
        v-if="hint"
        class="fr-hint-text"
      >{{ hint }}</span>
    </label>
  </div>
</template>

<style lang="scss" scoped></style>
