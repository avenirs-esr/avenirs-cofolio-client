import type { VueWrapper } from '@vue/test-utils'
import KitTextContentTab from '@/features/student/kit/views/StudentToolsKitView/components/KitTextContentTab/KitTextContentTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a kit text content tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof KitTextContentTab>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(KitTextContentTab)
    })

    BddTest().then('it should display the placeholder text', () => {
      expect(wrapper.text()).toContain('Placeholder - TODO in one of them #1307 #1308 #1314 #1310 #1995 #1925 #1926')
    })
  })
})
