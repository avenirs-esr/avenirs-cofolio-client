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
      <div class="av-row av-row--middle av-row--between av-flex-row-sm">
        <AvInput v-model="data.title" />
      </div>
    </template>

    <AvInput
      v-model="data.content"
      is-textarea
      row="4"
      @mousedown.stop
      @touchstart.stop
      @wheel.stop
    />
  </NodeTemplate>
</template>
