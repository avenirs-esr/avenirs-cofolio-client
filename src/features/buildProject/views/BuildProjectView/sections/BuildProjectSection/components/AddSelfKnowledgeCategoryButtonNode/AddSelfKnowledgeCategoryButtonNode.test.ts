import type { ButtonNodeTemplateProps } from '@/common/components/VueFlow/ButtonNodeTemplate/ButtonNodeTemplate.vue'
import type { Node } from '@vue-flow/core'
import { mockedSelfKnowledgeCategories, mockedSelfKnowledgeCategoriesAvailable } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { ButtonNodeTemplateStub } from '@/common/components/VueFlow/ButtonNodeTemplate/ButtonNodeTemplate.stub'
import { mandatoryNodeButtonTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import AddSelfKnowledgeCategoryButtonNode from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddSelfKnowledgeCategoryButtonNode/AddSelfKnowledgeCategoryButtonNode.vue'
import { SELF_KNOWLEDGE_NODE_TYPES } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/self-knowledge-nodes.types'
import { AvCheckboxesGroupStub, AvCheckboxStub, AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, vi } from 'vitest'

const mockAddNode = vi.fn()
const mockShowModal = ref(false)
const mockDisplayModal = vi.fn()
const mockHideModal = vi.fn()
const mockNodes = ref<Node[]>([])
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

vi.mock('@vue-flow/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vue-flow/core')>()
  return {
    ...actual,
    useVueFlow: () => ({
      nodes: mockNodes,
    }),
  }
})

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

vi.mock('@/common/composables/VueFlow/use-nodes/use-nodes', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/VueFlow/use-nodes/use-nodes')>()
  return {
    ...actual,
    useNodes: () => ({
      addNode: mockAddNode,
    }),
  }
})

BddTest().given('an AddSelfKnowledgeCategoryButtonNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddSelfKnowledgeCategoryButtonNode>>

  const stubs = {
    AvModal: AvModalStub,
    AvCheckboxesGroup: AvCheckboxesGroupStub,
    AvCheckbox: AvCheckboxStub,
    ButtonNodeTemplate: ButtonNodeTemplateStub
  }

  BddTest().when('the component is mounted', () => {
    const props: ButtonNodeTemplateProps = { ...mandatoryNodeButtonTemplateProps }

    beforeEach(async () => {
      vi.clearAllMocks()

      wrapper = mountComponent(AddSelfKnowledgeCategoryButtonNode, { props, global: { stubs } })

      await vi.waitFor(() => {
        expect(wrapper.findComponent(AvCheckboxesGroupStub).exists()).toBe(true)
      })
    })

    BddTest().then('it should render the ButtonNodeTemplate component', () => {
      const buttonNodeTemplate = wrapper.findComponent(ButtonNodeTemplateStub)
      expect(buttonNodeTemplate.exists()).toBe(true)
    })

    BddTest().then('it should render the modal component', () => {
      const modal = wrapper.findComponent(AvModalStub)
      expect(modal.exists()).toBe(true)
    })

    BddTest().then('it should render the checkboxes group component', () => {
      const checkboxesGroup = wrapper.findComponent(AvCheckboxesGroupStub)
      expect(checkboxesGroup.exists()).toBe(true)
    })

    BddTest().then('it should render multiple checkbox components', () => {
      const checkboxes = wrapper.findAllComponents(AvCheckboxStub)
      expect(checkboxes.length).toBeGreaterThan(0)
    })

    BddTest().and('the user clicks the button', () => {
      beforeEach(() => {
        const buttonNodeTemplate = wrapper.findComponent(ButtonNodeTemplateStub)
        buttonNodeTemplate.vm.$emit('click')
      })

      BddTest().then('it should call the displayModal function', () => {
        expect(mockDisplayModal).toHaveBeenCalled()
      })
    })

    BddTest().and('the user selects categories and confirms', () => {
      const selectedCategories = mockedSelfKnowledgeCategoriesAvailable.slice(0, 2).map(cat => cat.type)

      beforeEach(async () => {
        const checkboxes = wrapper.findAllComponents(AvCheckboxStub)
        checkboxes[0].find('input').setValue(true)
        checkboxes[1].find('input').setValue(true)
        await flushPromises()
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('confirm')
      })

      BddTest().then('it should call the addNode function for each selected category', async () => {
        await vi.waitFor(() => {
          expect(mockAddNode).toHaveBeenCalledTimes(selectedCategories.length)
        })

        selectedCategories.forEach(() => {
          expect(mockAddNode).toHaveBeenCalledWith(
            expect.objectContaining({
              type: SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_CATEGORY,
            })
          )
        })
      })
    })

    BddTest().and('the user closes the modal', () => {
      beforeEach(() => {
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('close')
      })

      BddTest().then('it should call the hideModal function', () => {
        expect(mockHideModal).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('there are already some categories added in the nodes', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      mockNodes.value = ([...mockedSelfKnowledgeCategoriesAvailable, ...mockedSelfKnowledgeCategories]).map(cat => ({
        id: cat.type,
        type: SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_CATEGORY,
        position: { x: 0, y: 0 },
        data: {}
      }))
    })

    BddTest().and('the component is mounted', () => {
      const props: ButtonNodeTemplateProps = { ...mandatoryNodeButtonTemplateProps }

      beforeEach(async () => {
        wrapper = mountComponent(AddSelfKnowledgeCategoryButtonNode, { props, global: { stubs } })
      })

      BddTest().then('it should not render any checkbox components', async () => {
        await vi.waitFor(() => {
          expect(wrapper.findComponent(AvCheckboxesGroupStub).exists()).toBe(false)
          const checkboxes = wrapper.findAllComponents(AvCheckboxStub)
          expect(checkboxes.length).toBe(0)
        })
      })
    })
  })
})
