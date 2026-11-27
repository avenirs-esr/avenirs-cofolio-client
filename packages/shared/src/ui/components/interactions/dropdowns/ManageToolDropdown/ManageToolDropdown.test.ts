import type { ToolDTO } from '#shared/api/avenir-esr/index'
import type { VueWrapper } from '@vue/test-utils'
import { EToolType } from '#shared/api/avenir-esr/index'
import { ManageEntityDropdownStub } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageToolDropdown from '#shared/ui/components/interactions/dropdowns/ManageToolDropdown/ManageToolDropdown.vue'
import { DeleteToolModalStub } from '#shared/ui/components/overlay/modals/DeleteToolModal/DeleteToolModal.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const tool = {
  id: 'tool-id',
  name: 'Outil régional',
  type: EToolType.REGIONAL,
} as ToolDTO

BddTest().given('a manage tool dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageToolDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub,
    DeleteToolModal: DeleteToolModalStub,
  }

  const mountWith = (props: { tool?: ToolDTO, disabled?: boolean, disabledTooltip?: string } = {}) => {
    wrapper = mount(ManageToolDropdown, {
      props: {
        tool,
        ...props,
      },
      global: { stubs },
    })
  }

  const getManageEntityDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getDeleteToolModal = () => wrapper.findComponent(DeleteToolModalStub)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the dropdown is mounted with default props', () => {
    beforeEach(() => mountWith())

    BddTest().then('it should manage the tool with the delete action', () => {
      expect(getManageEntityDropdown().props('actions')).toStrictEqual([
        Action.DELETE,
      ])
    })

    BddTest().then('it should render the entity name according to the tool type', () => {
      expect(getManageEntityDropdown().props('entityName')).toBeTruthy()
    })

    BddTest().then('it should render a closed delete tool modal with the tool', () => {
      expect(getDeleteToolModal().props()).toMatchObject({
        opened: false,
        tool,
      })
    })
  })

  BddTest().when('the dropdown is mounted with interactive props', () => {
    const interactiveProps = {
      disabled: true,
      disabledTooltip: 'Management disabled',
    }

    beforeEach(() => mountWith(interactiveProps))

    BddTest().then('it should pass the interactive props to the manage entity dropdown', () => {
      expect(getManageEntityDropdown().props()).toMatchObject(interactiveProps)
    })
  })

  BddTest().when('the delete action is selected', () => {
    beforeEach(async () => {
      mountWith()
      await getManageEntityDropdown().vm.$emit('actionSelected', Action.DELETE)
    })

    BddTest().then('it should open the delete tool modal', () => {
      expect(getDeleteToolModal().props('opened')).toBe(true)
    })

    BddTest().then('it should pass the selected tool to the delete modal', () => {
      expect(getDeleteToolModal().props('tool')).toStrictEqual(tool)
    })

    BddTest().and('the delete modal is cancelled', () => {
      beforeEach(async () => {
        await getDeleteToolModal().vm.$emit('cancel')
      })

      BddTest().then('it should close the delete tool modal', () => {
        expect(getDeleteToolModal().props('opened')).toBe(false)
      })

      BddTest().then('it should not emit the deleted event', () => {
        expect(wrapper.emitted('deleted')).toBeUndefined()
      })
    })

    BddTest().and('the tool is deleted', () => {
      beforeEach(async () => {
        await getDeleteToolModal().vm.$emit('deleted')
      })

      BddTest().then('it should emit the deleted event', () => {
        expect(wrapper.emitted('deleted')).toHaveLength(1)
      })

      BddTest().then('it should close the delete tool modal', () => {
        expect(getDeleteToolModal().props('opened')).toBe(false)
      })
    })
  })

  BddTest().when('an unsupported action is selected', () => {
    beforeEach(async () => {
      mountWith()
      await getManageEntityDropdown().vm.$emit('actionSelected', 'unsupported')
    })

    BddTest().then('it should keep the delete tool modal closed', () => {
      expect(getDeleteToolModal().props('opened')).toBe(false)
    })
  })
})
