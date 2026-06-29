import { mockedDeclaredActivityAssociations } from '@/__mocks__/fixtures/student/activities.fixtures'
import { AssociatedTracesCardStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.stub'
import {
  AssociateDeclaredSkillsToActivityModalStub
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/modals/AssociateDeclaredSkillToActivityModal/AssociateDeclaredSkillToActivityModal.stub'
import { ActivityAssociateElementsDropdownStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/ActivityAssociateElementsDropdown/ActivityAssociateElementsDropdown.stub'
import { DeleteActivityAssociatedElementsDropdownStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/DeleteActivityAssociatedElementsDropdown/DeleteActivityAssociatedElementsDropdown.stub'
import {
  AssociateTracesModalStub
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/AssociateTracesModal/AssociateTracesModal.stub'
import { DeleteActivityAssociatedElementsModalStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedElementsModal/DeleteActivityAssociatedElementsModal.stub'
import AssociatedElementsTab, { type AssociatedElementsTabProps } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/AssociatedElementsTab/AssociatedElementsTab.vue'
import {
  AssociatedDeclaredSkillsCardStub
} from '@/features/student/declaredSkills/components/cards/AssociatedDeclaredSkillsCard/AssociatedDeclaredSkillsCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associated elements tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedElementsTab>>

  const getDeleteSkillsModal = () => wrapper.findAllComponents(DeleteActivityAssociatedElementsModalStub)
    .find(modal => modal.attributes('data-testid') === 'delete-activity-associated-skills-modal')
  const getDeleteTracesModal = () => wrapper.findAllComponents(DeleteActivityAssociatedElementsModalStub)
    .find(modal => modal.attributes('data-testid') === 'delete-activity-associated-traces-modal')

  const stubs = {
    DeleteActivityAssociatedElementsDropdown: DeleteActivityAssociatedElementsDropdownStub,
    ActivityAssociateElementsDropdown: ActivityAssociateElementsDropdownStub,
    DeleteActivityAssociatedElementsModal: DeleteActivityAssociatedElementsModalStub,
    AssociateTracesModal: AssociateTracesModalStub,
    AssociatedTracesCard: AssociatedTracesCardStub,
    AssociateDeclaredSkillToActivityModal: AssociateDeclaredSkillsToActivityModalStub,
    AssociatedDeclaredSkillsCard: AssociatedDeclaredSkillsCardStub
  }

  BddTest().when('the component is mounted with associations and traceAssociationsEnabled not set', () => {
    const props: AssociatedElementsTabProps = {
      associations: mockedDeclaredActivityAssociations,
      declaredActivityId: 'declared-activity-1',
      countAssociations: 9
    }

    beforeEach(() => {
      wrapper = mount(AssociatedElementsTab, { props, global: { stubs } })
    })

    BddTest().then('it should render the delete associated elements dropdown', () => {
      const dropdown = wrapper.findComponent(DeleteActivityAssociatedElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the associate elements dropdown', () => {
      const dropdown = wrapper.findComponent(ActivityAssociateElementsDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should pass tracesDisabled as false to the associate elements dropdown when traceAssociationsDisabled is not set', () => {
      const dropdown = wrapper.findComponent(ActivityAssociateElementsDropdownStub)
      expect(dropdown.props('tracesDisabled')).toBe(false)
    })

    BddTest().then('it should render the associated declared skills card', () => {
      const associatedDeclaredSkillsCard = wrapper.findComponent(AssociatedDeclaredSkillsCardStub)
      expect(associatedDeclaredSkillsCard.exists()).toBe(true)
      expect(associatedDeclaredSkillsCard.props('associatedDeclaredSkills'))
        .toEqual(props.associations.declaredSkillAssociations)
    })

    BddTest().then('it should render the associated traces card', () => {
      const associatedTracesCard = wrapper.findComponent(AssociatedTracesCardStub)
      expect(associatedTracesCard.exists()).toBe(true)
      expect(associatedTracesCard.props('associatedTraces'))
        .toEqual(props.associations.traceAssociations)
    })

    BddTest().then('it should render the delete associated skills modal in hidden state', () => {
      const skillsModal = getDeleteSkillsModal()
      expect(skillsModal!.exists()).toBe(true)
      expect(skillsModal!.props('show')).toBe(false)
    })

    BddTest().then('it should render the delete activity associated traces modal in hidden state', () => {
      const tracesModal = getDeleteTracesModal()
      expect(tracesModal!.exists()).toBe(true)
      expect(tracesModal!.props('show')).toBe(false)
    })

    BddTest().then('it should pass an array of { id, title } to delete activity associated traces modal', () => {
      const modal = getDeleteTracesModal()

      expect(modal!.props('associations')).toEqual(
        mockedDeclaredActivityAssociations.traceAssociations.map(association => ({
          id: association.associationId,
          title: association.trace.title
        }))
      )
    })

    BddTest().then('it should pass declaredActivityId to delete activity associated traces modal', () => {
      const modal = getDeleteTracesModal()
      expect(modal!.props('declaredActivityId')).toBe(props.declaredActivityId)
    })

    BddTest().then('it should render the associate traces modal in hidden state', () => {
      const associateTracesModal = wrapper.findComponent(AssociateTracesModalStub)
      expect(associateTracesModal.exists()).toBe(true)
      expect(associateTracesModal.props('show')).toBe(false)
    })

    BddTest().then('it should render the associate skills modal in hidden state', () => {
      const associateSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToActivityModalStub)
      expect(associateSkillsModal.exists()).toBe(true)
      expect(associateSkillsModal.props('show')).toBe(false)
    })

    BddTest().then('it should pass declaredActivityId to associate modals', () => {
      const associateTracesModal = wrapper.findComponent(AssociateTracesModalStub)
      const associateDeclaredSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToActivityModalStub)
      expect(associateTracesModal.props('declaredActivityId')).toBe(props.declaredActivityId)
      expect(associateDeclaredSkillsModal.props('activityId')).toBe(props.declaredActivityId)
    })

    BddTest().and('the user selects skills to delete from the dropdown', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(DeleteActivityAssociatedElementsDropdownStub)
        dropdown.vm.$emit('skillsSelected')
      })

      BddTest().then('the delete associated skills modal should be shown', () => {
        const skillsModal = getDeleteSkillsModal()
        expect(skillsModal!.props('show')).toBe(true)
      })

      BddTest().and('the user selects cancel from the delete associated skills modal', () => {
        beforeEach(() => {
          const skillsModal = getDeleteSkillsModal()
          skillsModal!.vm.$emit('cancel')
        })

        BddTest().then('the delete associated skills modal should be hidden', () => {
          const skillsModal = getDeleteSkillsModal()
          expect(skillsModal!.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms delete from the delete associated skills modal', () => {
        beforeEach(() => {
          const skillsModal = getDeleteSkillsModal()
          skillsModal!.vm.$emit('deleted')
        })

        BddTest().then('the delete associated skills modal should be hidden', () => {
          const skillsModal = getDeleteSkillsModal()
          expect(skillsModal!.props('show')).toBe(false)
        })
      })
    })

    BddTest().and('the user selects traces to delete from the dropdown', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(DeleteActivityAssociatedElementsDropdownStub)
        dropdown.vm.$emit('tracesSelected')
      })

      BddTest().then('the delete activity associated traces modal should be shown', () => {
        const tracesModal = getDeleteTracesModal()
        expect(tracesModal!.props('show')).toBe(true)
        expect(tracesModal!.props('declaredActivityId')).toBe(props.declaredActivityId)
      })

      BddTest().and('the user selects cancel from the delete activity associated traces modal', () => {
        beforeEach(() => {
          const tracesModal = getDeleteTracesModal()
          tracesModal!.vm.$emit('cancel')
        })

        BddTest().then('the delete activity associated traces modal should be hidden', () => {
          const tracesModal = getDeleteTracesModal()
          expect(tracesModal!.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms delete from the delete activity associated traces modal', () => {
        beforeEach(() => {
          const tracesModal = getDeleteTracesModal()
          tracesModal!.vm.$emit('deleted')
        })

        BddTest().then('the delete activity associated traces modal should be hidden', () => {
          const tracesModal = getDeleteTracesModal()
          expect(tracesModal!.props('show')).toBe(false)
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
        expect(associateTracesModal.props('declaredActivityId')).toBe(props.declaredActivityId)
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
          associateTracesModal.vm.$emit('associated')
        })

        BddTest().then('the associate traces modal should be hidden', () => {
          const associateTracesModal = wrapper.findComponent(AssociateTracesModalStub)
          expect(associateTracesModal.props('show')).toBe(false)
        })
      })
    })

    BddTest().and('the user selects skills to associate from the associate dropdown', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(ActivityAssociateElementsDropdownStub)
        dropdown.vm.$emit('skillsSelected')
      })

      BddTest().then('the associate skills modal should be shown', () => {
        const associateSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToActivityModalStub)
        expect(associateSkillsModal.props('show')).toBe(true)
        expect(associateSkillsModal.props('activityId')).toBe(props.declaredActivityId)
      })

      BddTest().and('the user selects cancel from the associate skills modal', () => {
        beforeEach(() => {
          const associateSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToActivityModalStub)
          associateSkillsModal.vm.$emit('cancel')
        })

        BddTest().then('the associate traces modal should be hidden', () => {
          const associateSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToActivityModalStub)
          expect(associateSkillsModal.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms associate from the associate traces modal', () => {
        beforeEach(() => {
          const associateSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToActivityModalStub)
          associateSkillsModal.vm.$emit('associated')
        })

        BddTest().then('the associate traces modal should be hidden', () => {
          const associateSkillsModal = wrapper.findComponent(AssociateDeclaredSkillsToActivityModalStub)
          expect(associateSkillsModal.props('show')).toBe(false)
        })
      })
    })
  })

  BddTest().when('the component is mounted with traceAssociationsDisabled set to false', () => {
    const props: AssociatedElementsTabProps = {
      associations: mockedDeclaredActivityAssociations,
      declaredActivityId: 'declared-activity-1',
      countAssociations: 9,
      traceAssociationsDisabled: false
    }

    beforeEach(() => {
      wrapper = mount(AssociatedElementsTab, { props, global: { stubs } })
    })

    BddTest().then('it should pass tracesDisabled as false to the associate elements dropdown', () => {
      const dropdown = wrapper.findComponent(ActivityAssociateElementsDropdownStub)
      expect(dropdown.props('tracesDisabled')).toBe(false)
    })
  })

  BddTest().when('the component is mounted with traceAssociationsDisabled set to false', () => {
    const props: AssociatedElementsTabProps = {
      associations: mockedDeclaredActivityAssociations,
      declaredActivityId: 'declared-activity-1',
      countAssociations: 9,
      traceAssociationsDisabled: true
    }

    beforeEach(() => {
      wrapper = mount(AssociatedElementsTab, { props, global: { stubs } })
    })

    BddTest().then('it should pass tracesDisabled as true to the associate elements dropdown', () => {
      const dropdown = wrapper.findComponent(ActivityAssociateElementsDropdownStub)
      expect(dropdown.props('tracesDisabled')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with maxTraceAssociationsReached set to true', () => {
    const props: AssociatedElementsTabProps = {
      associations: mockedDeclaredActivityAssociations,
      declaredActivityId: 'declared-activity-1',
      countAssociations: 9,
      traceAssociationsDisabled: false,
      maxTraceAssociationsReached: true
    }

    beforeEach(() => {
      wrapper = mount(AssociatedElementsTab, { props, global: { stubs } })
    })

    BddTest().then('it should pass tracesDisabled as true to the associate elements dropdown', () => {
      const dropdown = wrapper.findComponent(ActivityAssociateElementsDropdownStub)
      expect(dropdown.props('tracesDisabled')).toBe(true)
    })

    BddTest().then('it should render the max trace associations reached message', () => {
      const message = wrapper.find('[data-testid="max-trace-associations-reached"]')
      expect(message.exists()).toBe(true)
    })
  })
})
