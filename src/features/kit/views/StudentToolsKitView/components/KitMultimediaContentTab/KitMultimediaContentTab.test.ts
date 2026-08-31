import type { VueWrapper } from '@vue/test-utils'
import KitMultimediaContentTab from '@/features/kit/views/StudentToolsKitView/components/KitMultimediaContentTab/KitMultimediaContentTab.vue'
import { ValorizedAssociatedTracesContainerStub } from '@/features/kit/views/StudentToolsKitView/components/ValorizedAssociatedTracesContainer/ValorizedAssociatedTracesContainer.stub'
import { ValorizedNonAssociatedTracesContainerStub } from '@/features/kit/views/StudentToolsKitView/components/ValorizedNonAssociatedTracesContainer/ValorizedNonAssociatedTracesContainer.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a kit multimedia content tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof KitMultimediaContentTab>>

  const stubs = {
    ValorizedAssociatedTracesContainer: ValorizedAssociatedTracesContainerStub,
    ValorizedNonAssociatedTracesContainer: ValorizedNonAssociatedTracesContainerStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(KitMultimediaContentTab, { global: { stubs } })
    })

    BddTest().then('it should display the valorized associated and non associated traces containers', () => {
      expect(wrapper.findComponent(ValorizedAssociatedTracesContainerStub).exists()).toBe(true)
      expect(wrapper.findComponent(ValorizedNonAssociatedTracesContainerStub).exists()).toBe(true)
    })
  })
})
