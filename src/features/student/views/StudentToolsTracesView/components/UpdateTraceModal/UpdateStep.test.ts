import { ETraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import UpdateStep from '@/features/student/views/StudentToolsTracesView/components/UpdateTraceModal/UpdateStep.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an update step', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateStep>>

  const mockedTrace: TraceViewDTO = {
    id: 'mock-trace',
    title: 'An awesome trace',
    status: ETraceStatus.ASSOCIATED,
    createdAt: `2025-06-01T10:42:00.000Z`,
    updatedAt: `2025-06-02T11:42:00.000Z`,
    willBeDeletedAt: `2026-07-03T10:42:00.000Z`
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
