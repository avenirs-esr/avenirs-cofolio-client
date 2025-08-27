import StudentProjectTrajectoriesHelperModal
  from '@/features/student/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesHelperModal/StudentProjectTrajectoriesHelperModal.vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const stubs = {
  AvModal: {
    name: 'AvModal',
    props: ['opened', 'closeButtonLabel'],
    emits: ['close'],
    template: '<div class="av-modal"><slot /></div>'
  }
}

describe('given the modal is shown with content', () => {
  let onClose: ReturnType<typeof vi.fn>
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
    onClose = vi.fn()
    const queryClient = new QueryClient()
    wrapper = mount(StudentProjectTrajectoriesHelperModal, {
      props: { showModal: true, onClose },
      global: { stubs, plugins: [[VueQueryPlugin, { queryClient }]] }
    })
  })

  describe('when the modal emits a close event', () => {
    beforeEach(() => {
      wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
    })

    it('then the onClose callback should be triggered', () => {
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('when closeButtonLabel is passed as a prop', () => {
    const closeButtonLabel = 'Close Now'

    beforeEach(async () => {
      await wrapper.setProps({ closeButtonLabel })
    })

    it('then the label should be passed down to the AvModal component', () => {
      const avModal = wrapper.findComponent({ name: 'AvModal' })
      expect(avModal.props('closeButtonLabel')).toBe(closeButtonLabel)
    })
  })

  describe('when showModal prop changes', () => {
    it('then the modal should be opened when showModal is true', () => {
      expect(wrapper.findComponent({ name: 'AvModal' }).props('opened')).toBe(true)
    })

    it('then the modal should not be opened when showModal is false', async () => {
      await wrapper.setProps({ showModal: false })
      expect(wrapper.findComponent({ name: 'AvModal' }).props('opened')).toBe(false)
    })
  })
})
