import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'
import { createMockedDeclaredSkillAssociations } from '@/__mocks__/fixtures/student/declaredSkills.fixtures'
import { mockedTraceDetailedWithFile } from '@/__mocks__/fixtures/student/traces.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import AssociatedElementDetailsDrawer from '@/features/staff/feedbacks/views/FeedbacksView/components/drawers/AssociatedElementDetailsDrawer/AssociatedElementDetailsDrawer.vue'
import { StudentTraceDetailsStub } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentTraceDetails/StudentTraceDetails.stub'
import { AvCancelConfirmButtonsStub, AvDrawerStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const mockedFeedbackTrace: FeedbackAssociatedElement = {
  type: EAssociationContextType.TRACE,
  data: mockedTraceDetailedWithFile,
}

const mockedFeedbackDeclaredSkill: FeedbackAssociatedElement = {
  type: EAssociationContextType.DECLARED_SKILL,
  data: createMockedDeclaredSkillAssociations(1)[0].declaredSkill,
}

const stubs = {
  AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
  AvDrawer: AvDrawerStub,
  AvIconText: AvIconTextStub,
  StudentTraceDetails: StudentTraceDetailsStub,
}

BddTest().given('an AssociatedElementDetailsDrawer component', () => {
  let wrapper: ReturnType<typeof mountComponent>

  BddTest().when('a trace is selected', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssociatedElementDetailsDrawer, {
        props: {
          feedbackAssociatedElement: mockedFeedbackTrace,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should display the drawer', () => {
      const drawer = wrapper.findComponent(AvDrawerStub)

      expect(drawer.exists()).toBe(true)
      expect(drawer.props('show')).toBe(true)
    })

    BddTest().then('it should display the trace title', () => {
      const title = wrapper.findComponent(AvIconTextStub)

      expect(title.props('text')).toBe(`Détails de la trace: ${mockedFeedbackTrace.data.title}`)
    })

    BddTest().then('it should render StudentTraceDetails with drawer-specific props', () => {
      const details = wrapper.findComponent(StudentTraceDetailsStub)

      expect(details.exists()).toBe(true)
      expect(details.props('trace')).toEqual(mockedFeedbackTrace.data)
      expect(details.props('hideValorizedBadge')).toBe(true)
      expect(details.props('disableRowLayout')).toBe(true)
    })

    BddTest().then('it should emit close when escape is pressed', async () => {
      await wrapper.findComponent(AvDrawerStub).vm.$emit('escape-pressed')

      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    BddTest().then('it should emit close when the cancel button is clicked', async () => {
      await wrapper.findComponent(AvCancelConfirmButtonsStub).vm.$emit('cancel')

      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  BddTest().when('a declared skill is selected', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssociatedElementDetailsDrawer, {
        props: {
          feedbackAssociatedElement: mockedFeedbackDeclaredSkill,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should keep the drawer hidden', () => {
      expect(wrapper.findComponent(AvDrawerStub).props('show')).toBe(false)
    })

    BddTest().then('it should not render StudentTraceDetails', () => {
      expect(wrapper.findComponent(StudentTraceDetailsStub).exists()).toBe(false)
    })
  })
})
