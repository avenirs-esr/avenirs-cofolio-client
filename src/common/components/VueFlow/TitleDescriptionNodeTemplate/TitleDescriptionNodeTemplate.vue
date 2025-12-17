<script setup lang="ts">
import NodeTemplate, { type NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'

const { titleBackground = 'var(--other-background-base)', ...restProps } = defineProps<NodeTemplateProps>()
</script>

<template>
  <NodeTemplate
    v-bind="restProps"
    :title-background="titleBackground"
  >
    <template #title>
      <span class="b2-bold">{{ data.title }}</span>
    </template>

    <span class="caption-regular">{{ data.description }}</span>

    <slot />
  </NodeTemplate>
</template>
