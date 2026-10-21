<script setup lang="ts">
import type { NodeTemplateProps } from '@/common/components/base/VueFlow/NodeTemplate/NodeTemplate.vue'
import { AvInput } from '@avenirs-esr/avenirs-dsav'
import NodeTemplate from '@/common/components/base/VueFlow/NodeTemplate/NodeTemplate.vue'

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
