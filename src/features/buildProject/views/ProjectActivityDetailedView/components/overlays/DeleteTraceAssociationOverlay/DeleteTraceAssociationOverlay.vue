<script setup lang="ts">
import type { IdTitle } from '@/types'
import DeleteOverlay from '@/features/global/components/interaction/DeleteOverlay/DeleteOverlay.vue'
import { TraceCompactCard } from '@/features/traces'

export interface DeleteTraceAssociationOverlayProps {
  trace: IdTitle
}

const { trace } = defineProps<DeleteTraceAssociationOverlayProps>()

defineEmits<{
  (e: 'delete', traceId: string): void
}>()
</script>

<template>
  <DeleteOverlay @delete="$emit('delete', trace.id)">
    <TraceCompactCard
      :trace="trace"
      class="av-w-full"
    />
  </DeleteOverlay>
</template>
