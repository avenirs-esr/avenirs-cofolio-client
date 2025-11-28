import type { NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import type { VueWrapper } from '@vue/test-utils'
import { mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { NodeTemplateStub } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.stub'
import { mandatoryNodeTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import SelfKnowledgeCategoryNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/SelfKnowledgeCategoryNode/SelfKnowledgeCategoryNode.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a SelfKnowledgeCategoryNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeCategoryNode>>

  const stubs = {
    AvBadge: AvBadgeStub,
    NodeTemplate: NodeTemplateStub
  }

  BddTest().when('the component is mounted', () => {
    const props: NodeTemplateProps = { ...mandatoryNodeTemplateProps, id: mockedSelfKnowledgeCategories[0].id, data: {} }

    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeCategoryNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the NodeTemplate component', () => {
      const nodeTemplate = wrapper.findComponent(NodeTemplateStub)
      expect(nodeTemplate.exists()).toBe(true)
    })

    BddTest().then('it should render the badge with the correct label', async () => {
      await vi.waitFor(() => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.exists()).toBe(true)
        expect(badge.props('label')).toBe(mockedSelfKnowledgeCategories[0].title)
      })
    })
  })
})
