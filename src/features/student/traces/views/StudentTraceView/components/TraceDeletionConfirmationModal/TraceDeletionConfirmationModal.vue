<script lang="ts" setup>
import type { TraceLockedDeclaredActivitiesDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { ConfirmationModal } from '@/common/components'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ICONS } from '@/common/constants'
import { useDeleteTraceMutation } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useToasterStore } from '@/store'
import {
  AvAccordion,
  AvAccordionsGroup,
  AvIconText,
  MDI_ICONS
} from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { traces, title, show, onConfirmDelete, onClose } = defineProps<{
  traces: TraceLockedDeclaredActivitiesDTO[]
  title: string
  show: boolean
  onConfirmDelete: () => void
  onClose: () => void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage } = useToasterStore()

const traceIds = computed(() => traces.map(trace => trace.traceId))

const tracesWithLockedDeclaredActivities = computed(() =>
  traces.filter(trace => trace.lockedDeclaredActivities.length > 0)
)

const hasLockedDeclaredActivities = computed(() =>
  tracesWithLockedDeclaredActivities.value.length > 0
)

const activeAccordion = ref<number>()

watch(
  tracesWithLockedDeclaredActivities,
  (lockedTraces) => {
    activeAccordion.value = lockedTraces.length === 1 ? 0 : undefined
  },
  { immediate: true }
)

const { onConfirmDeleteTrace, isDeleteTracePending } = useDeleteTrace()

function useDeleteTrace () {
  function onDeleteTraceError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.traces.views.StudentTraceView.errors.delete'),
      description: getErrorMessage(error)
    })
  }

  const deleteTraceMutation = useDeleteTraceMutation({
    onError: onDeleteTraceError,
    onSuccess: onConfirmDelete
  })

  function onConfirmDeleteTrace () {
    deleteTraceMutation.mutate({ tracesIds: traceIds.value })
  }

  return {
    onConfirmDeleteTrace,
    isDeleteTracePending: deleteTraceMutation.isPending,
  }
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    :confirm-button-icon="MDI_ICONS.ARROW_RIGHT"
    :is-loading="isDeleteTracePending"
    @close="onClose"
    @confirm="onConfirmDeleteTrace"
  >
    <template #header>
      <AvIconText
        :icon="MDI_ICONS.ATTACH_FILE"
        icon-color="var(--icon)"
        :text="title"
        typography-class="n6"
      />
    </template>

    <div class="av-col av-gap-sm">
      <span class="b2-bold av-text-text2">
        {{ t('student.traces.views.StudentTraceView.traceDeletionConfirmationModal.description') }}
      </span>

      <span class="b2-light av-text-text2">
        {{ t('student.traces.views.StudentTraceView.traceDeletionConfirmationModal.subdescription') }}
      </span>

      <div
        v-if="hasLockedDeclaredActivities"
        class="av-col av-gap-xs"
      >
        <span class="b2-bold av-text-text2">
          {{ t('student.traces.views.StudentTraceView.traceDeletionConfirmationModal.lockedActivitiesTitle') }}
        </span>

        <AvAccordionsGroup v-model:active-accordion="activeAccordion">
          <AvAccordion
            v-for="trace in tracesWithLockedDeclaredActivities"
            :id="trace.traceId"
            :key="trace.traceId"
            :title="trace.traceTitle"
            :icon="ICONS.TRACES"
          >
            <ul class="locked-activities-list">
              <li
                v-for="activity in trace.lockedDeclaredActivities"
                :key="activity.activityId"
                class="b2-light av-text-text2"
              >
                {{ activity.activityTitle }}
              </li>
            </ul>
          </AvAccordion>
        </AvAccordionsGroup>
      </div>
    </div>
  </ConfirmationModal>
</template>
