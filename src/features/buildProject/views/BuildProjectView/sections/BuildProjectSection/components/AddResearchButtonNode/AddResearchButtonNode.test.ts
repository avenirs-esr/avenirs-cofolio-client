import type { ButtonNodeTemplateProps } from '@/common/components/VueFlow/ButtonNodeTemplate/ButtonNodeTemplate.vue'
import { ButtonNodeTemplateStub } from '@/common/components/VueFlow/ButtonNodeTemplate/ButtonNodeTemplate.stub'
import { GLOBAL_NODE_HANDLES } from '@/common/components/VueFlow/global-nodes.types'
import { mandatoryNodeButtonTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import AddResearchButtonNode from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddResearchButtonNode/AddResearchButtonNode.vue'
import { RESEARCHS_NODE_TYPES } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/researchs-nodes.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

const mockAddNode = vi.fn()

vi.mock('@/common/composables/VueFlow/use-nodes/use-nodes', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/VueFlow/use-nodes/use-nodes')>()
  return {
    ...actual,
    useNodes: () => ({
      addNode: mockAddNode,
    }),
  }
})

BddTest().given('an AddResearchButtonNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddResearchButtonNode>>
  const stubs = { ButtonNodeTemplate: ButtonNodeTemplateStub }

  BddTest().when('the component is mounted', () => {
    const props: ButtonNodeTemplateProps = { ...mandatoryNodeButtonTemplateProps }

    beforeEach(() => {
      wrapper = mount(AddResearchButtonNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the ButtonNodeTemplate component', () => {
      const buttonNodeTemplate = wrapper.findComponent(ButtonNodeTemplateStub)
      expect(buttonNodeTemplate.exists()).toBe(true)
    })

    BddTest().when('the button is clicked', () => {
      beforeEach(() => {
        const buttonNodeTemplate = wrapper.findComponent(ButtonNodeTemplateStub)
        buttonNodeTemplate.vm.$emit('click')
      })

      BddTest().then('it should call the addNode function with the correct parameters', () => {
        expect(mockAddNode).toHaveBeenCalled()
        const addedNode = mockAddNode.mock.calls[0][0]
        expect(addedNode.id).toMatch(/^research-/)
        expect(addedNode.type).toBe(RESEARCHS_NODE_TYPES.RESEARCH)
        expect(addedNode.position).toHaveProperty('x')
        expect(addedNode.position).toHaveProperty('y')
        expect(addedNode.data).toBeDefined()
        expect(addedNode.data.title).toMatch(/Fiche/)
        expect(addedNode.data.description).toMatch(/Description/)
        expect(addedNode.data.left).toBe(true)
        expect(addedNode.parentId).toBe(props.id)
        expect(addedNode.parentHandle).toBe(GLOBAL_NODE_HANDLES.RIGHT)
      })
    })
  })
})
