<script setup lang="ts">
import TraceCompactCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/TraceCompactCard/TraceCompactCard.vue'
import DeleteOverlay from '@/features/student/global/components/interaction/DeleteOverlay/DeleteOverlay.vue'

export interface DeleteTraceAssociationOverlayProps {
  trace: {
    id: string
    title: string
  }
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
