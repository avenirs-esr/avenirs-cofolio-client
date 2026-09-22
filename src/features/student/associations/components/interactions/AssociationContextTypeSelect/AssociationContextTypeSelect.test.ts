import { EAssociationContextType } from '@/api/avenir-esr'
import AssociationContextTypeSelect, {
  type AssociationContextTypeSelectProps
} from '@/features/student/associations/components/interactions/AssociationContextTypeSelect/AssociationContextTypeSelect.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvSelect: AvSelectStub
}

function mountSelect (props: AssociationContextTypeSelectProps & { modelValue: EAssociationContextType }) {
  return mountComponent(AssociationContextTypeSelect, { props, global: { stubs } })
}

BddTest().given('an association context type select', () => {
  let wrapper: ReturnType<typeof mountSelect>

  BddTest().when('the component is mounted with some context types', () => {
    beforeEach(() => {
      wrapper = mountSelect({
        contextTypes: [EAssociationContextType.DECLARED_SKILL, EAssociationContextType.DECLARED_ACTIVITY],
        modelValue: EAssociationContextType.DECLARED_SKILL
      })
    })

    BddTest().then('it should render the select with its translated label and placeholder', () => {
      const select = wrapper.findComponent(AvSelectStub)

      expect(select.exists()).toBe(true)
      expect(select.props('label')).toBe('Rechercher dans :')
      expect(select.props('placeholder')).toBe('Sélectionnez un type')
    })

    BddTest().then('it should map each context type to an option, in the given order', () => {
      expect(wrapper.findComponent(AvSelectStub).props('options')).toEqual([
        { id: EAssociationContextType.DECLARED_SKILL, label: 'Mes compétences' },
        { id: EAssociationContextType.DECLARED_ACTIVITY, label: 'Mes activités' }
      ])
    })

    BddTest().then('it should select the context type of the model', () => {
      expect(wrapper.findComponent(AvSelectStub).props('selectedItem')).toEqual({
        itemId: EAssociationContextType.DECLARED_SKILL
      })
    })

    BddTest().and('the model changes', () => {
      beforeEach(async () => {
        await wrapper.setProps({ modelValue: EAssociationContextType.DECLARED_ACTIVITY })
      })

      BddTest().then('it should select the new context type', () => {
        expect(wrapper.findComponent(AvSelectStub).props('selectedItem')).toEqual({
          itemId: EAssociationContextType.DECLARED_ACTIVITY
        })
      })
    })

    BddTest().and('the user selects another context type', () => {
      beforeEach(async () => {
        await wrapper.find('select').setValue(EAssociationContextType.DECLARED_ACTIVITY)
      })

      BddTest().then('it should update the model with the selected context type', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[EAssociationContextType.DECLARED_ACTIVITY]])
      })
    })
  })

  BddTest().when('the component is mounted with every context type', () => {
    beforeEach(() => {
      wrapper = mountSelect({
        contextTypes: [
          EAssociationContextType.TRACE,
          EAssociationContextType.DECLARED_ACTIVITY,
          EAssociationContextType.DECLARED_SKILL,
          EAssociationContextType.DECLARED_EXPERIENCE
        ],
        modelValue: EAssociationContextType.TRACE
      })
    })

    BddTest().then('it should translate the selection label of every context type', () => {
      const options = wrapper.findComponent(AvSelectStub).props('options')

      expect(options.map(({ label }: { label: string }) => label)).toEqual([
        'Mes traces',
        'Mes activités',
        'Mes compétences',
        'Mes expériences'
      ])
    })
  })
})
