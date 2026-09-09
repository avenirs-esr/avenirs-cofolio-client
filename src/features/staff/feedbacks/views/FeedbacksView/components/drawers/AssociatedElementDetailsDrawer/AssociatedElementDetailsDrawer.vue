<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import StudentTraceDetails
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentTraceDetails/StudentTraceDetails.vue'
import { AvCancelConfirmButtons, AvDrawer, AvIconText, type AvIconTextProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociatedElementDetailsDrawerProps {
  feedbackAssociatedElement: FeedbackAssociatedElement
}

const { feedbackAssociatedElement } = defineProps<AssociatedElementDetailsDrawerProps>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const trace = computed<TraceDetailDTO | undefined>(() =>
  feedbackAssociatedElement.type === EAssociationContextType.TRACE
    ? feedbackAssociatedElement.data
    : undefined
)

const show = computed(() => !!trace.value)

const titleTextAndIcon = computed<Pick<AvIconTextProps, 'text' | 'icon'>>(() => {
  switch (true) {
    case !!trace.value:
      return {
        text: t('staff.feedbacks.views.FeedbacksView.AssociatedElementDetailsDrawer.traceTitle', { traceTitle: trace.value.title }),
        icon: ICONS.TRACES,
      }
    default:
      return { text: '', icon: MDI_ICONS.INFORMATION_OUTLINE }
  }
})

function handleClose () {
  emit('close')
}

const currentComponent = computed(() => {
  if (trace.value) {
    return {
      component: StudentTraceDetails,
      props: {
        trace: trace.value,
        hideValorizedBadge: true,
        disableRowLayout: true,
      },
    }
  }

  return {
    component: 'div',
    props: {},
  }
})
</script>

<template>
  <AvDrawer
    :show="show"
    position="right"
    width="35rem"
    :aria-label="t('staff.feedbacks.views.FeedbacksView.AssociatedElementDetailsDrawer.drawerLabel')"
    @escape-pressed="handleClose"
  >
    <div class="av-col av-gap-md">
      <AvIconText
        icon-color="var(--text2)"
        text-color="var(--text1)"
        typography-class="n6"
        v-bind="titleTextAndIcon"
      />

      <component
        :is="currentComponent.component"
        v-bind="currentComponent.props"
      />
    </div>

    <template #footer>
      <AvCancelConfirmButtons
        class="av-justify-end"
        :cancel-label="t('global.buttons.exit')"
        :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
        @cancel="handleClose"
      />
    </template>
  </AvDrawer>
</template>
