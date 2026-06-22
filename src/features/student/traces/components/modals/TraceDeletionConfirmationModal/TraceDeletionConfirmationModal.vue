<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import { getLockedDeclaredActivities, type TraceLockedDeclaredActivitiesDTO } from '@/api/avenir-esr'
import { ConfirmationModal } from '@/common/components'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ICONS } from '@/common/constants'
import { useDeleteTraceMutation } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQuery } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

const { traceIds, title, show, onConfirmDelete, onClose } = defineProps<{
  traceIds: string[]
  title: string
  show: boolean
  onConfirmDelete: () => void
  onClose: () => void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()

const tracesCount = computed(() => traceIds.length)

const {
  data: traces,
  error,
  isFetching
} = useQuery<TraceLockedDeclaredActivitiesDTO[], BaseApiException>({
  queryKey: computed(() => [
    'locked-declared-activities',
    traceIds
  ]),
  queryFn: () => getLockedDeclaredActivities(traceIds),
  enabled: computed(() => show && tracesCount.value > 0)
})

const traceDeletionData = computed(() => traces.value ?? [])

const tracesWithLockedDeclaredActivities = computed(() =>
  traceDeletionData.value.filter(trace => trace.lockedDeclaredActivities.length > 0)
)

const hasLockedDeclaredActivities = computed(() =>
  tracesWithLockedDeclaredActivities.value.length > 0
)

const lockedActivityIds = computed(() =>
  new Set(
    tracesWithLockedDeclaredActivities.value.flatMap(trace =>
      trace.lockedDeclaredActivities
        .map(activity => activity.activityId)
        .filter(Boolean)
    )
  )
)

const lockedActivitiesCount = computed(() => lockedActivityIds.value.size)

const activeAccordion = ref<number>()

watch(
  tracesWithLockedDeclaredActivities,
  (lockedTraces) => {
    activeAccordion.value = lockedTraces.length === 1 ? 0 : undefined
  },
  { immediate: true }
)

function onDeleteTraceError (error: BaseApiException) {
  addErrorMessage({
    title: t('student.traces.modals.TraceDeletionConfirmationModal.onDelete.error', tracesCount.value),
    description: getErrorMessage(error)
  })
}

function onDeleteTraceSuccess () {
  addSuccessMessage(t('student.traces.modals.TraceDeletionConfirmationModal.onDelete.success', tracesCount.value))
  onConfirmDelete()
}

const deleteTraceMutation = useDeleteTraceMutation({
  onError: onDeleteTraceError,
  onSuccess: onDeleteTraceSuccess
})

function onConfirmDeleteTrace () {
  deleteTraceMutation.mutate({ tracesIds: traceIds })
}
</script>

<template>
  <QuerySuspense
    :is-loading="isFetching"
    :error="error"
    :error-title="t('student.traces.modals.TraceDeletionConfirmationModal.onFetchAssociations.error', tracesCount)"
  >
    <ConfirmationModal
      data-testid="trace-deletion-confirmation-modal"
      :show="show"
      :confirm-button-icon="MDI_ICONS.ARROW_RIGHT"
      :is-loading="deleteTraceMutation.isPending.value"
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
        <span
          class="b2-bold av-text-text2"
          data-testid="trace-deletion-confirmation-modal-description"
        >
          {{ t('student.traces.modals.TraceDeletionConfirmationModal.description') }}
        </span>

        <span
          class="b2-light av-text-text2"
          data-testid="trace-deletion-confirmation-modal-subdescription"
        >
          {{ t('student.traces.modals.TraceDeletionConfirmationModal.subdescription') }}
        </span>

        <div
          v-if="hasLockedDeclaredActivities"
          class="av-col av-gap-xs"
        >
          <span class="b2-bold av-text-text2">
            {{ t('student.traces.modals.TraceDeletionConfirmationModal.lockedActivityTitleFirstPart', tracesWithLockedDeclaredActivities.length) }}
            {{ t('student.traces.modals.TraceDeletionConfirmationModal.lockedActivityTitleSecondPart', lockedActivitiesCount) }}
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
  </QuerySuspense>
</template>
