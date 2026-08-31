import type { UpdateTraceForm as UpdateTraceFormApi } from '@/features/traces/types/forms.types'
import { mockedTraceAssociations } from '@/__mocks__/fixtures/student'
import { EFileType, ETraceAuthorType, type TraceDetailDTO } from '@/api/avenir-esr'
import UpdateTabs from '@/features/traces/views/StudentUpdateTraceView/components/UpdateTabs/UpdateTabs.vue'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const mockHideUpdateTraceModal = vi.fn()

const routeQueryValue = ref('details')

vi.mock('@vueuse/router', () => ({
  useRouteQuery: (_queryName: string, defaultValue: string) => {
    if (routeQueryValue.value === undefined) {
      routeQueryValue.value = defaultValue
    }
    return routeQueryValue
  },
}))

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useTracesStore: vi.fn(() => ({
      hideUpdateTraceModal: mockHideUpdateTraceModal
    }))
  }
})

BddTest().given('an update tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateTabs>>
  const mockForm = {} as UpdateTraceFormApi

  const mockedTrace: TraceDetailDTO = {
    id: 'mock-trace',
    title: 'An awesome trace',
    link: 'https://example.com',
    isAssociated: true,
    valorized: false,
    createdAt: '2025-06-01T10:42:00.000Z',
    updatedAt: '2025-06-02T11:42:00.000Z',
    aiUseJustification: 'An awesome justification',
    authorType: ETraceAuthorType.PERSONAL,
    personalNote: 'An awesome personal note',
    attachment: {
      id: 'mock-attachment',
      fileName: 'An awesome attachment',
      fileType: EFileType.TXT,
      fileSize: 1,
      url: 'exemple.com/image',
      uploadedAt: '2025-06-02T11:42:00.000Z',
    }
  }

  const stubs = {
    AvTab: AvTabStub,
    AvTabs: AvTabsStub,
    UpdateTraceForm: {
      name: 'UpdateTraceForm',
      props: ['trace', 'form'],
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
    wrapper = mount(UpdateTabs, { props: { trace: mockedTrace, associations: mockedTraceAssociations, form: mockForm }, global: { stubs } })
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

    BddTest().then('it should pass form prop to UpdateTraceForm', () => {
      const updateTraceForm = wrapper.findComponent({ name: 'UpdateTraceForm' })
      expect(updateTraceForm.props('form')).toEqual(mockForm)
    })

    BddTest().then('it should initialize activeTab to 0', () => {
      const avTabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(avTabs.props('modelValue')).toBe(0)
    })
  })

  BddTest().when('accessing i18n translations', () => {
    BddTest().then('it should use correct translation keys for tabs', () => {
      const tabs = wrapper.findAllComponents({ name: 'AvTab' })

      expect(tabs[0].props('title')).toBe('Ma trace')
      expect(tabs[1].props('title')).toBe('Mes éléments associés (5)')
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

    BddTest().then('it should disable lazy rendering on tabs', () => {
      const avTabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(avTabs.props('lazyRender')).toBe(false)
    })
  })
})
