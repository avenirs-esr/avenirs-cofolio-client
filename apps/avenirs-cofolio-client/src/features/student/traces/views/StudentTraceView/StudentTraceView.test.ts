import type { VueWrapper } from '@vue/test-utils'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { DetailPageTitleStub, ErrorCodes } from '@avenirs-esr/shared'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { mockedTraceAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import { mockedTraceDetailed } from '@/__mocks__/fixtures/student/traces.fixtures'
import { getAssociationsErrorHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { createTraceDetailedHandler, downloadTraceAttachmentErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { ROUTES } from '@/common/constants'
import { downloadBlob } from '@/common/utils/download/download'
import { ElementAssociationsStub } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.stub'
import { TraceDeletionConfirmationModalStub } from '@/features/student/traces/components/modals/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.stub'
import { StudentTraceDetailsStub } from '@/features/student/traces/components/StudentTraceDetails/StudentTraceDetails.stub'
import { TraceSettingsDropdownStub } from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.stub'
import StudentTraceView from '@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'

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
    DetailPageTitle: DetailPageTitleStub,
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    TraceSettingsDropdown: TraceSettingsDropdownStub,
    TraceDeletionConfirmationModal: TraceDeletionConfirmationModalStub,
    StudentTraceDetails: StudentTraceDetailsStub,
    ElementAssociations: ElementAssociationsStub,
  }

  const associationsCount
    = mockedTraceAssociations.declaredActivityAssociations.length
      + mockedTraceAssociations.skillProgressAssociations.length
      + mockedTraceAssociations.declaredExperienceAssociations.length
      + mockedTraceAssociations.declaredProgramAssociations.length

  const title = mockedTraceDetailed.title

  async function mountView () {
    wrapper = mountComponent(StudentTraceView, {
      props: { traceId: mockedTraceDetailed.id },
      global: { stubs },
      useTanstack: true,
      usePinia: true,
    })

    await flushPromises()
  }

  async function selectAssociationsTab () {
    const tabs = wrapper.findComponent({ name: 'AvTabs' })

    await tabs.vm.$emit('update:modelValue', 1)
    await flushPromises()
  }

  const getSettingsDropdown = () => wrapper.findComponent(TraceSettingsDropdownStub)
  const getDeletionModal = () => wrapper.findComponent(TraceDeletionConfirmationModalStub)

  beforeEach(async () => {
    vi.clearAllMocks()
    server.use(createTraceDetailedHandler(mockedTraceDetailed))
    await mountView()
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render DetailPageTitle with the trace title and breadcrumb', () => {
      const pageTitle = wrapper.findComponent(DetailPageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('trailingLinks')).toEqual([{ text: title }])
    })

    BddTest().then('it should render TraceSettingsDropdown', () => {
      expect(getSettingsDropdown().exists()).toBe(true)
    })

    BddTest().then('it should pass the trace identifier to TraceSettingsDropdown', () => {
      expect(getSettingsDropdown().props('traceId')).toBe(mockedTraceDetailed.id)
    })

    BddTest().then('it should enable download when the trace has an attachment', () => {
      expect(getSettingsDropdown().props('downloadDisabled')).toBe(false)
    })

    BddTest().then('it should render the deletion confirmation modal initially hidden', () => {
      const modal = getDeletionModal()

      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(false)
      expect(modal.props('traceIds')).toEqual([mockedTraceDetailed.id])
      expect(modal.props('title')).toBe(title)
    })

    BddTest().then('it should render AvTabs', () => {
      expect(wrapper.findComponent({ name: 'AvTabs' }).exists()).toBe(true)
    })

    BddTest().then('it should render the trace details tab by default', () => {
      const tab = wrapper.findComponent({ name: 'AvTab' })

      expect(tab.exists()).toBe(true)
      expect(tab.props('title')).toBe('Ma trace')
    })

    BddTest().then('it should render StudentTraceDetails with the fetched trace', () => {
      const traceDetails = wrapper.findComponent(StudentTraceDetailsStub)

      expect(traceDetails.exists()).toBe(true)
      expect(traceDetails.props('trace')).toEqual(mockedTraceDetailed)
    })

    BddTest().then('it should not render ElementAssociations in the inactive tab', () => {
      expect(wrapper.findComponent(ElementAssociationsStub).exists()).toBe(false)
    })
  })

  BddTest().when('the trace has no attachment', () => {
    beforeEach(async () => {
      const traceWithoutAttachment = {
        ...mockedTraceDetailed,
        attachment: undefined,
      }

      server.use(createTraceDetailedHandler(traceWithoutAttachment))
      await mountView()
    })

    BddTest().then('it should disable the download action', () => {
      expect(getSettingsDropdown().props('downloadDisabled')).toBe(true)
    })
  })

  BddTest().when('the view is mounted on the home trace route', () => {
    beforeEach(async () => {
      route.name = ROUTES.STUDENT.TRACE.name
      await mountView()
    })

    BddTest().then('it should render the trace breadcrumb', () => {
      const pageTitle = wrapper.findComponent(DetailPageTitleStub)

      expect(pageTitle.props('trailingLinks')).toEqual([{ text: title }])
    })
  })

  BddTest().when('the delete action is triggered', () => {
    beforeEach(async () => {
      await getSettingsDropdown().vm.$emit('delete')
      await flushPromises()
    })

    BddTest().then('it should open the deletion confirmation modal with the trace identifier', () => {
      const modal = getDeletionModal()

      expect(modal.props('opened')).toBe(true)
      expect(modal.props('title')).toBe(title)
      expect(modal.props('traceIds')).toEqual([mockedTraceDetailed.id])
    })
  })

  BddTest().when('the update action is triggered', () => {
    beforeEach(async () => {
      await getSettingsDropdown().vm.$emit('update')
      await flushPromises()
    })

    BddTest().then('it should navigate to the trace update page', () => {
      expect(mockNavigateToStudentUpdateTrace).toHaveBeenCalledWith({
        id: mockedTraceDetailed.id,
      })
    })
  })

  BddTest().when('the download action is triggered', () => {
    BddTest().then('it should download the trace attachment', async () => {
      await getSettingsDropdown().vm.$emit('download')
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

  BddTest().when('the download action is triggered and the download fails', () => {
    beforeEach(() => {
      server.use(downloadTraceAttachmentErrorHandler)
    })

    BddTest().then('it should display an error toaster message', async () => {
      await getSettingsDropdown().vm.$emit('download')
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

    BddTest().then('it should render the associations tab with the correct title', () => {
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
  })

  BddTest().when('the associations tab is selected and the associations request fails', () => {
    beforeEach(async () => {
      server.use(getAssociationsErrorHandler)
      await mountView()
      await selectAssociationsTab()
    })

    BddTest().then('it should display a zero associations count in the tab title', () => {
      const tab = wrapper.findComponent({ name: 'AvTab' })

      expect(tab.props('title')).toBe('Mes éléments associés (0)')
    })

    BddTest().then('it should pass the error to ElementAssociations', async () => {
      await vi.waitFor(() => {
        const elementAssociations = wrapper.findComponent(ElementAssociationsStub)

        expect(elementAssociations.props('error')).toEqual(
          expect.objectContaining({ code: ErrorCodes.SERVER }),
        )
        expect(elementAssociations.props('associations')).toBeUndefined()
      })
    })
  })

  BddTest().when('the trace deletion succeeds', () => {
    beforeEach(async () => {
      await getSettingsDropdown().vm.$emit('delete')
      await flushPromises()

      getDeletionModal().props('onConfirmDelete')()
      await flushPromises()
    })

    BddTest().then('it should close the modal', () => {
      expect(getDeletionModal().props('opened')).toBe(false)
    })

    BddTest().then('it should navigate back to the traces list', () => {
      expect(mockNavigateToStudentTraces).toHaveBeenCalledWith({ replace: true })
    })
  })

  BddTest().when('the update action is triggered on the tools kit route', () => {
    beforeEach(async () => {
      route.name = ROUTES.STUDENT.TOOLS_KIT_TRACE.name
      await mountView()

      await getSettingsDropdown().vm.$emit('update')
      await flushPromises()
    })

    BddTest().then('it should navigate to the tools kit trace update page', () => {
      expect(mockNavigateToStudentToolsKitUpdateTrace).toHaveBeenCalledWith({
        id: mockedTraceDetailed.id,
      })
    })
  })
})
