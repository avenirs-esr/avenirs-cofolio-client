<script lang="ts" setup>
import DeleteTraceAssociationOverlay
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/DeleteTraceAssociationOverlay/DeleteTraceAssociationOverlay.vue'
import { AvCard } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelectedAssociateTracesContainerProps {
  traces: {
    id: string
    title: string
  }[]
}

defineProps<SelectedAssociateTracesContainerProps>()

defineEmits<{
  (e: 'delete', traceId: string): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="av-h-full av-col av-gap-md">
    <span class="av-label b2-light">
      {{ t('student.buildProject.activities.views.ProjectActivityDetailedView.SelectedAssociateTracesContainer.label', { count: traces.length }) }}
    </span>

    <AvCard
      class="av-flex-fill"
      title-background="var(--card2)"
      background-color="var(--surface-background)"
      border-color="transparent"
    >
      <div class="selected-associate-traces-container__list av-h-full av-col av-gap-sm">
        <DeleteTraceAssociationOverlay
          v-for="trace in traces"
          :key="trace.id"
          :trace="trace"
          class="av-w-full"
          @delete="$emit('delete', trace.id)"
        />
      </div>
    </AvCard>
  </div>
</template>

<style lang="scss" scoped>
.selected-associate-traces-container__list {
  overflow-y: auto;
}
</style>
