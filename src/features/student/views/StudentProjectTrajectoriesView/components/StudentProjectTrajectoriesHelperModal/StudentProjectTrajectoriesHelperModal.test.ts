import StudentProjectTrajectoriesHelperModal
  from '@/features/student/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesHelperModal/StudentProjectTrajectoriesHelperModal.vue'
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

const onClose = vi.fn()
let wrapper: VueWrapper

beforeEach(() => {
  vi.clearAllMocks()
  wrapper = mount(StudentProjectTrajectoriesHelperModal, {
    props: { showModal: true, onClose },
    global: { stubs }
  })
})

describe('given the modal is shown with content', () => {
  describe('when the component is mounted', () => {
    it('then the header should render HTML with formatted title', () => {
      const header = wrapper.find('.student-project-trajectories-helper-modal__header')
      expect(header.exists()).toBe(true)
      expect(header.html()).toContain('<strong')
    })

    it('then the content should render HTML with transformed structure', () => {
      const content = wrapper.find('.student-project-trajectories-helper-modal__content')
      expect(content.exists()).toBe(true)
      expect(content.html()).toContain('<li')
      expect(content.html()).toContain('<strong')
      expect(content.html()).toContain('<span')
      expect(content.html()).toContain('line-break')
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
})
