import { EFileType, type TraceDetailDTO } from '@/api/avenir-esr'
import UpdateStep from '@/features/student/views/StudentTraceView/components/UpdateTraceModal/UpdateStep.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an update step', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateStep>>

  const mockedTrace: TraceDetailDTO = {
    id: 'mock-trace',
    title: 'An awesome trace',
    isAssociated: true,
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

  const stubs = {
    AvTab: {
      name: 'AvTab',
      props: ['title'],
      template: '<div class="av-tab"><slot /></div>'
    },
    AvTabs: {
      name: 'AvTabs',
      props: ['compact'],
      template: '<div class="av-tabs"><slot /></div>'
    }
  }

  beforeEach(async () => {
    wrapper = mount(UpdateStep, { props: { trace: mockedTrace }, global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the tab switcher', () => {
      expect(wrapper.findComponent({ name: 'AvTabs' }).exists()).toBe(true)
    })

    BddTest().then('it should render two tabs', () => {
      expect(wrapper.findAllComponents({ name: 'AvTab' })).toHaveLength(2)
    })
  })
})
