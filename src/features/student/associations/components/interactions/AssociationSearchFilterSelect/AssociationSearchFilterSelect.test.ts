import { EAssociationContextType } from '@/api/avenir-esr'
import AssociationSearchFilterSelect, {
  type AssociationSearchFilterSelectProps
} from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.vue'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvSelect: AvSelectStub
}

function mountSelect (props: AssociationSearchFilterSelectProps & { modelValue: AssociationSearchFilter }) {
  return mountComponent(AssociationSearchFilterSelect, { props, global: { stubs } })
}

BddTest().given('an association search filter select', () => {
  let wrapper: ReturnType<typeof mountSelect>

  BddTest().when('the component is mounted for traces', () => {
    beforeEach(() => {
      wrapper = mountSelect({
        contextType: EAssociationContextType.TRACE,
        modelValue: AssociationSearchFilter.UNASSOCIATED
      })
    })

    BddTest().then('it should render the select', () => {
      expect(wrapper.find('[data-testid="association-search-filter-select"]').exists()).toBe(true)
    })

    BddTest().then('it should display the default translated label and placeholder', () => {
      const select = wrapper.findComponent(AvSelectStub)

      expect(select.props('label')).toBe('Rechercher dans :')
      expect(select.props('placeholder')).toBe('Sélectionnez un filtre')
    })

    BddTest().then('it should display the label by default', () => {
      expect(wrapper.findComponent(AvSelectStub).attributes('label-visible')).toBe('true')
    })

    BddTest().then('it should propose every search filter with its translated label', () => {
      expect(wrapper.findComponent(AvSelectStub).props('options')).toEqual([
        { id: AssociationSearchFilter.ALL, label: 'Toutes mes traces' },
        { id: AssociationSearchFilter.ASSOCIATED, label: 'Mes traces associées' },
        { id: AssociationSearchFilter.UNASSOCIATED, label: 'Mes traces non associées' }
      ])
    })

    BddTest().then('it should select the search filter of the model', () => {
      expect(wrapper.findComponent(AvSelectStub).props('selectedItem')).toEqual({
        itemId: AssociationSearchFilter.UNASSOCIATED
      })
    })

    BddTest().and('the model changes', () => {
      beforeEach(async () => {
        await wrapper.setProps({ modelValue: AssociationSearchFilter.ALL })
      })

      BddTest().then('it should select the new search filter', () => {
        expect(wrapper.findComponent(AvSelectStub).props('selectedItem')).toEqual({
          itemId: AssociationSearchFilter.ALL
        })
      })
    })

    BddTest().and('the user selects another search filter', () => {
      beforeEach(async () => {
        await wrapper.find('select').setValue(AssociationSearchFilter.ASSOCIATED)
      })

      BddTest().then('it should update the model with the selected search filter', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[AssociationSearchFilter.ASSOCIATED]])
      })
    })
  })

  BddTest().when('the component is mounted with a custom hidden label', () => {
    beforeEach(() => {
      wrapper = mountSelect({
        contextType: EAssociationContextType.TRACE,
        label: 'De type :',
        labelVisible: false,
        modelValue: AssociationSearchFilter.ALL
      })
    })

    BddTest().then('it should display the custom label', () => {
      expect(wrapper.findComponent(AvSelectStub).props('label')).toBe('De type :')
    })

    BddTest().then('it should hide the label', () => {
      expect(wrapper.findComponent(AvSelectStub).attributes('label-visible')).toBe('false')
    })
  })
})
