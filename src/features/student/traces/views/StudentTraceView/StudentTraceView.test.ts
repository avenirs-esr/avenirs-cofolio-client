import { mockedTraceAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import { mockedTraceDetailed } from '@/__mocks__/fixtures/student/traces.fixtures'
import { getAssociationsErrorHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { createTraceDetailedHandler, downloadTraceAttachmentErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import { DetailedPageTitleStub } from '@/common/components/DetailedPageTitle/DetailedPageTitle.stub'
import { ErrorCodes, ROUTES } from '@/common/constants'
import { downloadBlob } from '@/common/utils/download/download'
import { ElementAssociationsStub } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.stub'
import { AssociateModalStub } from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.stub'
import { TraceDeletionConfirmationModalStub } from '@/features/student/traces/components/modals/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.stub'
import { StudentTraceDetailsStub } from '@/features/student/traces/components/StudentTraceDetails/StudentTraceDetails.stub'
import { TraceSettingsDropdownStub } from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.stub'
import StudentTraceView from '@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const route = reactive<{ name: string }>({
  name: ROUTES.STUDENT.TOOLS_TRACE.name,
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => route,
  }
})

vi.mock('@/common/utils/download/download', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/utils/download/download')>()
  return {
    ...actual,
    downloadBlob: vi.fn(),
  }
})

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

const mockNavigateToStudentTraces = vi.fn()
const mockNavigateToStudentUpdateTrace = vi.fn()
const mockNavigateToStudentToolsUpdateTrace = vi.fn()
const mockNavigateToStudentToolsKitUpdateTrace = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentTraces: mockNavigateToStudentTraces,
      navigateToStudentUpdateTrace: mockNavigateToStudentUpdateTrace,
      navigateToStudentToolsUpdateTrace: mockNavigateToStudentToolsUpdateTrace,
      navigateToStudentToolsKitUpdateTrace: mockNavigateToStudentToolsKitUpdateTrace,
    }),
  }
})

BddTest().given('a student trace view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceView>>

  const stubs = {
    DetailedPageTitle: DetailedPageTitleStub,
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    TraceSettingsDropdown: TraceSettingsDropdownStub,
    TraceDeletionConfirmationModal: TraceDeletionConfirmationModalStub,
    AssociateModal: AssociateModalStub,
    StudentTraceDetails: StudentTraceDetailsStub,
    ElementAssociations: ElementAssociationsStub,
  }

  const associationsCount
    = mockedTraceAssociations.declaredActivityAssociations.length
      + mockedTraceAssociations.declaredSkillAssociations.length
      + mockedTraceAssociations.declaredExperienceAssociations.length
      + mockedTraceAssociations.declaredProgramAssociations.length

  async function selectAssociationsTab () {
    const tabs = wrapper.findComponent({ name: 'AvTabs' })

    await tabs.vm.$emit('update:modelValue', 1)
    await flushPromises()
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const handler = createTraceDetailedHandler(mockedTraceDetailed)
    server.use(handler)
    wrapper = mountComponent(StudentTraceView, {
      props: { traceId: mockedTraceDetailed.id },
      global: { stubs },
      useTanstack: true,
      usePinia: true,
    })

    await flushPromises()
  })

  const title = mockedTraceDetailed.title

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render DetailedPageTitle with correct props', async () => {
      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('trailingLinks')).toHaveLength(1)
    })

    BddTest().then('it should render the popover', async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })
      expect(popover.exists()).toBe(true)
    })

    BddTest().then('it should render the TraceDeletionConfirmationModal initially hidden with correct props', async () => {
      const modal = wrapper.findComponent(TraceDeletionConfirmationModalStub)

      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(false)
      expect(modal.props('traceIds')).toEqual([mockedTraceDetailed.id])
      expect(modal.props('title')).toBe(mockedTraceDetailed.title)
    })

    BddTest().then('it should render AvTabs component', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(tabs.exists()).toBe(true)
    })

    BddTest().then('it should render the active trace details tab by default', () => {
      const tab = wrapper.findComponent({ name: 'AvTab' })

      expect(tab.exists()).toBe(true)
      expect(tab.props('title')).toBe('Ma trace')
    })

    BddTest().then('it should render StudentTraceDetails component in the active tab', () => {
      const traceDetails = wrapper.findComponent({ name: 'StudentTraceDetails' })

      expect(traceDetails.exists()).toBe(true)
      expect(traceDetails.props('trace')).toEqual(mockedTraceDetailed)
    })

    BddTest().then('it should render StudentTraceDetails component in the first tab', () => {
      const traceDetails = wrapper.findComponent({ name: 'StudentTraceDetails' })
      expect(traceDetails.exists()).toBe(true)
      expect(traceDetails.props('trace')).toEqual(mockedTraceDetailed)
    })

    BddTest().then('it should render the AssociateModal initially hidden', async () => {
      const modal = wrapper.findComponent(AssociateModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(false)
    })

    BddTest().then('it should configure the AssociateModal to associate declared skills to the trace', () => {
      const modal = wrapper.findComponent(AssociateModalStub)

      expect(modal.props('contextType')).toBe(EAssociationContextType.TRACE)
      expect(modal.props('elementId')).toBe(mockedTraceDetailed.id)
      expect(modal.props('associatedContextType')).toBe(EAssociationContextType.DECLARED_SKILL)
    })

    BddTest().then('it should not render ElementAssociations in the inactive associations tab', () => {
      expect(wrapper.findComponent(ElementAssociationsStub).exists()).toBe(false)
    })
  })

  BddTest().when('the view is mounted on home trace route', () => {
    beforeEach(async () => {
      route.name = ROUTES.STUDENT.TRACE.name

      const handler = createTraceDetailedHandler(mockedTraceDetailed)
      server.use(handler)
      wrapper = mountComponent(StudentTraceView, {
        props: { traceId: mockedTraceDetailed.id },
        global: { stubs },
        useTanstack: true,
        usePinia: true,
      })

      await flushPromises()
    })

    BddTest().then('it should render home breadcrumb links', () => {
      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)
      expect(pageTitle.props('trailingLinks')).toHaveLength(1)
    })
  })

  BddTest().when('TraceSettingsDropdown emits associate-selected', () => {
    beforeEach(async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })
      await popover.vm.$emit('associate')
      await flushPromises()
    })

    BddTest().then('it should open the associate modal', () => {
      const modal = wrapper.findComponent(AssociateModalStub)
      expect(modal.props('opened')).toBe(true)
    })

    BddTest().and('the associate modal emits cancel', () => {
      beforeEach(async () => {
        await wrapper.findComponent(AssociateModalStub).vm.$emit('cancel')
        await flushPromises()
      })

      BddTest().then('it should close the associate modal', () => {
        expect(wrapper.findComponent(AssociateModalStub).props('opened')).toBe(false)
      })
    })

    BddTest().and('the associate modal emits associated', () => {
      beforeEach(async () => {
        await wrapper.findComponent(AssociateModalStub).vm.$emit('associated')
        await flushPromises()
      })

      BddTest().then('it should close the associate modal', () => {
        expect(wrapper.findComponent(AssociateModalStub).props('opened')).toBe(false)
      })
    })
  })

  BddTest().when('the delete modal is triggered', () => {
    beforeEach(async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })

      await popover.vm.$emit('delete')
      await flushPromises()
    })

    BddTest().then('it should open the deletion confirmation modal with trace ids', async () => {
      const modal = wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' })

      expect(modal.props('opened')).toBe(true)
      expect(modal.props('title')).toBe(mockedTraceDetailed.title)
      expect(modal.props('traceIds')).toEqual([mockedTraceDetailed.id])
    })
  })

  BddTest().when('the update trace action is triggered', () => {
    beforeEach(async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })
      await popover.vm.$emit('update')
      await flushPromises()
    })

    BddTest().then('it should navigate to update trace page', async () => {
      await vi.waitFor(() => {
        expect(mockNavigateToStudentUpdateTrace).toHaveBeenCalledWith({
          id: mockedTraceDetailed.id,
        })
      })
    })
  })

  BddTest().when('TraceSettingsDropdown emits download', () => {
    BddTest().then('it should download the trace attachment', async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })

      await popover.vm.$emit('download')
      await flushPromises()
      const [blob, fileName] = vi.mocked(downloadBlob).mock.calls[0]
      expect(downloadBlob).toHaveBeenCalledTimes(1)
      expect(blob).toMatchObject({
        size: expect.any(Number),
        type: 'application/octet-stream',
      })
      expect(fileName).toBe(mockedTraceDetailed.attachment.fileName)
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('TraceSettingsDropdown emits download and download fails', () => {
    beforeEach(() => {
      server.use(downloadTraceAttachmentErrorHandler)
    })

    BddTest().then('it should add an error toaster message', async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })

      await popover.vm.$emit('download')
      await flushPromises()

      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith({
          title: 'Une erreur est survenue lors du téléchargement de la trace.',
          description: expect.any(String),
        })
      })

      expect(downloadBlob).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the associations tab is selected', () => {
    beforeEach(async () => {
      await selectAssociationsTab()
    })

    BddTest().then('it should render the associations tab with correct title', () => {
      const tab = wrapper.findComponent({ name: 'AvTab' })

      expect(tab.props('title')).toBe(`Mes éléments associés (${associationsCount})`)
    })

    BddTest().then('it should render ElementAssociations for the trace', () => {
      const elementAssociations = wrapper.findComponent(ElementAssociationsStub)

      expect(elementAssociations.exists()).toBe(true)
      expect(elementAssociations.props('contextType')).toBe(EAssociationContextType.TRACE)
      expect(elementAssociations.props('elementId')).toBe(mockedTraceDetailed.id)
    })

    BddTest().then('it should pass the fetched associations to ElementAssociations', () => {
      const elementAssociations = wrapper.findComponent(ElementAssociationsStub)

      expect(elementAssociations.props('associations')).toEqual(mockedTraceAssociations)
      expect(elementAssociations.props('error')).toBeNull()
    })

    BddTest().then('it should render ElementAssociations as editable', () => {
      const elementAssociations = wrapper.findComponent(ElementAssociationsStub)

      expect(elementAssociations.props('readonly')).toBe(false)
      expect(elementAssociations.props('actionsDisabled')).toBe(false)
    })
  })

  BddTest().when('the associations tab is selected and the associations request fails', () => {
    beforeEach(async () => {
      server.use(getAssociationsErrorHandler)
      wrapper = mountComponent(StudentTraceView, {
        props: { traceId: mockedTraceDetailed.id },
        global: { stubs },
      })
      await flushPromises()
      await selectAssociationsTab()
    })

    BddTest().then('it should display a zero associations count in the tab title', () => {
      const tab = wrapper.findComponent({ name: 'AvTab' })

      expect(tab.props('title')).toBe('Mes éléments associés (0)')
    })

    BddTest().then('it should pass the error to ElementAssociations', async () => {
      await vi.waitFor(() => {
        const elementAssociations = wrapper.findComponent(ElementAssociationsStub)

        expect(elementAssociations.props('error')).toEqual(expect.objectContaining({ code: ErrorCodes.SERVER }))
        expect(elementAssociations.props('associations')).toBeUndefined()
      })
    })
  })

  BddTest().when('trace deletion succeeds', () => {
    beforeEach(async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })

      await popover.vm.$emit('delete')
      await flushPromises()

      const modal = wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' })
      modal.props('onConfirmDelete')()
      await flushPromises()
    })

    BddTest().then('it should navigate back to traces list', () => {
      expect(mockNavigateToStudentTraces).toHaveBeenCalledWith({ replace: true })
    })
  })

  BddTest().when('the update trace action is triggered', () => {
    beforeEach(async () => {
      route.name = ROUTES.STUDENT.TOOLS_KIT_TRACE.name

      const popover = wrapper.findComponent(TraceSettingsDropdownStub)

      await popover.vm.$emit('update')
      await flushPromises()
    })

    BddTest().then('it should navigate to the tools kit update trace page', () => {
      expect(mockNavigateToStudentToolsKitUpdateTrace).toHaveBeenCalledWith({
        id: mockedTraceDetailed.id,
      })
    })
  })
})
