<script setup lang="ts">
import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import { DeclaredSkillDetails } from '@/features/student/declaredSkills'
import { StudentTraceDetails } from '@/features/student/traces'
import { AvCancelConfirmButtons, AvDrawer, AvIconText, type AvIconTextProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociatedElementDetailsDrawerProps {
  feedbackAssociatedElement: FeedbackAssociatedElement
}

const { feedbackAssociatedElement } = defineProps<AssociatedElementDetailsDrawerProps>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { t } = useI18n()

const detailsDisplayProps = {
  hideValorizedBadge: true,
  disableRowLayout: true,
}

const currentComponentDefinition = computed(() => {
  switch (feedbackAssociatedElement.type) {
    case EAssociationContextType.TRACE:
      return {
        component: StudentTraceDetails,
        props: {
          trace: feedbackAssociatedElement.data,
          ...detailsDisplayProps,
        },
      }
    case EAssociationContextType.DECLARED_SKILL:
      return {
        component: DeclaredSkillDetails,
        props: {
          declaredSkillProgressDetails: feedbackAssociatedElement.data,
          ...detailsDisplayProps
        },
      }
    default:
      return {
        component: 'div',
        props: {},
      }
  }
})

const titleTextAndIcon = computed<Pick<AvIconTextProps, 'text' | 'icon'>>(() => {
  switch (feedbackAssociatedElement.type) {
    case EAssociationContextType.TRACE:
      return {
        text: t('staff.feedbacks.views.FeedbacksView.AssociatedElementDetailsDrawer.traceTitle', { traceTitle: feedbackAssociatedElement.data.title }),
        icon: ICONS.TRACES,
      }
    case EAssociationContextType.DECLARED_SKILL:
      return {
        text: t('staff.feedbacks.views.FeedbacksView.AssociatedElementDetailsDrawer.declaredSkillTitle', { declaredSkillTitle: feedbackAssociatedElement.data.title }),
        icon: ICONS.SKILLS,
      }
    default:
      return { text: '', icon: MDI_ICONS.INFORMATION_OUTLINE }
  }
})

const show = computed(() => currentComponentDefinition.value.component !== 'div')

function handleClose () {
  emit('close')
}
</script>

<template>
  <AvDrawer
    :show="show"
    position="right"
    width="40rem"
    :aria-label="t('staff.feedbacks.views.FeedbacksView.AssociatedElementDetailsDrawer.drawerLabel')"
    @escape-pressed="handleClose"
  >
    <div class="av-col av-gap-md">
      <AvIconText
        icon-color="var(--text2)"
        text-color="var(--text1)"
        typography-class="n6"
        v-bind="titleTextAndIcon"
        wrap-anywhere
      />

      <component
        :is="currentComponentDefinition.component"
        v-bind="currentComponentDefinition.props"
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
