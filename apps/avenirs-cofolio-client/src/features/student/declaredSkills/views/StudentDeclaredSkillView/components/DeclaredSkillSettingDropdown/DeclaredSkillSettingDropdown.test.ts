import type { VueWrapper } from '@vue/test-utils'
import type { DeclaredSkillSettingDropdownProps } from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillSettingDropdown/DeclaredSkillSettingDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ManageAssociableEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import DeclaredSkillSettingDropdown from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillSettingDropdown/DeclaredSkillSettingDropdown.vue'

BddTest().given('a declared skill setting popover', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredSkillSettingDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub,
    ManageAssociableEntityDropdown: ManageAssociableEntityDropdownStub
  }

  const skillId = 'declared-skill-progress-1'
  const getAssociateDropdown = () => wrapper.findComponent(ManageAssociableEntityDropdownStub)

  const mountWith = (props: Partial<DeclaredSkillSettingDropdownProps> = {}) => {
    wrapper = mount(DeclaredSkillSettingDropdown, {
      props: {
        elementId: skillId,
        hasAssociations: true,
        ...props

      },
      global: { stubs }
    })
  }

  beforeEach(() => {
    mountWith({ elementId: skillId, hasAssociations: true })
  })

  BddTest().then('it should forward context, element id and has-associations to the associable dropdown', () => {
    mountWith()
    const generic = getAssociateDropdown()
    expect(generic.props('contextType')).toBe(EAssociationContextType.DECLARED_SKILL)
    expect(generic.props('elementId')).toBe(skillId)
    expect(generic.props('hasAssociations')).toBe(true)
  })

  BddTest().when('the associate action is selected', () => {
    BddTest().then('it should not emit associate', async () => {
      const associateButton = wrapper.find(`[data-name="${Action.ASSOCIATE}"]`)
      await associateButton.trigger('click')
      expect(wrapper.emitted('associate')).toBeUndefined()
      expect(wrapper.emitted(Action.ASSOCIATE)).toBeUndefined()
    })
  })

  BddTest().when('the dissociate action is selected', () => {
    BddTest().then('it should not emit dissociate', async () => {
      const dissociateButton = wrapper.find(`[data-name="${Action.DISSOCIATE}"]`)
      await dissociateButton.trigger('click')
      expect(wrapper.emitted('dissociate')).toBeUndefined()
      expect(wrapper.emitted(Action.DISSOCIATE)).toBeUndefined()
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the dropdown with two menu items', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(4)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.props('items')).toHaveLength(4)
      expect(dropdown.props('triggerAriaLabel')).toBe('Gérer ma compétence')
      expect(dropdown.props('triggerLabel')).toBe('Gérer ma compétence')
    })
  })

  BddTest().when('the update button is clicked', () => {
    BddTest().then('it should emit the update  event', async () => {
      const updateButton = wrapper.find('[data-name="update"]')
      await updateButton.trigger('click')
      expect(wrapper.emitted('update')).toHaveLength(1)
    })
  })

  BddTest().when('the delete button is clicked', () => {
    BddTest().then('it should emit the delete event', async () => {
      const deleteButton = wrapper.find('[data-name="delete"]')
      await deleteButton.trigger('click')
      expect(wrapper.emitted('delete')).toHaveLength(1)
    })
  })
})
