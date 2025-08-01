import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import StudentProjectTrajectoriesBuildProjectSection from './StudentProjectTrajectoriesBuildProjectSection.vue'

describe('studentProjectTrajectoriesBuildProjectSection', () => {
  const stubs = {
    StudentProjectTrajectoriesHelperModal: {
      name: 'StudentProjectTrajectoriesHelperModal',
      props: ['showModal', 'onClose', 'trace'],
      template: '<div v-if="showModal" data-testid="student-project-trajectories-helper-modal">StudentProjectTrajectoriesHelperModal</div>',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('given a build project section component', () => {
    let wrapper: ReturnType<typeof mount<typeof StudentProjectTrajectoriesBuildProjectSection>>

    beforeEach(() => {
      wrapper = mount<typeof StudentProjectTrajectoriesBuildProjectSection>(StudentProjectTrajectoriesBuildProjectSection, {
        global: {
          stubs,
        },
      })
    })

    describe('when the build project section is mounted', () => {
      it('then it should render the build project title', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.exists()).toBe(true)
        expect(titleElement.text()).toBe('Bâtir mon projet')
      })

      it('then it should have the correct CSS class', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.classes()).toContain('b1-bold')
      })

      it('then it should render the help button with label and icon', () => {
        const button = wrapper.find('button')
        expect(button.exists()).toBe(true)
        expect(button.text()).toBe('Comment construire mon projet ?')
      })
    })

    describe('when the help button is clicked', () => {
      beforeEach(async () => {
        await wrapper.find('button').trigger('click')
      })

      it('then the helper modal should be visible', () => {
        expect(wrapper.find('[data-testid="student-project-trajectories-helper-modal"]').exists()).toBe(true)
      })

      it('then clicking on modal close button should hide the modal', async () => {
        await wrapper.findComponent({ name: 'StudentProjectTrajectoriesHelperModal' }).vm.onClose()
        await wrapper.vm.$nextTick()
        expect(wrapper.find('[data-testid="student-project-trajectories-helper-modal"]').exists()).toBe(false)
      })
    })
  })
})
