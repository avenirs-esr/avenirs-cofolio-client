<script setup lang="ts">
import { Handle, type NodeProps, Position } from '@vue-flow/core'

export interface HandlesProps {
  data: NodeProps['data']
}

defineProps<HandlesProps>()

const handles = Object.values(Position)
</script>

<template>
  <div>
    <Handle
      v-for="handle in handles"
      :id="handle"
      :key="handle"
      :position="handle"
      :connectable="data[handle] === true"
      :style="{ opacity: data[handle] === true ? 1 : 0 }"
    />
  </div>
</template>
