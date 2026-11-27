import type { DeleteToolModalProps } from '#shared/ui/components/overlay/modals/DeleteToolModal/DeleteToolModal.vue'
import type { VueWrapper } from '@vue/test-utils'
import {
  generateToolDTOs,
  INVALID_TOOL_ID,
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
import { ConfirmationModalStub } from '#shared/ui/components/overlay/modals/ConfirmationModal/ConfirmationModal.stub'
import DeleteToolModal from '#shared/ui/components/overlay/modals/DeleteToolModal/DeleteToolModal.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const mockToaster = vi.hoisted(() => ({
  addErrorMessage: vi.fn(),
  addSuccessMessage: vi.fn(),
}))

vi.mock('#shared/stores/toaster/toaster', () => ({
  useToasterStore: () => mockToaster,
}))

const localTool = generateToolDTOs(1)[0]!
const nationalTool = generateToolDTOs(1, EToolType.NATIONAL)[0]!

const deleteRequests: Array<{ pathname: string, ids: string[] }> = []

function onRequestStart ({ request }: { request: Request }) {
  if (request.method === 'DELETE') {
    void request.clone().json().then((ids: string[]) => {
      deleteRequests.push({
        pathname: new URL(request.url).pathname,
        ids,
      })
    })
  }
}

const stubs = {
  ConfirmationModal: ConfirmationModalStub,
  ToolInstitution: ToolInstitutionStub,
}

BddTest().given('a delete tool modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteToolModal>>

  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)
  const getToolInstitution = () => wrapper.findComponent(ToolInstitutionStub)
  const confirmDeletion = async () => await getConfirmationModal().vm.$emit('confirm')

  const mountWith = async (props: Partial<DeleteToolModalProps> = {}) => {
    wrapper = mountComponent(DeleteToolModal, {
      props: {
        opened: true,
        tool: localTool,
        ...props,
      },
      global: { stubs },
    })

    await vi.waitFor(() => {
      expect(getConfirmationModal().exists()).toBe(true)
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    deleteRequests.length = 0

    server.events.on('request:start', onRequestStart)
  })

  afterEach(() => {
    wrapper?.unmount()
    server.events.removeAllListeners()
    server.resetHandlers()
  })

  BddTest().when('the modal is opened for a local tool', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the confirmation modal with opened true', () => {
      expect(getConfirmationModal().props('opened')).toBe(true)
    })

    BddTest().then('it should display the tool name in the confirmation title', () => {
      expect(getConfirmationModal().props('title')).toBeTruthy()
    })

    BddTest().then('it should display the tool name in the description', () => {
      expect(wrapper.text()).toContain(localTool.name)
    })

    BddTest().then('it should render the tool institution', () => {
      expect(getToolInstitution().exists()).toBe(true)
      expect(getToolInstitution().props('tool')).toStrictEqual(localTool)
    })

    BddTest().then('it should configure the confirm button', () => {
      expect(getConfirmationModal().props()).toMatchObject({
        confirmButtonLabel: expect.any(String),
        confirmButtonIcon: MDI_ICONS.TRASH_CAN_OUTLINE,
        isLoading: false,
      })
    })
  })

  BddTest().when('the modal is opened for a national tool', () => {
    beforeEach(async () => {
      await mountWith({ tool: nationalTool })
    })

    BddTest().then('it should display the national tool name in the confirmation title', () => {
      expect(getConfirmationModal().props('title')).toBeTruthy()
    })

    BddTest().then('it should render the national tool institution', () => {
      expect(getToolInstitution().props('tool')).toStrictEqual(nationalTool)
    })
  })

  BddTest().when('the modal is closed', () => {
    beforeEach(async () => {
      await mountWith({ opened: false })
    })

    BddTest().then('it should pass opened false to the confirmation modal', () => {
      expect(getConfirmationModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('the cancel button is clicked', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should emit the cancel event', async () => {
      await getConfirmationModal().vm.$emit('close')

      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    BddTest().then('it should not emit the deleted event', async () => {
      await getConfirmationModal().vm.$emit('close')

      expect(wrapper.emitted('deleted')).toBeUndefined()
    })
  })

  BddTest().when('a local tool is confirmed for deletion', () => {
    beforeEach(async () => {
      await mountWith()
      await confirmDeletion()

      await vi.waitFor(() => expect(wrapper.emitted('deleted')).toHaveLength(1))
      await vi.waitFor(() => expect(deleteRequests).toHaveLength(1))
    })

    BddTest().then('it should submit the tool ID to the local API endpoint', () => {
      const localRequest = deleteRequests.find(
        ({ pathname }) => pathname === getDeleteLocalToolsUrl(),
      )

      expect(localRequest?.ids).toEqual([localTool.id])
    })

    BddTest().then('it should notify success', () => {
      expect(mockToaster.addSuccessMessage).toHaveBeenCalledOnce()
      expect(mockToaster.addErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should emit the deleted event', () => {
      expect(wrapper.emitted('deleted')).toHaveLength(1)
    })
  })

  BddTest().when('a national tool is confirmed for deletion', () => {
    beforeEach(async () => {
      await mountWith({ tool: nationalTool })
      await confirmDeletion()

      await vi.waitFor(() => expect(wrapper.emitted('deleted')).toHaveLength(1))
      await vi.waitFor(() => expect(deleteRequests).toHaveLength(1))
    })

    BddTest().then('it should submit the tool ID to the national API endpoint', () => {
      const nationalRequest = deleteRequests.find(
        ({ pathname }) => pathname === getDeleteNationalToolsUrl(),
      )

      expect(nationalRequest?.ids).toEqual([nationalTool.id])
    })

    BddTest().then('it should notify success', () => {
      expect(mockToaster.addSuccessMessage).toHaveBeenCalledOnce()
      expect(mockToaster.addErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should emit the deleted event', () => {
      expect(wrapper.emitted('deleted')).toHaveLength(1)
    })
  })

  BddTest().when('deleting a local tool fails', () => {
    beforeEach(async () => {
      server.use(getLocalToolsWithInvalidIdHandler)

      await mountWith({
        tool: {
          ...localTool,
          id: `local-${INVALID_TOOL_ID}`,
        },
      })

      await confirmDeletion()

      await vi.waitFor(() => {
        expect(mockToaster.addErrorMessage).toHaveBeenCalledOnce()
      })
    })

    BddTest().then('it should notify the failure', () => {
      expect(mockToaster.addSuccessMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should not emit the deleted event', () => {
      expect(wrapper.emitted('deleted')).toBeUndefined()
    })
  })

  BddTest().when('deleting a national tool fails', () => {
    beforeEach(async () => {
      server.use(getNationalToolsWithInvalidIdHandler)

      await mountWith({
        tool: {
          ...nationalTool,
          id: `national-${INVALID_TOOL_ID}`,
        },
      })

      await confirmDeletion()

      await vi.waitFor(() => {
        expect(mockToaster.addErrorMessage).toHaveBeenCalledOnce()
      })
    })

    BddTest().then('it should notify the failure', () => {
      expect(mockToaster.addSuccessMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should not emit the deleted event', () => {
      expect(wrapper.emitted('deleted')).toBeUndefined()
    })
  })
})
