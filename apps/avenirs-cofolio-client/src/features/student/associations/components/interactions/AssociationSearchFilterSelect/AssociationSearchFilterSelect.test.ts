import type { AssociationSearchFilterSelectProps } from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect } from 'vitest'
import { EAssociationContextType } from '@/api/avenir-esr'
import AssociationSearchFilterSelect from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.vue'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'

const stubs = {
  AvSelect: AvSelectStub,
}

function mountSelect (props: AssociationSearchFilterSelectProps & { modelValue: AssociationSearchFilter }) {
  return mountComponent(AssociationSearchFilterSelect, {
    props,
    global: { stubs },
  })
}

BddTest().given('an association search filter select', () => {
  let wrapper: ReturnType<typeof mountSelect>

  const getAvSelect = () => wrapper.findComponent(AvSelectStub)

  BddTest().when('the component is mounted for traces', () => {
    beforeEach(() => {
      wrapper = mountSelect({
        contextType: EAssociationContextType.TRACE,
        modelValue: AssociationSearchFilter.UNASSOCIATED,
      })
    })

    BddTest().then('it should render the select', () => {
      expect(wrapper.find('[data-testid="association-search-filter-select"]').exists()).toBe(true)
    })

    BddTest().then('it should display the default translated label and placeholder', () => {
      expect(getAvSelect().props('label')).toBe('Rechercher dans :')
      expect(getAvSelect().props('placeholder')).toBe('Sélectionnez un filtre')
    })

    BddTest().then('it should display the label by default', () => {
      expect(getAvSelect().props('labelVisible')).toBe(true)
    })

    BddTest().then('it should propose every search filter with its translated label', () => {
      expect(getAvSelect().props('options')).toEqual([
        {
          value: AssociationSearchFilter.ALL,
          label: 'Toutes mes traces',
        },
        {
          value: AssociationSearchFilter.ASSOCIATED,
          label: 'Mes traces associées',
        },
        {
          value: AssociationSearchFilter.UNASSOCIATED,
          label: 'Mes traces non associées',
        },
      ])
    })

    BddTest().then('it should select the search filter from the model', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: AssociationSearchFilter.UNASSOCIATED,
        label: 'Mes traces non associées',
      })
    })

    BddTest().and('the model changes', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          modelValue: AssociationSearchFilter.ALL,
        })
      })

      BddTest().then('it should select the new search filter', () => {
        expect(getAvSelect().props('modelValue')).toEqual({
          value: AssociationSearchFilter.ALL,
          label: 'Toutes mes traces',
        })
      })
    })

    BddTest().and('the user selects another search filter', () => {
      beforeEach(async () => {
        await wrapper.find('select').setValue(AssociationSearchFilter.ASSOCIATED)
      })

      BddTest().then('it should update the model with the selected search filter', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([
          [AssociationSearchFilter.ASSOCIATED],
        ])
      })

      BddTest().then('it should select the newly chosen option', () => {
        expect(getAvSelect().props('modelValue')).toEqual({
          value: AssociationSearchFilter.ASSOCIATED,
          label: 'Mes traces associées',
        })
      })
    })
  })

  BddTest().when('the component is mounted with a custom hidden label', () => {
    beforeEach(() => {
      wrapper = mountSelect({
        contextType: EAssociationContextType.TRACE,
        label: 'De type :',
        labelVisible: false,
        modelValue: AssociationSearchFilter.ALL,
      })
    })

    BddTest().then('it should display the custom label', () => {
      expect(getAvSelect().props('label')).toBe('De type :')
    })

    BddTest().then('it should hide the label', () => {
      expect(getAvSelect().props('labelVisible')).toBe(false)
    })
  })

  BddTest().when('the component receives a different context type', () => {
    beforeEach(async () => {
      wrapper = mountSelect({
        contextType: EAssociationContextType.TRACE,
        modelValue: AssociationSearchFilter.ALL,
      })

      await wrapper.setProps({
        contextType: EAssociationContextType.TRACE,
      })
    })

    BddTest().then('it should keep the current filter selected', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: AssociationSearchFilter.ALL,
        label: 'Toutes mes traces',
      })
    })
  })
})
