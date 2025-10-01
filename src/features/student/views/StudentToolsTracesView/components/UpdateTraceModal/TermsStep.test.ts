import { ETraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import TermsStep from '@/features/student/views/StudentToolsTracesView/components/UpdateTraceModal/TermsStep.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a terms step', () => {
  let wrapper: VueWrapper<InstanceType<typeof TermsStep>>

  const mockedTrace: TraceViewDTO = {
    id: 'mock-trace',
    title: 'An awesome trace',
    status: ETraceStatus.ASSOCIATED,
    createdAt: `2025-06-01T10:42:00.000Z`,
    updatedAt: `2025-06-02T11:42:00.000Z`,
    willBeDeletedAt: `2026-07-03T10:42:00.000Z`
  }

  beforeEach(async () => {
    wrapper = mount(TermsStep, { props: { trace: mockedTrace } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the placeholder', () => {
      expect(wrapper.text()).toBe('Placeholder...')
    })
  })
})
