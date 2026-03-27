import { mockedTraceAssociations } from '@/__mocks__/fixtures/student'
import { EFileType, type TraceDetailDTO } from '@/api/avenir-esr'
import UpdateStep from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceModal/UpdateStep.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const mockHideUpdateTraceModal = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useTracesStore: vi.fn(() => ({
      hideUpdateTraceModal: mockHideUpdateTraceModal
    }))
  }
})

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
    },
  }

  const stubs = {
    AvTab: {
      name: 'AvTab',
      props: ['title', 'icon'],
      template: '<div class="av-tab"><slot /></div>'
    },
    AvTabs: {
      name: 'AvTabs',
      props: ['compact', 'modelValue'],
      emits: ['update:modelValue'],
      template: '<div class="av-tabs"><slot /></div>'
    },
    UpdateTraceForm: {
      name: 'UpdateTraceForm',
      props: ['trace'],
      template: '<div class="update-trace-form">Update Trace Form</div>'
    },
    TraceAssociations: {
      name: 'TraceAssociations',
      props: ['associations', 'traceId'],
      template: '<div class="trace-associations"><slot name="caption" /></div>'
    }
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    wrapper = mount(UpdateStep, { props: { trace: mockedTrace, associations: mockedTraceAssociations }, global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the tab switcher', () => {
      expect(wrapper.findComponent({ name: 'AvTabs' }).exists()).toBe(true)
    })

    BddTest().then('it should render two tabs', () => {
      expect(wrapper.findAllComponents({ name: 'AvTab' })).toHaveLength(2)
    })

    BddTest().then('it should render UpdateTraceForm component', () => {
      const updateTraceForm = wrapper.findComponent({ name: 'UpdateTraceForm' })
      expect(updateTraceForm.exists()).toBe(true)
    })

    BddTest().then('it should pass trace prop to UpdateTraceForm', () => {
      const updateTraceForm = wrapper.findComponent({ name: 'UpdateTraceForm' })
      expect(updateTraceForm.props('trace')).toEqual(mockedTrace)
    })

    BddTest().then('it should initialize activeTab to 0', () => {
      const avTabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(avTabs.props('modelValue')).toBe(0)
    })
  })

  BddTest().when('accessing i18n translations', () => {
    BddTest().then('it should use correct translation keys for tabs', () => {
      const tabs = wrapper.findAllComponents({ name: 'AvTab' })

      expect(tabs[0].props('title')).toBe('Modifier ma trace')
      expect(tabs[1].props('title')).toBe('Mes associations')
    })
  })

  BddTest().when('rendering the associations tab', () => {
    BddTest().then('it should render TraceAssociations component', () => {
      const traceAssociations = wrapper.findComponent({ name: 'TraceAssociations' })
      expect(traceAssociations.exists()).toBe(true)
    })

    BddTest().then('it should pass associations prop to TraceAssociations', () => {
      const traceAssociations = wrapper.findComponent({ name: 'TraceAssociations' })
      expect(traceAssociations.props('associations')).toEqual(mockedTraceAssociations)
    })

    BddTest().then('it should pass traceId prop to TraceAssociations', () => {
      const traceAssociations = wrapper.findComponent({ name: 'TraceAssociations' })
      expect(traceAssociations.props('traceId')).toEqual(mockedTrace.id)
    })
  })
})
