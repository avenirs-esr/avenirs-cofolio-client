import type { UpdateTraceForm as UpdateTraceFormApi } from '@/features/student/traces/types/forms.types'
import { createMockedDeclaredExperienceAssociations, mockedTraceAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import { type AssociationsDTO, EAssociationContextType, EFileType, ETraceAuthorType, type TraceDetailDTO } from '@/api/avenir-esr'
import { ElementAssociationsStub } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.stub'
import UpdateTabs from '@/features/student/traces/views/StudentUpdateTraceView/components/UpdateTabs/UpdateTabs.vue'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const mockCloseUpdateTraceModal = vi.fn()

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
      closeUpdateTraceModal: mockCloseUpdateTraceModal
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
    ElementAssociations: ElementAssociationsStub
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

  BddTest().when('the associations include declared experience associations', () => {
    const associationsWithExperiences: AssociationsDTO = {
      ...mockedTraceAssociations,
      declaredExperienceAssociations: createMockedDeclaredExperienceAssociations(2)
    }

    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(UpdateTabs, { props: { trace: mockedTrace, associations: associationsWithExperiences, form: mockForm }, global: { stubs } })
    })

    BddTest().then('it should include declared experience associations in the associations tab count', () => {
      const tabs = wrapper.findAllComponents({ name: 'AvTab' })
      expect(tabs[1].props('title')).toBe('Mes éléments associés (7)')
    })
  })

  BddTest().when('the associations are not provided', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(UpdateTabs, { props: { trace: mockedTrace, form: mockForm }, global: { stubs } })
    })

    BddTest().then('it should display a zero associations count in the associations tab title', () => {
      const tabs = wrapper.findAllComponents({ name: 'AvTab' })
      expect(tabs[1].props('title')).toBe('Mes éléments associés (0)')
    })

    BddTest().then('it should pass undefined associations to ElementAssociations', () => {
      const elementAssociations = wrapper.findComponent(ElementAssociationsStub)
      expect(elementAssociations.exists()).toBe(true)
      expect(elementAssociations.props('associations')).toBeUndefined()
    })
  })

  BddTest().when('rendering the associations tab', () => {
    BddTest().then('it should render ElementAssociations component', () => {
      const elementAssociations = wrapper.findComponent(ElementAssociationsStub)
      expect(elementAssociations.exists()).toBe(true)
    })

    BddTest().then('it should pass the trace context type to ElementAssociations', () => {
      const elementAssociations = wrapper.findComponent(ElementAssociationsStub)
      expect(elementAssociations.props('contextType')).toBe(EAssociationContextType.TRACE)
    })

    BddTest().then('it should pass associations prop to ElementAssociations', () => {
      const elementAssociations = wrapper.findComponent(ElementAssociationsStub)
      expect(elementAssociations.props('associations')).toEqual(mockedTraceAssociations)
    })

    BddTest().then('it should pass the trace id as elementId to ElementAssociations', () => {
      const elementAssociations = wrapper.findComponent(ElementAssociationsStub)
      expect(elementAssociations.props('elementId')).toEqual(mockedTrace.id)
    })

    BddTest().then('it should render ElementAssociations as readonly', () => {
      const elementAssociations = wrapper.findComponent(ElementAssociationsStub)
      expect(elementAssociations.props('readonly')).toBe(true)
    })

    BddTest().then('it should disable lazy rendering on tabs', () => {
      const avTabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(avTabs.props('lazyRender')).toBe(false)
    })
  })
})
