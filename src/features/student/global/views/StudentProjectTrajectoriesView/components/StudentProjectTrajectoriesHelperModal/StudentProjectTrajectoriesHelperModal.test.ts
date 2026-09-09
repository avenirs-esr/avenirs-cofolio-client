import StudentProjectTrajectoriesHelperModal
  from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesHelperModal/StudentProjectTrajectoriesHelperModal.vue'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  AvModal: AvModalStub,
}

BddTest().given('the modal is shown with content', () => {
  let onClose: ReturnType<typeof vi.fn>
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
    onClose = vi.fn()
    const queryClient = new QueryClient()
    wrapper = mount(StudentProjectTrajectoriesHelperModal, {
      props: { opened: true, onClose },
      global: { stubs, plugins: [[VueQueryPlugin, { queryClient }]] }
    })
  })

  BddTest().when('the modal emits a close event', () => {
    beforeEach(() => {
      wrapper.findComponent(AvModalStub).vm.$emit('close')
    })

    BddTest().then('the onClose callback should be triggered', () => {
      expect(onClose).toHaveBeenCalled()
    })
  })

  BddTest().when('closeButtonLabel is passed as a prop', () => {
    const closeButtonLabel = 'Close Now'

    beforeEach(async () => {
      await wrapper.setProps({ closeButtonLabel })
    })

    BddTest().then('the label should be passed down to the AvModal component', () => {
      const avModal = wrapper.findComponent(AvModalStub)
      expect(avModal.props('closeButtonLabel')).toBe(closeButtonLabel)
    })
  })

  BddTest().when('opened prop changes', () => {
    BddTest().then('the modal should be opened when opened is true', () => {
      expect(wrapper.findComponent(AvModalStub).props('opened')).toBe(true)
    })

    BddTest().then('the modal should not be opened when opened is false', async () => {
      await wrapper.setProps({ opened: false })
      expect(wrapper.findComponent(AvModalStub).props('opened')).toBe(false)
    })
  })
})
