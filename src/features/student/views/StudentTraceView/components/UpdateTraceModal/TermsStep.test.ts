import { EFileType, ETraceStatus, type TraceDetailDTO } from '@/api/avenir-esr'
import TermsStep from '@/features/student/views/StudentTraceView/components/UpdateTraceModal/TermsStep.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a terms step', () => {
  let wrapper: VueWrapper<InstanceType<typeof TermsStep>>

  const mockedTrace: TraceDetailDTO = {
    id: 'mock-trace',
    title: 'An awesome trace',
    status: ETraceStatus.ASSOCIATED,
    createdAt: '2025-06-01T10:42:00.000Z',
    updatedAt: '2025-06-02T11:42:00.000Z',
    programName: 'An awesome program',
    aiUseJustification: 'An awesome justification',
    isGroup: false,
    personalNote: 'An awesome personal note',
    attachment: {
      id: 'mock-attachment',
      fileName: 'An awesome attachment',
      fileType: EFileType.TXT,
      fileSize: 1,
      version: 1,
      uploadedAt: '2025-06-02T11:42:00.000Z',
    }
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
