import { ActivityAssociateElementsDropdownStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/ActivityAssociateElementsDropdown/ActivityAssociateElementsDropdown.stub'
import { DeleteActivityAssociatedElementsDropdownStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/DeleteActivityAssociatedElementsDropdown/DeleteActivityAssociatedElementsDropdown.stub'
import {
  AssociateTracesModalStub
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/AssociateTracesModal/AssociateTracesModal.stub'
import { DeleteActivityAssociatedSkillsModalStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedSkillsModal/DeleteActivityAssociatedSkillsModal.stub'
import { DeleteActivityAssociatedTracesModalStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedTracesModal/DeleteActivityAssociatedTracesModal.stub'
import AssociatedElementsTab from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/AssociatedElementsTab/AssociatedElementsTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associated elements tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedElementsTab>>

  const stubs = {
    DeleteActivityAssociatedElementsDropdown: DeleteActivityAssociatedElementsDropdownStub,
    ActivityAssociateElementsDropdown: ActivityAssociateElementsDropdownStub,
    DeleteActivityAssociatedSkillsModal: DeleteActivityAssociatedSkillsModalStub,
    DeleteActivityAssociatedTracesModal: DeleteActivityAssociatedTracesModalStub,
    AssociateTracesModal: AssociateTracesModalStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(AssociatedElementsTab, { global: { stubs } })
    })

    BddTest().then('it should render the delete associated elements dropdown', () => {
      const dropdown = wrapper.findComponent(DeleteActivityAssociatedElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the associate elements dropdown', () => {
      const dropdown = wrapper.findComponent(ActivityAssociateElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the delete associated skills modal in hidden state', () => {
      const skillsModal = wrapper.findComponent(DeleteActivityAssociatedSkillsModalStub)
      expect(skillsModal.exists()).toBe(true)
      expect(skillsModal.props('show')).toBe(false)
    })

    BddTest().then('it should render the delete activity associated traces modal in hidden state', () => {
      const tracesModal = wrapper.findComponent(DeleteActivityAssociatedTracesModalStub)
      expect(tracesModal.exists()).toBe(true)
      expect(tracesModal.props('show')).toBe(false)
    })

    BddTest().then('it should render the associate traces modal in hidden state', () => {
      const associateTracesModal = wrapper.findComponent(AssociateTracesModalStub)
      expect(associateTracesModal.exists()).toBe(true)
      expect(associateTracesModal.props('show')).toBe(false)
    })

    BddTest().and('the user selects skills to delete from the dropdown', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(DeleteActivityAssociatedElementsDropdownStub)
        dropdown.vm.$emit('skillsSelected')
      })

      BddTest().then('the delete associated skills modal should be shown', () => {
        const skillsModal = wrapper.findComponent(DeleteActivityAssociatedSkillsModalStub)
        expect(skillsModal.props('show')).toBe(true)
      })

      BddTest().and('the user selects cancel from the delete associated skills modal', () => {
        beforeEach(() => {
          const skillsModal = wrapper.findComponent(DeleteActivityAssociatedSkillsModalStub)
          skillsModal.vm.$emit('cancel')
        })

        BddTest().then('the delete associated skills modal should be hidden', () => {
          const skillsModal = wrapper.findComponent(DeleteActivityAssociatedSkillsModalStub)
          expect(skillsModal.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms delete from the delete associated skills modal', () => {
        beforeEach(() => {
          const skillsModal = wrapper.findComponent(DeleteActivityAssociatedSkillsModalStub)
          skillsModal.vm.$emit('deleted')
        })

        BddTest().then('the delete associated skills modal should be hidden', () => {
          const skillsModal = wrapper.findComponent(DeleteActivityAssociatedSkillsModalStub)
          expect(skillsModal.props('show')).toBe(false)
        })
      })
    })

    BddTest().and('the user selects traces to delete from the dropdown', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(DeleteActivityAssociatedElementsDropdownStub)
        dropdown.vm.$emit('tracesSelected')
      })

      BddTest().then('the delete activity associated traces modal should be shown', () => {
        const tracesModal = wrapper.findComponent(DeleteActivityAssociatedTracesModalStub)
        expect(tracesModal.props('show')).toBe(true)
      })

      BddTest().and('the user selects cancel from the delete activity associated traces modal', () => {
        beforeEach(() => {
          const tracesModal = wrapper.findComponent(DeleteActivityAssociatedTracesModalStub)
          tracesModal.vm.$emit('cancel')
        })

        BddTest().then('the delete activity associated traces modal should be hidden', () => {
          const tracesModal = wrapper.findComponent(DeleteActivityAssociatedTracesModalStub)
          expect(tracesModal.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms delete from the delete activity associated traces modal', () => {
        beforeEach(() => {
          const tracesModal = wrapper.findComponent(DeleteActivityAssociatedTracesModalStub)
          tracesModal.vm.$emit('deleted')
        })

        BddTest().then('the delete activity associated traces modal should be hidden', () => {
          const tracesModal = wrapper.findComponent(DeleteActivityAssociatedTracesModalStub)
          expect(tracesModal.props('show')).toBe(false)
        })
      })
    })

    BddTest().and('the user selects traces to associate from the associate dropdown', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(ActivityAssociateElementsDropdownStub)
        dropdown.vm.$emit('tracesSelected')
      })

      BddTest().then('the associate traces modal should be shown', () => {
        const associateTracesModal = wrapper.findComponent(AssociateTracesModalStub)
        expect(associateTracesModal.props('show')).toBe(true)
      })

      BddTest().and('the user selects cancel from the associate traces modal', () => {
        beforeEach(() => {
          const associateTracesModal = wrapper.findComponent(AssociateTracesModalStub)
          associateTracesModal.vm.$emit('cancel')
        })

        BddTest().then('the associate traces modal should be hidden', () => {
          const associateTracesModal = wrapper.findComponent(AssociateTracesModalStub)
          expect(associateTracesModal.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms associate from the associate traces modal', () => {
        beforeEach(() => {
          const associateTracesModal = wrapper.findComponent(AssociateTracesModalStub)
          associateTracesModal.vm.$emit('associate')
        })

        BddTest().then('the associate traces modal should be hidden', () => {
          const associateTracesModal = wrapper.findComponent(AssociateTracesModalStub)
          expect(associateTracesModal.props('show')).toBe(false)
        })
      })
    })
  })
})
