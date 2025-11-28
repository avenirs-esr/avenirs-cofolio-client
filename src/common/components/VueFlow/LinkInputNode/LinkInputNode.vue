<script setup lang="ts">
import NodeTemplate, { type NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import { AvInput } from '@avenirs-esr/avenirs-dsav'

defineProps<NodeTemplateProps>()
</script>

<template>
  <NodeTemplate
    v-bind="$props"
    collapsible
  >
    <template #title>
      <a
        :href="data.link"
        target="_blank"
      >{{ data.link }}</a>
    </template>

    <AvInput v-model="data.link" />
  </NodeTemplate>
</template>
