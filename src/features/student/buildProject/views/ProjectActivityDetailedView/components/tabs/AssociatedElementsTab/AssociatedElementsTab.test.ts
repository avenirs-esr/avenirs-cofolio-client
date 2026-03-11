import { DeleteAssociatedElementsDropdownStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/DeleteAssociatedElementsDropdown/DeleteAssociatedElementsDropdown.stub'
import { DeleteAssociatedSkillsModalStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteAssociatedSkillsModal/DeleteAssociatedSkillsModal.stub'
import { DeleteAssociatedTracesModalStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteAssociatedTracesModal/DeleteAssociatedTracesModal.stub'
import AssociatedElementsTab from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/AssociatedElementsTab/AssociatedElementsTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associated elements tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedElementsTab>>

  const stubs = {
    DeleteAssociatedElementsDropdown: DeleteAssociatedElementsDropdownStub,
    DeleteAssociatedSkillsModal: DeleteAssociatedSkillsModalStub,
    DeleteAssociatedTracesModal: DeleteAssociatedTracesModalStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(AssociatedElementsTab, { global: { stubs } })
    })

    BddTest().then('it should render the delete associated elements dropdown', () => {
      const dropdown = wrapper.findComponent(DeleteAssociatedElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the delete associated skills modal in hidden state', () => {
      const skillsModal = wrapper.findComponent(DeleteAssociatedSkillsModalStub)
      expect(skillsModal.exists()).toBe(true)
      expect(skillsModal.props('show')).toBe(false)
    })

    BddTest().then('it should render the delete associated traces modal in hidden state', () => {
      const tracesModal = wrapper.findComponent(DeleteAssociatedTracesModalStub)
      expect(tracesModal.exists()).toBe(true)
      expect(tracesModal.props('show')).toBe(false)
    })

    BddTest().and('the user selects skills to delete from the dropdown', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(DeleteAssociatedElementsDropdownStub)
        dropdown.vm.$emit('skillsSelected')
      })

      BddTest().then('the delete associated skills modal should be shown', () => {
        const skillsModal = wrapper.findComponent(DeleteAssociatedSkillsModalStub)
        expect(skillsModal.props('show')).toBe(true)
      })

      BddTest().and('the user selects cancel from the delete associated skills modal', () => {
        beforeEach(() => {
          const skillsModal = wrapper.findComponent(DeleteAssociatedSkillsModalStub)
          skillsModal.vm.$emit('cancel')
        })

        BddTest().then('the delete associated skills modal should be hidden', () => {
          const skillsModal = wrapper.findComponent(DeleteAssociatedSkillsModalStub)
          expect(skillsModal.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms delete from the delete associated skills modal', () => {
        beforeEach(() => {
          const skillsModal = wrapper.findComponent(DeleteAssociatedSkillsModalStub)
          skillsModal.vm.$emit('deleted')
        })

        BddTest().then('the delete associated skills modal should be hidden', () => {
          const skillsModal = wrapper.findComponent(DeleteAssociatedSkillsModalStub)
          expect(skillsModal.props('show')).toBe(false)
        })
      })
    })

    BddTest().and('the user selects traces to delete from the dropdown', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(DeleteAssociatedElementsDropdownStub)
        dropdown.vm.$emit('tracesSelected')
      })

      BddTest().then('the delete associated traces modal should be shown', () => {
        const tracesModal = wrapper.findComponent(DeleteAssociatedTracesModalStub)
        expect(tracesModal.props('show')).toBe(true)
      })

      BddTest().and('the user selects cancel from the delete associated traces modal', () => {
        beforeEach(() => {
          const tracesModal = wrapper.findComponent(DeleteAssociatedTracesModalStub)
          tracesModal.vm.$emit('cancel')
        })

        BddTest().then('the delete associated traces modal should be hidden', () => {
          const tracesModal = wrapper.findComponent(DeleteAssociatedTracesModalStub)
          expect(tracesModal.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms delete from the delete associated traces modal', () => {
        beforeEach(() => {
          const tracesModal = wrapper.findComponent(DeleteAssociatedTracesModalStub)
          tracesModal.vm.$emit('deleted')
        })

        BddTest().then('the delete associated traces modal should be hidden', () => {
          const tracesModal = wrapper.findComponent(DeleteAssociatedTracesModalStub)
          expect(tracesModal.props('show')).toBe(false)
        })
      })
    })
  })
})
