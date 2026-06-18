import { mockedTraceDetailed } from '@/__mocks__/fixtures/student/traces.fixtures'
import {
  createTraceDetailedHandler,
  downloadTraceAttachmentErrorHandler
} from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { DetailedPageTitleStub } from '@/common/components/DetailedPageTitle/DetailedPageTitle.stub'
import { ROUTES } from '@/common/constants'
import { downloadBlob } from '@/common/utils/download/download'
import { TraceAssociationsStub } from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.stub'
import {
  StudentTraceDetailsStub
} from '@/features/student/traces/views/StudentToolsTracesView/components/StudentTraceDetails/StudentTraceDetails.stub'
import { AssociateDeclaredSkillsToTracesModalStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredSkillsToTracesModal/AssociateDeclaredSkillsToTracesModal.stub'
import {
  TraceDeletionConfirmationModalStub
} from '@/features/student/traces/views/StudentTraceView/components/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.stub'
import {
  TraceSettingsDropdownStub
} from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.stub'
import StudentTraceView from '@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { useRoute } from 'vue-router'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

const mockedUseRoute = vi.mocked(useRoute)

vi.mock('@/common/utils/download/download', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/utils/download/download')>()
  return {
    ...actual,
    downloadBlob: vi.fn()
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

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentTraces: mockNavigateToStudentTraces,
      navigateToStudentUpdateTrace: mockNavigateToStudentUpdateTrace,
      navigateToStudentToolsUpdateTrace: mockNavigateToStudentToolsUpdateTrace,
    }),
  }
})

BddTest().given('a student trace view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceView>>
  let routeName: string

  const stubs = {
    DetailedPageTitle: DetailedPageTitleStub,
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    TraceSettingsDropdown: TraceSettingsDropdownStub,
    TraceDeletionConfirmationModal: TraceDeletionConfirmationModalStub,
    AssociateDeclaredSkillsToTracesModal: AssociateDeclaredSkillsToTracesModalStub,
    StudentTraceDetails: StudentTraceDetailsStub,
    TraceAssociations: TraceAssociationsStub
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    routeName = ROUTES.STUDENT.TOOLS_TRACE.name
    mockedUseRoute.mockReturnValue({
      get name () {
        return routeName
      }
    } as ReturnType<typeof useRoute>)

    const handler = createTraceDetailedHandler(mockedTraceDetailed)
    server.use(handler)
    wrapper = mountComponent(StudentTraceView, {
      props: { traceId: mockedTraceDetailed.id },
      global: { stubs },
      useTanstack: true,
      usePinia: true
    })

    await flushPromises()
  })

  const title = mockedTraceDetailed.title
  const breadcrumbLinks = [
    { text: 'Accueil', to: ROUTES.STUDENT.HOME },
    { text: 'Mes outils' },
    { text: 'Mes traces', to: ROUTES.STUDENT.TOOLS_TRACES },
    { text: mockedTraceDetailed.title }
  ]

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render DetailedPageTitle with correct props', async () => {
      const pageTitle = wrapper.findComponent({ name: 'DetailedPageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual(breadcrumbLinks)
    })

    BddTest().then('it should render the popover', async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })
      expect(popover.exists()).toBe(true)
    })

    BddTest().then('it should render the TraceDeletionConfirmationModal initially hidden with correct props', async () => {
      const modal = wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' })

      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
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

    BddTest().then('it should render the AssociateDeclaredSkillsToTracesModal initially hidden', async () => {
      const modal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
    })
  })

  BddTest().when('the view is mounted on default trace route', () => {
    beforeEach(async () => {
      routeName = ROUTES.STUDENT.TRACE.name

      const handler = createTraceDetailedHandler(mockedTraceDetailed)
      server.use(handler)
      wrapper = mountComponent(StudentTraceView, {
        props: { traceId: mockedTraceDetailed.id },
        global: { stubs },
        useTanstack: true,
        usePinia: true
      })

      await flushPromises()
    })

    BddTest().then('it should render home breadcrumb links', () => {
      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)

      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STUDENT.HOME },
        { text: 'Modifier' },
      ])
    })
  })

  BddTest().when('TraceSettingsDropdown emits associate-selected', () => {
    BddTest().then('it should open the associate modal', async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })
      await popover.vm.$emit('associate-selected')
      await flushPromises()

      const modal = wrapper.findComponent(AssociateDeclaredSkillsToTracesModalStub)
      expect(modal.props('show')).toBe(true)
    })
  })

  BddTest().when('the delete modal is triggered', () => {
    beforeEach(async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })

      await popover.vm.$emit('delete-selected')
      await flushPromises()
    })

    BddTest().then('it should show the deletion confirmation modal with trace ids', async () => {
      const modal = wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' })

      expect(modal.props('show')).toBe(true)
      expect(modal.props('title')).toBe(mockedTraceDetailed.title)
      expect(modal.props('traceIds')).toEqual([mockedTraceDetailed.id])
    })
  })

  BddTest().when('the update trace action is triggered', () => {
    beforeEach(async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })
      await popover.vm.$emit('update-selected')
      await flushPromises()
    })

    BddTest().then('it should navigate to update trace page', () => {
      expect(mockNavigateToStudentToolsUpdateTrace).toHaveBeenCalledWith({
        id: mockedTraceDetailed.id,
      })
    })
  })

  BddTest().when('TraceSettingsDropdown emits download-selected', () => {
    BddTest().then('it should download the trace attachment', async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })

      await popover.vm.$emit('download-selected')
      await flushPromises()

      expect(downloadBlob).toHaveBeenCalledTimes(1)
      const [blob, fileName] = vi.mocked(downloadBlob).mock.calls[0]
      expect(blob).toMatchObject({
        size: expect.any(Number),
        type: 'application/octet-stream'
      })
      expect(fileName).toBe(mockedTraceDetailed.attachment.fileName)
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('TraceSettingsDropdown emits download-selected and download fails', () => {
    beforeEach(() => {
      server.use(downloadTraceAttachmentErrorHandler)
    })

    BddTest().then('it should add an error toaster message', async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })

      await popover.vm.$emit('download-selected')
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
      const tabs = wrapper.findComponent({ name: 'AvTabs' })

      await tabs.vm.$emit('update:modelValue', 1)
      await flushPromises()
    })

    BddTest().then('it should render the associations tab with correct title', () => {
      const tab = wrapper.findComponent({ name: 'AvTab' })

      expect(tab.props('title')).toBe('Mes éléments associés (5)')
    })

    BddTest().then('it should render TraceAssociations with correct props', () => {
      const traceAssociations = wrapper.findComponent(TraceAssociationsStub)

      expect(traceAssociations.exists()).toBe(true)
      expect(traceAssociations.props('countAssociations')).toBe(5)
      expect(traceAssociations.props('associationsError')).toBeNull()
    })
  })

  BddTest().when('trace deletion succeeds', () => {
    beforeEach(async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsDropdown' })

      await popover.vm.$emit('delete-selected')
      await flushPromises()

      const modal = wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' })
      modal.props('onConfirmDelete')()
      await flushPromises()
    })

    BddTest().then('it should navigate back to traces list', () => {
      expect(mockNavigateToStudentTraces).toHaveBeenCalledWith({ replace: true })
    })
  })
})
