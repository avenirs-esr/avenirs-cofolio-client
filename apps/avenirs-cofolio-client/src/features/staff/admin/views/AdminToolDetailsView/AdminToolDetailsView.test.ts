import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import AdminToolDetailsView from '@/features/staff/admin/views/AdminToolDetailsView/AdminToolDetailsView.vue'

BddTest().given('an admin tool details view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminToolDetailsView>>

  const mountWith = () => {
    wrapper = mount(AdminToolDetailsView)
  }

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('the wrapper should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
