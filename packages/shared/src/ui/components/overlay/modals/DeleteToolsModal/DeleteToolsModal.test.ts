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
const selectableTools = [...nationalTools, ...localTools]
const nationalToolIds = [nationalTools[0]!.id]
const localToolIds = localTools.slice(0, 2).map(({ id }) => id)
const selectedToolIds = [...nationalToolIds, ...localToolIds]
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

    await vi.waitFor(() => {
      expect(getCompactCardSelector().props('elements')).toHaveLength(selectableTools.length)
    })
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

  BddTest().when('the modal is opened', () => {
    BddTest().then('it should render the confirmation modal with opened true', () => {
      expect(getConfirmationModals()[0]!.props('opened')).toBe(true)
    })

    BddTest().then('it should render the query suspense component', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).exists()).toBe(true)
    })

    BddTest().then('it should display the available tools from the API fixtures', () => {
      const selector = getCompactCardSelector()

      expect(selector.exists()).toBe(true)
      expect(selector.props('elements')).toHaveLength(selectableTools.length)
      expect(selector.props('elements').map(({ id }) => id)).toEqual(selectableTools.map(({ id }) => id))
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

  BddTest().when('tools are selected', () => {
    beforeEach(async () => {
      await getCompactCardSelector().vm.$emit('update:modelValue', selectedToolIds)
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

  BddTest().when('selected national and local tools are confirmed for deletion', () => {
    beforeEach(async () => {
      await getCompactCardSelector().vm.$emit('update:modelValue', selectedToolIds)
      await getConfirmationModals()[0]!.vm.$emit('confirm')
      await getConfirmationModals()[1]!.vm.$emit('confirm')
      await vi.waitFor(() => expect(wrapper.emitted('deleted')).toHaveLength(1))
      await vi.waitFor(() => expect(deleteRequests).toHaveLength(2))
    })

    BddTest().then('it should submit the selected IDs to the corresponding API endpoints', () => {
      const nationalRequest = deleteRequests.find(({ pathname }) => pathname === getDeleteNationalToolsUrl())
      const localRequest = deleteRequests.find(({ pathname }) => pathname === getDeleteLocalToolsUrl())

      expect(nationalRequest?.ids).toEqual(nationalToolIds)
      expect(localRequest?.ids).toEqual(expect.arrayContaining(localToolIds))
      expect(localRequest?.ids).toHaveLength(localToolIds.length)
    })

    BddTest().then('it should notify success and emit the deleted event', () => {
      expect(mockToaster.addSuccessMessage).toHaveBeenCalledOnce()
      expect(wrapper.emitted('deleted')).toHaveLength(1)
    })
  })

  BddTest().when('deleting national tools fails but local tools are deleted', () => {
    beforeEach(async () => {
      wrapper.unmount()
      server.use(getNationalToolsWithInvalidIdHandler)
      await mountDeleteToolsModal()
      await getCompactCardSelector().vm.$emit('update:modelValue', [`national-${INVALID_TOOL_ID}`, ...localToolIds])
      await getConfirmationModals()[0]!.vm.$emit('confirm')
      await getConfirmationModals()[1]!.vm.$emit('confirm')
      await vi.waitFor(() => expect(wrapper.emitted('deleted')).toHaveLength(1))
    })

    BddTest().then('it should notify a partial failure and success', () => {
      expect(mockToaster.addWarningMessage).toHaveBeenCalledOnce()
      expect(mockToaster.addSuccessMessage).toHaveBeenCalledOnce()
      expect(mockToaster.addErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('deleting both national and local tools fails', () => {
    beforeEach(async () => {
      wrapper.unmount()
      server.use(getNationalToolsWithInvalidIdHandler, getLocalToolsWithInvalidIdHandler)
      await mountDeleteToolsModal()
      await getCompactCardSelector().vm.$emit('update:modelValue', [`national-${INVALID_TOOL_ID}`, `local-${INVALID_TOOL_ID}`])
      await getConfirmationModals()[0]!.vm.$emit('confirm')
      await getConfirmationModals()[1]!.vm.$emit('confirm')
      await vi.waitFor(() => expect(mockToaster.addErrorMessage).toHaveBeenCalledOnce())
    })

    BddTest().then('it should notify the failure without emitting deleted', () => {
      expect(mockToaster.addWarningMessage).not.toHaveBeenCalled()
      expect(mockToaster.addSuccessMessage).not.toHaveBeenCalled()
      expect(wrapper.emitted('deleted')).toBeUndefined()
    })
  })
})
