import { EAssociationContextType } from '@/api/avenir-esr'
import AssociationElementsDropdown, {
  type AssociationElementsDropdownProps
} from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import { ICONS } from '@/common/constants'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvDropdown: AvDropdownStub
}

function mountDropdown (props: AssociationElementsDropdownProps, attrs: Record<string, string> = {}) {
  return mountComponent(AssociationElementsDropdown, { props, attrs, global: { stubs } })
}

BddTest().given('an association elements dropdown', () => {
  let wrapper: ReturnType<typeof mountDropdown>

  BddTest().when('mounted in delete variant with several types', () => {
    beforeEach(() => {
      wrapper = mountDropdown({
        variant: 'delete',
        items: [
          { type: EAssociationContextType.DECLARED_ACTIVITY },
          { type: EAssociationContextType.DECLARED_SKILL },
          { type: EAssociationContextType.TRACE },
          { type: EAssociationContextType.DECLARED_EXPERIENCE },
        ]
      })
    })

    BddTest().then('it should render one menu item per given type, in the given order', () => {
      const items = wrapper.findComponent(AvDropdownStub).props('items')
      expect(items).toHaveLength(4)
      expect(items.map((item: { name: string }) => item.name))
        .toEqual(['activities', 'skills', 'traces', 'experiences'])
    })

    BddTest().then('it should map each type to its icon', () => {
      const items = wrapper.findComponent(AvDropdownStub).props('items')
      expect(items.map((item: { icon: string }) => item.icon))
        .toEqual([ICONS.ACTIVITY, ICONS.SKILLS, ICONS.TRACES, ICONS.EXPERIENCES])
    })

    BddTest().then('it should map each type to its translated label', () => {
      const items = wrapper.findComponent(AvDropdownStub).props('items')
      expect(items.map((item: { label: string }) => item.label)).toEqual([
        'une/des activité(s)',
        'une/des compétence(s)',
        'une/des trace(s)',
        'une/des expérience(s)',
      ])
    })

    BddTest().then('it should render the delete trigger', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      expect(dropdown.props('triggerLabel')).toBe('Supprimer...')
      expect(dropdown.props('triggerAriaLabel')).toBe('Supprimer...')
      expect(dropdown.props('triggerIcon')).toBe(MDI_ICONS.TRASH_CAN_OUTLINE)
      expect(dropdown.props('triggerVariant')).toBeUndefined()
    })

    BddTest().then('it should enable every item', () => {
      const items = wrapper.findComponent(AvDropdownStub).props('items')
      expect(items.every((item: { disabled: boolean }) => item.disabled === false)).toBe(true)
    })

    BddTest().and('an item is clicked', () => {
      BddTest().then('it should emit select with the matching association type', async () => {
        await wrapper.find('[data-name="skills"]').trigger('click')
        expect(wrapper.emitted('select')).toEqual([[EAssociationContextType.DECLARED_SKILL]])
      })
    })
  })

  BddTest().when('mounted in associate variant', () => {
    beforeEach(() => {
      wrapper = mountDropdown({
        variant: 'associate',
        items: [{ type: EAssociationContextType.TRACE }]
      })
    })

    BddTest().then('it should render the associate trigger', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      expect(dropdown.props('triggerLabel')).toBe('Associer...')
      expect(dropdown.props('triggerAriaLabel')).toBe('Associer...')
      expect(dropdown.props('triggerIcon')).toBe(ICONS.ASSOCIATED)
      expect(dropdown.props('triggerVariant')).toBe('FLAT')
    })
  })

  BddTest().when('mounted with a single disabled item', () => {
    beforeEach(() => {
      wrapper = mountDropdown({
        variant: 'delete',
        items: [
          { type: EAssociationContextType.DECLARED_ACTIVITY, disabled: true },
          { type: EAssociationContextType.DECLARED_SKILL },
        ]
      })
    })

    BddTest().then('it should disable only that item', () => {
      const items = wrapper.findComponent(AvDropdownStub).props('items')
      expect(items.map((item: { disabled: boolean }) => item.disabled)).toEqual([true, false])
    })
  })

  BddTest().when('mounted with the global disabled prop', () => {
    beforeEach(() => {
      wrapper = mountDropdown({
        variant: 'delete',
        disabled: true,
        items: [
          { type: EAssociationContextType.DECLARED_ACTIVITY },
          { type: EAssociationContextType.DECLARED_SKILL, disabled: false },
        ]
      })
    })

    BddTest().then('it should disable every item regardless of their own flag', () => {
      const items = wrapper.findComponent(AvDropdownStub).props('items')
      expect(items.every((item: { disabled: boolean }) => item.disabled)).toBe(true)
    })
  })

  BddTest().when('mounted with a data-testid provided by the parent', () => {
    beforeEach(() => {
      wrapper = mountDropdown(
        { variant: 'delete', items: [{ type: EAssociationContextType.TRACE }] },
        { 'data-testid': 'delete-declared-experience-associated-elements-dropdown' }
      )
    })

    BddTest().then('it should forward it to the dropdown', () => {
      expect(wrapper.find('[data-testid="delete-declared-experience-associated-elements-dropdown"]').exists()).toBe(true)
    })
  })
})
