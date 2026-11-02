import type { AssociationContextTypeSelectProps } from '@/features/student/associations/components/interactions/AssociationContextTypeSelect/AssociationContextTypeSelect.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect } from 'vitest'
import { EAssociationContextType } from '@/api/avenir-esr'
import AssociationContextTypeSelect from '@/features/student/associations/components/interactions/AssociationContextTypeSelect/AssociationContextTypeSelect.vue'

const stubs = {
  AvSelect: AvSelectStub,
}

function mountSelect (props: AssociationContextTypeSelectProps & { modelValue: EAssociationContextType }) {
  return mountComponent(AssociationContextTypeSelect, {
    props,
    global: { stubs },
  })
}

BddTest().given('an association context type select', () => {
  let wrapper: ReturnType<typeof mountSelect>

  const getAvSelect = () => wrapper.findComponent(AvSelectStub)

  BddTest().when('the component is mounted with some context types', () => {
    beforeEach(() => {
      wrapper = mountSelect({
        contextTypes: [
          EAssociationContextType.DECLARED_SKILL,
          EAssociationContextType.DECLARED_ACTIVITY,
        ],
        modelValue: EAssociationContextType.DECLARED_SKILL,
      })
    })

    BddTest().then('it should render the select with its translated label and placeholder', () => {
      expect(getAvSelect().exists()).toBe(true)
      expect(getAvSelect().props('label')).toBe('Rechercher dans\u00A0:')
      expect(getAvSelect().props('placeholder')).toBe('Sélectionnez un type')
    })

    BddTest().then('it should forward the required and width props', () => {
      expect(getAvSelect().props('required')).toBe(true)
      expect(getAvSelect().props('width')).toBe('100%')
    })

    BddTest().then('it should map each context type to an option in the given order', () => {
      expect(getAvSelect().props('options')).toEqual([
        {
          value: EAssociationContextType.DECLARED_SKILL,
          label: 'Mes compétences',
        },
        {
          value: EAssociationContextType.DECLARED_ACTIVITY,
          label: 'Mes activités',
        },
      ])
    })

    BddTest().then('it should select the context type of the model', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: EAssociationContextType.DECLARED_SKILL,
        label: 'Mes compétences',
      })
    })

    BddTest().and('the model changes', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          modelValue: EAssociationContextType.DECLARED_ACTIVITY,
        })
      })

      BddTest().then('it should select the new context type', () => {
        expect(getAvSelect().props('modelValue')).toEqual({
          value: EAssociationContextType.DECLARED_ACTIVITY,
          label: 'Mes activités',
        })
      })
    })

    BddTest().and('the user selects another context type', () => {
      beforeEach(async () => {
        await wrapper.find('select').setValue(EAssociationContextType.DECLARED_ACTIVITY)
      })

      BddTest().then('it should update the model with the selected context type', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([
          [EAssociationContextType.DECLARED_ACTIVITY],
        ])
      })

      BddTest().then('it should update the selected option', () => {
        expect(getAvSelect().props('modelValue')).toEqual({
          value: EAssociationContextType.DECLARED_ACTIVITY,
          label: 'Mes activités',
        })
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
          EAssociationContextType.DECLARED_EXPERIENCE,
        ],
        modelValue: EAssociationContextType.TRACE,
      })
    })

    BddTest().then('it should translate the selection label of every context type', () => {
      const options = getAvSelect().props('options')

      expect(options).toBeDefined()
      expect(options!.map(({ label }: { label: string }) => label)).toEqual([
        'Mes traces',
        'Mes activités',
        'Mes compétences',
        'Mes expériences',
      ])
    })

    BddTest().then('it should select the current context type', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: EAssociationContextType.TRACE,
        label: 'Mes traces',
      })
    })
  })

  BddTest().when('the component is mounted with an empty list of context types', () => {
    beforeEach(() => {
      wrapper = mountSelect({
        contextTypes: [],
        modelValue: EAssociationContextType.TRACE,
      })
    })

    BddTest().then('it should expose no options and no selected option', () => {
      expect(getAvSelect().props('options')).toEqual([])
      expect(getAvSelect().props('modelValue')).toBeNull()
    })
  })
})
