<script setup lang="ts">
import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'
import { EAssociationContextType } from '@/api/avenir-esr'
import { Drawer } from '@/common/components'
import { DeclaredSkillDetails } from '@/features/student/declaredSkills'
import DeclaredExperienceDetails from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetails/DeclaredExperienceDetails.vue'
import { StudentTraceDetails } from '@/features/student/traces'
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
    case EAssociationContextType.DECLARED_EXPERIENCE:
      return {
        component: DeclaredExperienceDetails,
        props: {
          declaredExperienceDetails: feedbackAssociatedElement.data,
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

const title = computed<string>(() => {
  switch (feedbackAssociatedElement.type) {
    case EAssociationContextType.TRACE:
      return t('staff.feedbacks.views.FeedbacksView.AssociatedElementDetailsDrawer.traceTitle', { traceTitle: feedbackAssociatedElement.data.title })
    case EAssociationContextType.DECLARED_SKILL:
      return t('staff.feedbacks.views.FeedbacksView.AssociatedElementDetailsDrawer.declaredSkillTitle', { declaredSkillTitle: feedbackAssociatedElement.data.title })
    case EAssociationContextType.DECLARED_EXPERIENCE:
      return t('staff.feedbacks.views.FeedbacksView.AssociatedElementDetailsDrawer.declaredExperienceTitle', { declaredExperienceTitle: feedbackAssociatedElement.data.title })
    default:
      return ''
  }
})

const show = computed(() => currentComponentDefinition.value.component !== 'div')

function handleClose () {
  emit('close')
}
</script>

<template>
  <Drawer
    :show="show"
    :aria-label="t('staff.feedbacks.views.FeedbacksView.AssociatedElementDetailsDrawer.drawerLabel')"
    :confirm-cancel-props="{ cancelLabel: t('global.buttons.exit') }"
    close-on-click-outside
    @close="handleClose"
  >
    <div class="av-col av-gap-md">
      <span
        class="n6 av-text-text1 av-wrap-anywhere"
        data-testid="associated-element-details-drawer-title"
      >
        {{ title }}
      </span>

      <component
        :is="currentComponentDefinition.component"
        v-bind="currentComponentDefinition.props"
      />
    </div>
  </Drawer>
</template>
