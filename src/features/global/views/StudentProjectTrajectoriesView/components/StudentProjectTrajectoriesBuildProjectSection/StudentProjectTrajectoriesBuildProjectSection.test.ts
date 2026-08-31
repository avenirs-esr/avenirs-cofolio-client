import StudentProjectTrajectoriesBuildProjectSection from '@/features/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesBuildProjectSection/StudentProjectTrajectoriesBuildProjectSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a build project section component', () => {
  let wrapper: ReturnType<typeof mount<typeof StudentProjectTrajectoriesBuildProjectSection>>

  const MindMapStub = {
    name: 'MindMap',
    template: '<div data-testid="mind-map" />',
  }

  const stubs = {
    MindMap: MindMapStub,
    StudentProjectTrajectoriesHelperModal: {
      name: 'StudentProjectTrajectoriesHelperModal',
      props: ['showModal', 'onClose', 'trace'],
      template: '<div v-if="showModal" data-testid="student-project-trajectories-helper-modal">StudentProjectTrajectoriesHelperModal</div>',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentProjectTrajectoriesBuildProjectSection, {
      global: { stubs },
    })
  })

  BddTest().when('the build project section is mounted', () => {
    BddTest().then('it should render the build project title', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.exists()).toBe(true)
      expect(titleElement.text()).toBe('Bâtir mon projet')
    })

    BddTest().then('it should render the mind map component', () => {
      const mindMap = wrapper.findComponent(MindMapStub)
      expect(mindMap.exists()).toBe(true)
    })

    BddTest().then('it should have the correct CSS class', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.classes()).toContain('b1-bold')
    })

    BddTest().then('it should render the help button with label and icon', () => {
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('Comment construire mon projet ?')
    })
  })

  BddTest().when('the help button is clicked', () => {
    beforeEach(async () => {
      await wrapper.find('button').trigger('click')
    })

    BddTest().then('the helper modal should be visible', () => {
      expect(wrapper.find('[data-testid="student-project-trajectories-helper-modal"]').exists()).toBe(true)
    })

    BddTest().then('clicking on modal close button should hide the modal', async () => {
      await wrapper.findComponent({ name: 'StudentProjectTrajectoriesHelperModal' }).vm.onClose()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="student-project-trajectories-helper-modal"]').exists()).toBe(false)
    })
  })
})
