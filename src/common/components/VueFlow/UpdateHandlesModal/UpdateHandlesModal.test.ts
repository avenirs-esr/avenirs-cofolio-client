import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { UpdateHandleSelectorStub } from '@/common/components/VueFlow/UpdateHandleSelector/UpdateHandleSelector.stub'
import UpdateHandlesModal, { type UpdateHandlesModalProps } from '@/common/components/VueFlow/UpdateHandlesModal/UpdateHandlesModal.vue'
import { AvCardStub, AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { Position } from '@vue-flow/core'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const mockIsMobile = ref(false)
const mockUpdateNode = vi.fn()

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    })
  }
})

vi.mock('@vue-flow/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vue-flow/core')>()
  return {
    ...actual,
    useVueFlow: () => ({
      updateNode: mockUpdateNode,
    }),
  }
})

BddTest().given('an update handles modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateHandlesModal>>

  const stubs = {
    AvCard: AvCardStub,
    AvIcon: AvIconStub,
    ConfirmationModal: ConfirmationModalStub,
    UpdateHandleSelector: UpdateHandleSelectorStub,
  }

  BddTest().when('the component is mounted with top position', () => {
    const props: UpdateHandlesModalProps = {
      show: true,
      id: 'node-1',
      data: {
        top: true,
        right: false,
        bottom: false,
        left: false
      }
    }

    beforeEach(() => {
      wrapper = mount(UpdateHandlesModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the modal', () => {
      const modal = wrapper.findComponent(ConfirmationModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(true)
    })

    BddTest().then('it should render 4 handle selectors', () => {
      const handleSelectors = wrapper.findAllComponents(UpdateHandleSelectorStub)
      expect(handleSelectors.length).toBe(4)
    })

    BddTest().then('it should render 4 icon containers', () => {
      expect(wrapper.find('.top-handle').exists()).toBe(true)
      expect(wrapper.find('.right-handle').exists()).toBe(true)
      expect(wrapper.find('.bottom-handle').exists()).toBe(true)
      expect(wrapper.find('.left-handle').exists()).toBe(true)
    })

    BddTest().then('it should only render the top icon', () => {
      const topIconContainer = wrapper.find('.top-handle')
      const rightIconContainer = wrapper.find('.right-handle')
      const bottomIconContainer = wrapper.find('.bottom-handle')
      const leftIconContainer = wrapper.find('.left-handle')
      expect(topIconContainer.findComponent(AvIconStub).exists()).toBe(true)
      expect(rightIconContainer.findComponent(AvIconStub).exists()).toBe(false)
      expect(bottomIconContainer.findComponent(AvIconStub).exists()).toBe(false)
      expect(leftIconContainer.findComponent(AvIconStub).exists()).toBe(false)
    })

    BddTest().then('it should render the card with correct title', () => {
      const card = wrapper.findComponent(AvCardStub)
      expect(card.exists()).toBe(true)
      expect(card.text()).toBe('Aperçu du nœud')
    })

    BddTest().then('the top handle selector should be active', () => {
      const handleSelectors = wrapper.findAllComponents(UpdateHandleSelectorStub)
      const topHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Top)
      expect(topHandleSelector?.props('modelValue')).toBe(true)
    })

    BddTest().then('the right, bottom and left handle selectors should be inactive', () => {
      const handleSelectors = wrapper.findAllComponents(UpdateHandleSelectorStub)
      const rightHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Right)
      const bottomHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Bottom)
      const leftHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Left)
      expect(rightHandleSelector?.props('modelValue')).toBe(false)
      expect(bottomHandleSelector?.props('modelValue')).toBe(false)
      expect(leftHandleSelector?.props('modelValue')).toBe(false)
    })

    BddTest().and('the top handle selector is clicked', () => {
      beforeEach(() => {
        const handleSelectors = wrapper.findAllComponents(UpdateHandleSelectorStub)
        const topHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Top)
        topHandleSelector?.vm.$emit('update:modelValue', false)
      })

      BddTest().then('it should deactivate the top handle selector', () => {
        const handleSelectors = wrapper.findAllComponents(UpdateHandleSelectorStub)
        const topHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Top)
        expect(topHandleSelector?.props('modelValue')).toBe(false)
      })
    })

    BddTest().and('the right handle selector is clicked', () => {
      beforeEach(() => {
        const handleSelectors = wrapper.findAllComponents(UpdateHandleSelectorStub)
        const rightHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Right)
        rightHandleSelector?.vm.$emit('update:modelValue', true)
      })

      BddTest().then('it should activate the right handle selector', () => {
        const handleSelectors = wrapper.findAllComponents(UpdateHandleSelectorStub)
        const rightHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Right)
        expect(rightHandleSelector?.props('modelValue')).toBe(true)
      })
    })

    BddTest().and('the bottom handle selector is clicked', () => {
      beforeEach(() => {
        const handleSelectors = wrapper.findAllComponents(UpdateHandleSelectorStub)
        const bottomHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Bottom)
        bottomHandleSelector?.vm.$emit('update:modelValue', true)
      })

      BddTest().then('it should activate the bottom handle selector', () => {
        const handleSelectors = wrapper.findAllComponents(UpdateHandleSelectorStub)
        const bottomHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Bottom)
        expect(bottomHandleSelector?.props('modelValue')).toBe(true)
      })
    })

    BddTest().and('the left handle selector is clicked', () => {
      beforeEach(() => {
        const handleSelectors = wrapper.findAllComponents(UpdateHandleSelectorStub)
        const leftHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Left)
        leftHandleSelector?.vm.$emit('update:modelValue', true)
      })

      BddTest().then('it should activate the left handle selector', () => {
        const handleSelectors = wrapper.findAllComponents(UpdateHandleSelectorStub)
        const leftHandleSelector = handleSelectors.find(handle => handle.props('position') === Position.Left)
        expect(leftHandleSelector?.props('modelValue')).toBe(true)
      })
    })

    BddTest().and('the modal is closed', () => {
      beforeEach(() => {
        const modal = wrapper.findComponent(ConfirmationModalStub)
        modal.vm.$emit('close', false)
      })

      BddTest().then('it should emit the close event', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })

    BddTest().and('the modal is confirmed', () => {
      beforeEach(() => {
        const modal = wrapper.findComponent(ConfirmationModalStub)
        modal.vm.$emit('confirm')
      })

      BddTest().then('it should call updateNode with the new handles configuration', () => {
        expect(mockUpdateNode).toHaveBeenCalledWith('node-1', {
          data: {
            top: true,
            right: false,
            bottom: false,
            left: false
          }
        })
      })

      BddTest().then('it should emit the close event', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })
  })
})
