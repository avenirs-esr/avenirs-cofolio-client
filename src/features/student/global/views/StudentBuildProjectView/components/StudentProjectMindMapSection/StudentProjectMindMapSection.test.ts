import { MindMapStub } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/MindMap.stub'
import { StudentProjectMindMapHelperModalStub } from '@/features/student/global/views/StudentBuildProjectView/components/StudentProjectMindMapHelperModal/StudentProjectMindMapHelperModal.stub'
import StudentProjectMindMapSection from '@/features/student/global/views/StudentBuildProjectView/components/StudentProjectMindMapSection/StudentProjectMindMapSection.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a build project section component', () => {
  let wrapper: ReturnType<typeof mount<typeof StudentProjectMindMapSection>>

  const stubs = {
    AvIconText: AvIconTextStub,
    MindMap: MindMapStub,
    StudentProjectMindMapHelperModal: StudentProjectMindMapHelperModalStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentProjectMindMapSection, {
      global: { stubs },
    })
  })

  BddTest().when('the build project section is mounted', () => {
    BddTest().then('it should render the build project title', () => {
      const avIconText = wrapper.findComponent(AvIconTextStub)
      expect(avIconText.exists()).toBe(true)
      expect(avIconText.props('text')).toBe('Ma carte mentale')
    })

    BddTest().then('it should render the mind map component', () => {
      const mindMap = wrapper.findComponent(MindMapStub)
      expect(mindMap.exists()).toBe(true)
    })

    BddTest().then('it should render the help button with label and icon', () => {
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('Comment construire ma carte mentale\u00A0?')
    })
  })

  BddTest().when('the help button is clicked', () => {
    beforeEach(async () => {
      await wrapper.find('button').trigger('click')
    })

    BddTest().then('the helper modal should be visible', () => {
      expect(wrapper.findComponent(StudentProjectMindMapHelperModalStub).props('opened')).toBe(true)
    })

    BddTest().then('clicking on modal close button should hide the modal', async () => {
      await wrapper.findComponent(StudentProjectMindMapHelperModalStub).vm.onClose()
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(StudentProjectMindMapHelperModalStub).props('opened')).toBe(false)
    })
  })
})
