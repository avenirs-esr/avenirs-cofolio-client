import type { DeleteToolsModalProps } from '#shared/ui/components/overlay/modals/DeleteToolsModal/DeleteToolsModal.vue'
import type { VueWrapper } from '@vue/test-utils'
import {
  generateToolDTOs,
  INVALID_TOOL_ID,
  MOCKED_TOOLS_TOTAL_ELEMENTS,
} from '#shared/__mocks__/fixtures/tools.fixtures'
import {
  getLocalToolsWithInvalidIdHandler,
  getNationalToolsWithInvalidIdHandler,
} from '#shared/__mocks__/msw/handlers/tools.handlers'
import { server } from '#shared/__mocks__/msw/server'
import {
  EToolType,
  getDeleteLocalToolsUrl,
  getDeleteNationalToolsUrl,
} from '#shared/api/avenir-esr'
import { mountComponent } from '#shared/test-utils/unit/mount-component'
import { ToolInstitutionStub } from '#shared/ui/components/base/ToolInstitution/ToolInstitution.stub'
import { QuerySuspenseStub } from '#shared/ui/components/containers/QuerySuspense/QuerySuspense.stub'
import { ConfirmationModalStub } from '#shared/ui/components/overlay/modals/ConfirmationModal/ConfirmationModal.stub'
import DeleteToolsModal from '#shared/ui/components/overlay/modals/DeleteToolsModal/DeleteToolsModal.vue'
import { CompactCardSelectorStub } from '#shared/ui/components/overlay/selectors/CompactCardSelector/CompactCardSelector.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const mockToaster = vi.hoisted(() => ({
  addErrorMessage: vi.fn(),
  addSuccessMessage: vi.fn(),
  addWarningMessage: vi.fn(),
}))

vi.mock('#shared/stores/toaster/toaster', () => ({
  useToasterStore: () => mockToaster,
}))

const nationalTools = generateToolDTOs(MOCKED_TOOLS_TOTAL_ELEMENTS, EToolType.NATIONAL)
const localTools = generateToolDTOs(MOCKED_TOOLS_TOTAL_ELEMENTS)

const nationalToolIds = [nationalTools[0]!.id]
const localToolIds = localTools.slice(0, 2).map(({ id }) => id)

const deleteRequests: Array<{ pathname: string, ids: string[] }> = []

const stubs = {
  ConfirmationModal: ConfirmationModalStub,
  QuerySuspense: QuerySuspenseStub,
  CompactCardSelector: CompactCardSelectorStub,
  ToolInstitution: ToolInstitutionStub,
}

BddTest().given('a delete tools modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteToolsModal>>

  const getConfirmationModals = () => wrapper.findAllComponents(ConfirmationModalStub)
  const getCompactCardSelector = () => wrapper.findComponent(CompactCardSelectorStub)

  const mountDeleteToolsModal = async (props: Partial<DeleteToolsModalProps> = {}) => {
    wrapper = mountComponent(DeleteToolsModal, {
      props: { opened: true, ...props },
      global: { stubs },
    })

    const expectedTools = props.isNational ? nationalTools : localTools

    await vi.waitFor(() => {
      expect(getCompactCardSelector().props('elements')).toHaveLength(expectedTools.length)
    })
  }

  const selectTools = async (ids: string[]) => {
    await getCompactCardSelector().vm.$emit('update:modelValue', ids)
  }

  const confirmDeletion = async () => {
    await getConfirmationModals()[0]!.vm.$emit('confirm')
    await getConfirmationModals()[1]!.vm.$emit('confirm')
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    deleteRequests.length = 0

    server.events.on('request:start', ({ request }) => {
      if (request.method === 'DELETE') {
        void request.clone().json().then((ids: string[]) => {
          deleteRequests.push({ pathname: new URL(request.url).pathname, ids })
        })
      }
    })

    await mountDeleteToolsModal()
  })

  afterEach(() => {
    wrapper.unmount()
    server.events.removeAllListeners()
    server.resetHandlers()
  })

  BddTest().when('the modal is opened for local tools', () => {
    BddTest().then('it should render the confirmation modal with opened true', () => {
      expect(getConfirmationModals()[0]!.props('opened')).toBe(true)
    })

    BddTest().then('it should render the query suspense component', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).exists()).toBe(true)
    })

    BddTest().then('it should display the available local tools from the API fixtures', () => {
      const selector = getCompactCardSelector()

      expect(selector.exists()).toBe(true)
      expect(selector.props('elements')).toHaveLength(localTools.length)
      expect(selector.props('elements').map(({ id }) => id)).toEqual(localTools.map(({ id }) => id))
    })
  })

  BddTest().when('the modal is opened for national tools', () => {
    beforeEach(async () => {
      wrapper.unmount()
      await mountDeleteToolsModal({ isNational: true })
    })

    BddTest().then('it should display the available national tools from the API fixtures', () => {
      const selector = getCompactCardSelector()

      expect(selector.exists()).toBe(true)
      expect(selector.props('elements')).toHaveLength(nationalTools.length)
      expect(selector.props('elements').map(({ id }) => id)).toEqual(nationalTools.map(({ id }) => id))
    })
  })

  BddTest().when('the modal is closed', () => {
    beforeEach(async () => {
      await wrapper.setProps({ opened: false })
    })

    BddTest().then('it should pass opened false to the confirmation modal', () => {
      expect(getConfirmationModals()[0]!.props('opened')).toBe(false)
    })
  })

  BddTest().when('no tools are selected', () => {
    BddTest().then('the confirm button should be disabled', () => {
      expect(getConfirmationModals()[0]!.props('confirmButtonDisabled')).toBe(true)
    })

    BddTest().then('it should display the disabled tooltip', () => {
      expect(getConfirmationModals()[0]!.props('confirmButtonDisabledTooltip')).toBeDefined()
    })
  })

  BddTest().when('local tools are selected', () => {
    beforeEach(async () => {
      await selectTools(localToolIds)
    })

    BddTest().then('the confirm button should be enabled', () => {
      expect(getConfirmationModals()[0]!.props('confirmButtonDisabled')).toBe(false)
    })

    BddTest().then('it should display the selected tools count in the confirm button label', () => {
      expect(getConfirmationModals()[0]!.props('confirmButtonLabel')).toBeDefined()
    })
  })

  BddTest().when('the cancel button is clicked', () => {
    BddTest().then('it should emit the cancel event', async () => {
      await getConfirmationModals()[0]!.vm.$emit('close')

      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })
  })

  BddTest().when('the confirmation modal is confirmed', () => {
    BddTest().then('it should open the second confirmation modal', async () => {
      await getConfirmationModals()[0]!.vm.$emit('confirm')

      expect(getConfirmationModals()).toHaveLength(2)
      expect(getConfirmationModals()[1]!.props('opened')).toBe(true)
    })
  })

  BddTest().when('selected local tools are confirmed for deletion', () => {
    beforeEach(async () => {
      await selectTools(localToolIds)
      await confirmDeletion()

      await vi.waitFor(() => expect(wrapper.emitted('deleted')).toHaveLength(1))
      await vi.waitFor(() => expect(deleteRequests).toHaveLength(1))
    })

    BddTest().then('it should submit the selected IDs to the local API endpoint', () => {
      const localRequest = deleteRequests.find(({ pathname }) => pathname === getDeleteLocalToolsUrl())

      expect(localRequest?.ids).toEqual(expect.arrayContaining(localToolIds))
      expect(localRequest?.ids).toHaveLength(localToolIds.length)
    })

    BddTest().then('it should notify success and emit the deleted event', () => {
      expect(mockToaster.addSuccessMessage).toHaveBeenCalledOnce()
      expect(wrapper.emitted('deleted')).toHaveLength(1)
    })
  })

  BddTest().when('selected national tools are confirmed for deletion', () => {
    beforeEach(async () => {
      wrapper.unmount()
      await mountDeleteToolsModal({ isNational: true })

      await selectTools(nationalToolIds)
      await confirmDeletion()

      await vi.waitFor(() => expect(wrapper.emitted('deleted')).toHaveLength(1))
      await vi.waitFor(() => expect(deleteRequests).toHaveLength(1))
    })

    BddTest().then('it should submit the selected IDs to the national API endpoint', () => {
      const nationalRequest = deleteRequests.find(({ pathname }) => pathname === getDeleteNationalToolsUrl())

      expect(nationalRequest?.ids).toEqual(nationalToolIds)
    })

    BddTest().then('it should notify success and emit the deleted event', () => {
      expect(mockToaster.addSuccessMessage).toHaveBeenCalledOnce()
      expect(wrapper.emitted('deleted')).toHaveLength(1)
    })
  })

  BddTest().when('deleting local tools fails', () => {
    beforeEach(async () => {
      wrapper.unmount()
      server.use(getLocalToolsWithInvalidIdHandler)
      await mountDeleteToolsModal()

      await selectTools([`local-${INVALID_TOOL_ID}`])
      await confirmDeletion()

      await vi.waitFor(() => expect(mockToaster.addErrorMessage).toHaveBeenCalledOnce())
    })

    BddTest().then('it should notify the failure without emitting deleted', () => {
      expect(mockToaster.addSuccessMessage).not.toHaveBeenCalled()
      expect(wrapper.emitted('deleted')).toBeUndefined()
    })
  })

  BddTest().when('deleting national tools fails', () => {
    beforeEach(async () => {
      wrapper.unmount()
      server.use(getNationalToolsWithInvalidIdHandler)
      await mountDeleteToolsModal({ isNational: true })

      await selectTools([`national-${INVALID_TOOL_ID}`])
      await confirmDeletion()

      await vi.waitFor(() => expect(mockToaster.addErrorMessage).toHaveBeenCalledOnce())
    })

    BddTest().then('it should notify the failure without emitting deleted', () => {
      expect(mockToaster.addSuccessMessage).not.toHaveBeenCalled()
      expect(wrapper.emitted('deleted')).toBeUndefined()
    })
  })
})
