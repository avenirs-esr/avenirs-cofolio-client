import type { ButtonNodeTemplateProps } from '@/common/components/VueFlow/ButtonNodeTemplate/ButtonNodeTemplate.vue'
import type { Node } from '@vue-flow/core'
import { getCategoryElements, mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { ButtonNodeTemplateStub } from '@/common/components/VueFlow/ButtonNodeTemplate/ButtonNodeTemplate.stub'
import { mandatoryNodeButtonTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import AddSelfKnowledgeCategoryButtonNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddSelfKnowledgeCategoryButtonNode/AddSelfKnowledgeCategoryButtonNode.vue'
import AddSelfKnowledgeElementButtonNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddSelfKnowledgeElementButtonNode/AddSelfKnowledgeElementButtonNode.vue'
import { SELF_KNOWLEDGE_NODE_TYPES } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/self-knowledge-nodes.types'
import { CategoryElementRatingRadioButtonSetStub } from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementRatingRadioButtonSet/CategoryElementRatingRadioButtonSet.stub'
import { AvCheckboxesGroupStub, AvCheckboxStub, AvInputStub, AvModalStub, AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddNode = vi.fn()
const mockShowModal = ref(false)
const mockDisplayModal = vi.fn()
const mockHideModal = vi.fn()
const mockNodes = ref<Node[]>([])
const mockFindNodeByTitleAndDescription = vi.fn((title: string, description: string) => {
  return mockNodes.value.find(node => node.data.title === title && node.data.description === description)
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
      findNodeByTitleAndDescription: mockFindNodeByTitleAndDescription
    }),
  }
})

BddTest().given('an AddSelfKnowledgeElementButtonNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddSelfKnowledgeElementButtonNode>>

  const stubs = {
    AvModal: AvModalStub,
    AvCheckboxesGroup: AvCheckboxesGroupStub,
    AvCheckbox: AvCheckboxStub,
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    AvInput: AvInputStub,
    ButtonNodeTemplate: ButtonNodeTemplateStub,
    CategoryElementRatingRadioButtonSet: CategoryElementRatingRadioButtonSetStub
  }

  BddTest().when('the component is mounted', () => {
    const props: ButtonNodeTemplateProps = {
      ...mandatoryNodeButtonTemplateProps,
      data: { categoryId: mockedSelfKnowledgeCategories[0].type }
    }

    beforeEach(async () => {
      vi.clearAllMocks()

      wrapper = mountComponent(AddSelfKnowledgeElementButtonNode, { props, global: { stubs } })

      await vi.waitFor(() => {
        expect(wrapper.find('.add-self-knowledge-categories-modal__body').exists()).toBe(true)
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

    BddTest().then('it should render the AvTabs component', () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      expect(tabs.exists()).toBe(true)
    })

    BddTest().then('it should render two tabs', () => {
      const tabs = wrapper.findAllComponents(AvTabStub)
      expect(tabs.length).toBe(1)
      expect(tabs.find(tab => tab.props('title') === 'Éléments existants')).toBeDefined()
      expect(tabs.find(tab => tab.props('title') === 'Nouvel élément')).toBeUndefined()
    })

    BddTest().then('it should render the checkboxes group component', () => {
      const checkboxesGroup = wrapper.findComponent(AvCheckboxesGroupStub)
      expect(checkboxesGroup.exists()).toBe(true)
    })

    BddTest().then('it should render multiple checkbox components', () => {
      const checkboxes = wrapper.findAllComponents(AvCheckboxStub)
      expect(checkboxes.length).toBeGreaterThan(0)
    })

    BddTest().then('it should not render the add custom element form', () => {
      expect(wrapper.find('.add-custom-element-form-container').exists()).toBe(false)
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

    BddTest().and('the user selects elements and confirms', () => {
      const selectedElements = Array.from({ length: 2 })

      beforeEach(async () => {
        const checkboxes = wrapper.findAllComponents(AvCheckboxStub)
        checkboxes[0].find('input').setValue(true)
        await flushPromises()
        checkboxes[1].find('input').setValue(true)
        await flushPromises()
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('confirm')
      })

      BddTest().then('it should call the addNode function for each selected elements', () => {
        selectedElements.forEach(() => {
          expect(mockAddNode).toHaveBeenCalledWith(
            expect.objectContaining({
              type: SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_ELEMENT,
            })
          )
        })
        expect(mockAddNode).toHaveBeenCalledTimes(selectedElements.length)
      })
    })

    BddTest().and('the user selects an existing element that is already added and confirms', () => {
      beforeEach(async () => {
        mockNodes.value = ([...getCategoryElements(mockedSelfKnowledgeCategories[0].type)]).map(cat => ({
          id: crypto.randomUUID(),
          type: SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_ELEMENT,
          position: { x: 0, y: 0 },
          data: {
            title: cat.title,
            description: cat.description,
            categoryId: mockedSelfKnowledgeCategories[0].type
          }
        }))

        const checkboxes = wrapper.findAllComponents(AvCheckboxStub)
        checkboxes[0].find('input').setValue(true)
        await flushPromises()
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('confirm')
      })

      afterEach(() => {
        mockNodes.value = []
      })

      BddTest().then('it should not call the addNode function', () => {
        expect(mockAddNode).not.toHaveBeenCalled()
      })

      BddTest().then('it should call the addErrorMessage function', () => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
    })

    BddTest().and('the user switches to the "New Element" tab', () => {
      beforeEach(async () => {
        const tabs = wrapper.findComponent(AvTabsStub)
        tabs.vm.$emit('update:modelValue', 1)
        await flushPromises()
      })

      BddTest().then('it should render the add custom element form', () => {
        expect(wrapper.find('.add-custom-element-form-container').exists()).toBe(true)
      })

      BddTest().and('the user fills the form', () => {
        const newElementTitle = 'New Element Title'
        const newElementDescription = 'New Element Description'

        beforeEach(async () => {
          const titleInput = wrapper.findAllComponents(AvInputStub)[0].find('input')
          await titleInput.setValue(newElementTitle)
          await wrapper.vm.$nextTick()
          const descriptionInput = wrapper.findAllComponents(AvInputStub)[1].find('input')
          await descriptionInput.setValue(newElementDescription)
          await wrapper.vm.$nextTick()
          const rate5button = wrapper.find('[data-rating="5"]')
          await rate5button.trigger('click')
          await wrapper.vm.$nextTick()
          await vi.waitFor(() => {
            expect(wrapper.findAllComponents(AvInputStub)[0].props('modelValue')).toBe(newElementTitle)
            expect(wrapper.findAllComponents(AvInputStub)[1].props('modelValue')).toBe(newElementDescription)
            expect(wrapper.findComponent(CategoryElementRatingRadioButtonSetStub).props('modelValue')).toBe(5)
          })
        })

        BddTest().and('the user submits the form with form submission', () => {
          beforeEach(async () => {
            const form = wrapper.find('form#add-custom-element-form')
            form.trigger('submit.prevent.stop')
            await flushPromises()
          })

          BddTest().then('it should call the addNode function with the new element data', async () => {
            await vi.waitFor(() => {
              expect(mockAddNode).toHaveBeenCalledWith(
                expect.objectContaining({
                  type: SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_ELEMENT,
                  data: expect.objectContaining({
                    title: newElementTitle,
                    description: newElementDescription,
                    rating: 5
                  })
                })
              )
            })
          })
        })

        BddTest().and('the user submits the form with the modal confirm button', () => {
          beforeEach(async () => {
            const modal = wrapper.findComponent(AvModalStub)
            modal.vm.$emit('confirm')
            await flushPromises()
          })

          BddTest().then('it should call the addNode function with the new element data', async () => {
            await vi.waitFor(() => {
              expect(mockAddNode).toHaveBeenCalledWith(
                expect.objectContaining({
                  type: SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_ELEMENT,
                  data: expect.objectContaining({
                    title: newElementTitle,
                    description: newElementDescription
                  })
                })
              )
            })
          })
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

  BddTest().and('there are already some categories added in the nodes', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      mockNodes.value = ([...getCategoryElements(mockedSelfKnowledgeCategories[0].type)]).map(cat => ({
        id: crypto.randomUUID(),
        type: SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_CATEGORY,
        position: { x: 0, y: 0 },
        data: {
          title: cat.title,
          description: cat.description,
          categoryId: mockedSelfKnowledgeCategories[0].type
        }
      }))
    })

    BddTest().when('the component is mounted', () => {
      const props: ButtonNodeTemplateProps = { ...mandatoryNodeButtonTemplateProps }

      beforeEach(async () => {
        wrapper = mountComponent(AddSelfKnowledgeCategoryButtonNode, { props, global: { stubs } })
      })

      BddTest().then('it should not render any checkbox components', async () => {
        await vi.waitFor(() => {
          expect(wrapper.find('.add-self-knowledge-categories-modal__body').exists()).toBe(false)
          expect(wrapper.findComponent(AvCheckboxesGroupStub).exists()).toBe(false)
          const checkboxes = wrapper.findAllComponents(AvCheckboxStub)
          expect(checkboxes.length).toBe(0)
        })
      })
    })
  })
})
