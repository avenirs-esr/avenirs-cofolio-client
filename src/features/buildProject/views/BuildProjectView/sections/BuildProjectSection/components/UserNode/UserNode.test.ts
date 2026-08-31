import type { NodeProps } from '@vue-flow/core'
import type { VueWrapper } from '@vue/test-utils'
import { HandleStub, mandatoryNodeProps } from '@/common/utils/vue-flow/vue-flow-test'
import UserNode from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/UserNode/UserNode.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a UserNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserNode>>
  const stubs = {
    Handle: HandleStub,
  }

  BddTest().and('the component is mounted', () => {
    const props: NodeProps = { ...mandatoryNodeProps }

    beforeEach(() => {
      wrapper = mountComponent(UserNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the profile picture', async () => {
      await vi.waitFor(() => {
        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)
        expect(img.attributes('src')).toBeDefined()
      })
    })

    BddTest().then('it should render the handles', () => {
      const handles = wrapper.findAllComponents(HandleStub)
      expect(handles.length).toBe(4)
    })
  })
})
