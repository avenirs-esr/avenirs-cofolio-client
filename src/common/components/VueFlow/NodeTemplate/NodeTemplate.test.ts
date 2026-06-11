import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { HandlesStub } from '@/common/components/VueFlow/Handles/Handles.stub'
import { NodeDropdownStub } from '@/common/components/VueFlow/NodeDropdown/NodeDropdown.stub'
import NodeTemplate, { type NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import { UpdateHandlesModalStub } from '@/common/components/VueFlow/UpdateHandlesModal/UpdateHandlesModal.stub'
import { mandatoryNodeButtonTemplateProps, mandatoryNodeTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const mockShowModal = ref(false)
const mockDisplayModal = vi.fn()
const mockHideModal = vi.fn()
const mockRemoveNodeWithChildren = vi.fn()
const mockToggle = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useModal: () => ({
      showModal: mockShowModal,
      displayModal: mockDisplayModal,
      hideModal: mockHideModal
    }),
  }
})

vi.mock('@/common/composables/VueFlow/use-nodes/use-nodes', () => ({
  useNodes: () => ({
    removeNodeWithChildren: mockRemoveNodeWithChildren,
    toggle: mockToggle
  }),
}))

BddTest().given('a node template', () => {
  let wrapper: VueWrapper<InstanceType<typeof NodeTemplate>>

  const stubs = {
    Card: CardStub,
    Handles: HandlesStub,
    NodeDropdown: NodeDropdownStub,
    UpdateHandlesModal: UpdateHandlesModalStub
  }

  const slots = {
    title: '<span>Node Title</span>',
    default: '<div>Node Content</div>',
    modal: '<div>Modal Content</div>'
  }

  BddTest().when('the component is mounted with slots and specific props', () => {
    const props: NodeTemplateProps = {
      ...mandatoryNodeButtonTemplateProps,
      withProfileUpdate: true,
      data: { top: true, collapsed: true }
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(NodeTemplate, { props, slots, global: { stubs } })
    })

    BddTest().then('it should render the Card', () => {
      expect(wrapper.findComponent(CardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the slots contents', () => {
      expect(wrapper.html()).toContain('Node Title')
      expect(wrapper.html()).toContain('Node Content')
    })

    BddTest().then('it should render the node dropdown', () => {
      expect(wrapper.findComponent(NodeDropdownStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the correct props to the node dropdown', () => {
      const nodeDropdown = wrapper.findComponent(NodeDropdownStub)
      expect(nodeDropdown.props('collapsed')).toBe(props.data.collapsed)
    })

    BddTest().then('it should render the handles component', () => {
      expect(wrapper.findComponent(HandlesStub).exists()).toBe(true)
    })

    BddTest().then('it should render the update handles modal initially closed', () => {
      expect(wrapper.findComponent(UpdateHandlesModalStub).exists()).toBe(true)
      expect(wrapper.findComponent(UpdateHandlesModalStub).props('show')).toBe(false)
    })

    BddTest().and('the node dropdown emits the update event', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        const nodeDropdown = wrapper.findComponent(NodeDropdownStub)
        nodeDropdown.vm.$emit('update')
      })

      BddTest().then('it should display the update handles modal', () => {
        expect(mockDisplayModal).toHaveBeenCalled()
      })
    })

    BddTest().and('the node dropdown emits the collapse event', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        const nodeDropdown = wrapper.findComponent(NodeDropdownStub)
        nodeDropdown.vm.$emit('collapse')
      })

      BddTest().then('it should toggle the node collapsed state', () => {
        expect(mockToggle).toHaveBeenCalledWith(props.id)
      })
    })

    BddTest().and('the node dropdown emits the remove event', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        const nodeDropdown = wrapper.findComponent(NodeDropdownStub)
        nodeDropdown.vm.$emit('remove')
      })

      BddTest().then('it should emit the remove event', () => {
        expect(wrapper.emitted('remove')).toBeTruthy()
        expect(wrapper.emitted('remove')?.[0]).toEqual([props.id])
      })

      BddTest().then('it should remove the node with its children', () => {
        expect(mockRemoveNodeWithChildren).toHaveBeenCalledWith(props.id)
      })
    })

    BddTest().and('the node dropdown emits the update in profile event', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        const nodeDropdown = wrapper.findComponent(NodeDropdownStub)
        nodeDropdown.vm.$emit('updateInProfile')
      })

      BddTest().then('it should emit the updateInProfile event', () => {
        expect(wrapper.emitted('updateInProfile')).toBeTruthy()
      })
    })
  })

  BddTest().when('the component is mounted with the data props containing handles configuration', () => {
    const props: NodeTemplateProps = {
      ...mandatoryNodeTemplateProps,
      data: {
        top: true,
        right: false,
        bottom: true,
        left: false,
      }
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(NodeTemplate, {
        props,
        slots,
        global: { stubs }
      })
    })

    BddTest().then('it should pass the handles configuration to the handles component', () => {
      const handlesComponent = wrapper.findComponent(HandlesStub)
      expect(handlesComponent.props('data')).toStrictEqual(props.data)
    })
  })

  BddTest().when('the component is mounted with the titleOnly prop as true', () => {
    const props: NodeTemplateProps = { ...mandatoryNodeTemplateProps, titleOnly: true }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(NodeTemplate, {
        props,
        slots,
        global: { stubs }
      })
    })

    BddTest().then('it should only render the title slot', () => {
      expect(wrapper.html()).toContain('Node Title')
      expect(wrapper.html()).not.toContain('Node Content')
    })
  })

  BddTest().when('the component is mounted with the withoutDropdown prop as true', () => {
    const props: NodeTemplateProps = { ...mandatoryNodeTemplateProps, withoutDropdown: true }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(NodeTemplate, {
        props,
        slots,
        global: { stubs }
      })
    })

    BddTest().then('it should not render the node dropdown', () => {
      expect(wrapper.findComponent(NodeDropdownStub).exists()).toBe(false)
    })
  })
})
