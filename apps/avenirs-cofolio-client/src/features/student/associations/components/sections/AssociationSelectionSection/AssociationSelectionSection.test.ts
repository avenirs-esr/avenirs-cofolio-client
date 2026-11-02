import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import type { AssociationSearchResultDTO } from '@/api/avenir-esr'
import type { Association, AssociationSelections } from '@/features/student/associations/types/associations.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMockedAssociationSearchResponse } from '@/__mocks__/fixtures/student/associations.fixtures'
import { searchForAssociationWithNewElementErrorHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import { AssociationContextTypeSelectStub } from '@/features/student/associations/components/interactions/AssociationContextTypeSelect/AssociationContextTypeSelect.stub'
import { AssociationSearchFilterSelectStub } from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.stub'
import { SearchAssociationLayoutStub } from '@/features/student/associations/components/interactions/SearchAssociationLayout/SearchAssociationLayout.stub'
import AssociationSelectionSection from '@/features/student/associations/components/sections/AssociationSelectionSection/AssociationSelectionSection.vue'
import { ASSOCIATION_CONTEXT_CONFIGS, ASSOCIATION_SEARCH_FILTER_IS_ASSOCIATED, DEFAULT_ASSOCIATION_SEARCH_FILTER } from '@/features/student/associations/constants/associations.constants'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'
import { getAssociableContextTypes } from '@/features/student/associations/utils/associations.utils'

const DISABLED_TOOLTIP = 'Cet élément est déjà associé.'
const FILTER_LABEL = 'De type\u00A0:'
const GENERIC_ERROR_TITLE = 'Une erreur est survenue. Veuillez réessayer ultérieurement.'
const LIMIT_REACHED_TOOLTIP = 'Nombre maximal d\'associations autorisées atteint.'
const SEARCH_PLACEHOLDERS: Record<EAssociationContextType, string | Record<AssociationSearchFilter, string>> = {
  [EAssociationContextType.TRACE]: {
    [AssociationSearchFilter.ALL]: 'Rechercher une trace...',
    [AssociationSearchFilter.ASSOCIATED]: 'Rechercher une trace associée...',
    [AssociationSearchFilter.UNASSOCIATED]: 'Rechercher une trace non associée...'
  },
  [EAssociationContextType.DECLARED_ACTIVITY]: 'Rechercher une activité...',
  [EAssociationContextType.DECLARED_SKILL]: 'Rechercher une compétence...',
  [EAssociationContextType.DECLARED_EXPERIENCE]: 'Rechercher une expérience...',
  [EAssociationContextType.DECLARED_PROGRAM]: 'Rechercher une formation...'
}

type MountingOptions = ComponentMountingOptions<typeof AssociationSelectionSection>

const defaultProps: MountingOptions['props'] = {
  contextType: EAssociationContextType.DECLARED_ACTIVITY
}

const { mockAddErrorMessage } = vi.hoisted(() => ({
  mockAddErrorMessage: vi.fn()
}))

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()

  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

type SelectedOption = Pick<AvAutocompleteOption, 'value' | 'label'>

const CONTEXT_TYPES = Object.values(EAssociationContextType).filter(contextType => getAssociableContextTypes(contextType).length > 0)

const defaultAssociableTypes = getAssociableContextTypes(defaultProps.contextType)
const firstType = defaultAssociableTypes[0]!
const secondType = defaultAssociableTypes[1]!
const filterableType = defaultAssociableTypes.find(type => ASSOCIATION_CONTEXT_CONFIGS[type].filterable)!
const otherFilters = Object.values(AssociationSearchFilter).filter(filter => filter !== DEFAULT_ASSOCIATION_SEARCH_FILTER)

function getSearchResults (contextType: EAssociationContextType, filter = DEFAULT_ASSOCIATION_SEARCH_FILTER, keyword?: string): AssociationSearchResultDTO[] {
  return createMockedAssociationSearchResponse(contextType, {
    keyword,
    isAssociated: ASSOCIATION_CONTEXT_CONFIGS[contextType].filterable ? ASSOCIATION_SEARCH_FILTER_IS_ASSOCIATED[filter] : undefined
  }).data
}

function toExpectedOption ({ id, title, disabled, limitReached }: AssociationSearchResultDTO) {
  return expect.objectContaining({
    value: id,
    label: title,
    disabled,
    ...(disabled ? { disabledTooltip: limitReached ? LIMIT_REACHED_TOOLTIP : DISABLED_TOOLTIP } : {})
  })
}

const toExpectedAssociation = ({ value, label }: SelectedOption) => expect.objectContaining({ id: value.toString(), title: label })
const toExpectedSelectedOption = ({ value, label }: SelectedOption) => expect.objectContaining({ value: value.toString(), label })

BddTest().given('an association selection section', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociationSelectionSection>>

  const stubs = {
    SearchAssociationLayout: SearchAssociationLayoutStub,
    AssociationContextTypeSelect: AssociationContextTypeSelectStub,
    AssociationSearchFilterSelect: AssociationSearchFilterSelectStub
  }

  const mountWith = (props: Partial<typeof defaultProps> = {}) => {
    wrapper = mountComponent(AssociationSelectionSection, {
      props: { ...defaultProps, ...props },
      global: { stubs }
    })
  }

  const getFilterSelect = () => wrapper.findComponent(AssociationSearchFilterSelectStub)
  const getLayout = () => wrapper.findComponent(SearchAssociationLayoutStub)
  const getTypeSelect = () => wrapper.findComponent(AssociationContextTypeSelectStub)

  const getSection = () => wrapper.find('[data-testid="associate-elements-drawer-section"]')
  const getSelectedItems = () => wrapper.findAll('[data-testid="search-association-layout-selected-item-stub"]')

  const getActiveType = () => getTypeSelect().props('modelValue') as EAssociationContextType
  const getAssociableTypes = () => getAssociableContextTypes(wrapper.props('contextType'))
  const getLastEmittedSelections = () => wrapper.emitted<[AssociationSelections]>('update:selections')?.at(-1)?.[0]
  const getLayoutOptions = () => getLayout().props('options') as AvAutocompleteOption[]

  const expectTypeSelect = (activeContextType: EAssociationContextType) => {
    const typeSelect = getTypeSelect()
    expect(typeSelect.attributes('data-testid')).toBe('associate-elements-type-select')
    expect(typeSelect.props('contextTypes')).toEqual(getAssociableTypes())
    expect(typeSelect.props('modelValue')).toBe(activeContextType)
  }

  const expectFilterSelect = (activeContextType: EAssociationContextType, filter = DEFAULT_ASSOCIATION_SEARCH_FILTER) => {
    const filterSelect = getFilterSelect()

    if (!ASSOCIATION_CONTEXT_CONFIGS[activeContextType].filterable) {
      expect(filterSelect.exists()).toBe(false)
      return
    }

    expect(filterSelect.attributes('data-testid')).toBe('associate-elements-filter-select')
    expect(filterSelect.props('modelValue')).toBe(filter)
    expect(filterSelect.props('contextType')).toBe(activeContextType)
    expect(filterSelect.props('label')).toBe(FILTER_LABEL)
    expect(filterSelect.props('labelVisible')).toBe(false)
  }

  const expectPlaceholder = (activeContextType: EAssociationContextType, filter = DEFAULT_ASSOCIATION_SEARCH_FILTER) => {
    const placeholder = SEARCH_PLACEHOLDERS[activeContextType]
    expect(getLayout().props('inputOptions')).toEqual({
      placeholder: typeof placeholder === 'string'
        ? placeholder
        : placeholder[filter]
    })
  }

  const expectOptions = (activeContextType: EAssociationContextType, filter?: AssociationSearchFilter, keyword?: string) => {
    expect(getLayoutOptions()).toEqual(getSearchResults(activeContextType, filter, keyword).map(toExpectedOption))
  }

  const expectSelection = (selected: SelectedOption[]) => {
    const layout = getLayout()
    expect(layout.props('items')).toEqual(selected.map(toExpectedAssociation))
    expect(layout.props('modelValue')).toEqual(selected.map(toExpectedSelectedOption))
  }

  const expectSelectedItems = (selected: AvAutocompleteOption[]) => {
    const items = getSelectedItems()

    expect(items).toHaveLength(selected.length)
    items.forEach((item, index) => {
      const text = item.text()
      const { label, description } = selected[index]!

      expect(text).toContain(label)

      if (description) {
        expect(text).toContain(description)
      }
    })
  }

  const expectEmittedSelections = (selections: Record<string, SelectedOption[]>) => {
    expect(getLastEmittedSelections()).toEqual(Object.fromEntries(Object.entries(selections).map(([contextType, options]) => [contextType, options.map(toExpectedAssociation)])))
  }

  const waitForSearchResults = async (activeContextType: EAssociationContextType, filter?: AssociationSearchFilter, keyword?: string) => {
    await vi.waitFor(() => {
      expectOptions(activeContextType, filter, keyword)
      expect(getLayout().props('loading')).toBe(false)
    })
  }

  const mountWithResults = async (props: Partial<typeof defaultProps> = {}) => {
    mountWith(props)
    await waitForSearchResults(getAssociableTypes()[0]!)
  }

  const switchTo = async (contextType: EAssociationContextType) => {
    getTypeSelect().vm.$emit('update:modelValue', contextType)
    await nextTick()
    await waitForSearchResults(contextType)
  }

  const selectFilter = async (filter: AssociationSearchFilter) => {
    getFilterSelect().vm.$emit('update:modelValue', filter)
    await waitForSearchResults(getActiveType(), filter)
  }

  const searchKeyword = async (keyword: string) => {
    getLayout().vm.$emit('update:search', keyword)
    await waitForSearchResults(getActiveType(), undefined, keyword)
  }

  const selectOptions = async (count: number) => {
    const options = getLayoutOptions().filter(({ disabled }) => !disabled).slice(0, count)

    getLayout().vm.$emit('update:modelValue', options)
    await nextTick()

    return options
  }

  const thenItShouldDisplay = (activeContextType: EAssociationContextType) => {
    BddTest().then('it should render the context type select with every associable context type, this one being active', () => {
      expectTypeSelect(activeContextType)
    })

    BddTest().then('it should only render the search filter select when this context type is filterable', () => {
      expectFilterSelect(activeContextType)
    })

    BddTest().then('it should pass the search results of this context type to the layout options', () => {
      expectOptions(activeContextType)
    })

    BddTest().then('it should use the placeholder of this context type', () => {
      expectPlaceholder(activeContextType)
    })
  }

  CONTEXT_TYPES.forEach((contextType) => {
    const associableType = getAssociableContextTypes(contextType)[0]!

    BddTest().when(`the section is mounted for a new element of type ${contextType}`, () => {
      beforeEach(async () => {
        await mountWithResults({
          contextType
        })
      })

      BddTest().then('it should render the section', () => {
        expect(getSection().exists()).toBe(true)
      })

      thenItShouldDisplay(associableType)

      BddTest().then('it should use the horizontal layout by default', () => {
        expect(getLayout().props('layout')).toBe('horizontal')
      })

      BddTest().then('it should start with an empty selection', () => {
        expectSelection([])
      })
    })
  })

  defaultAssociableTypes.slice(1).forEach((contextType) => {
    BddTest().when(`the section is mounted for a new element of type ${defaultProps.contextType} and the user switches to the ${contextType}`, () => {
      beforeEach(async () => {
        await mountWithResults()
        await switchTo(contextType)
      })

      thenItShouldDisplay(contextType)
    })
  })

  otherFilters.forEach((filter) => {
    BddTest().when(`the user searches the ${filterableType} with the ${filter} filter`, () => {
      beforeEach(async () => {
        await mountWithResults()
        await switchTo(filterableType)
        await selectFilter(filter)
      })

      BddTest().then('it should update the search filter', () => {
        expectFilterSelect(filterableType, filter)
      })

      BddTest().then('it should pass the matching elements to the layout options', () => {
        expectOptions(filterableType, filter)
      })

      BddTest().then('it should use the placeholder of the filter', () => {
        expectPlaceholder(filterableType, filter)
      })
    })
  })

  BddTest().when('the user searches for a keyword', () => {
    const keyword = getSearchResults(firstType)[1]!.title

    beforeEach(async () => {
      await mountWithResults()
      await searchKeyword(keyword)
    })

    BddTest().then('it should pass the search query to the layout', () => {
      expect(getLayout().props('search')).toBe(keyword)
    })

    BddTest().then('it should only pass the matching elements to the layout options', () => {
      expectOptions(firstType, undefined, keyword)
    })

    BddTest().and(`the user switches to the ${secondType}`, () => {
      beforeEach(async () => {
        await switchTo(secondType)
      })

      BddTest().then('it should reset the search query', () => {
        expect(getLayout().props('search')).toBe('')
      })
    })
  })

  BddTest().when(`the user selects two ${firstType}`, () => {
    let selected: AvAutocompleteOption[]

    beforeEach(async () => {
      await mountWithResults()
      selected = await selectOptions(2)
    })

    BddTest().then('it should emit the selections grouped by context type', () => {
      expectEmittedSelections({
        [firstType]: selected
      })
    })

    BddTest().then('it should pass the selected elements to the layout', () => {
      expectSelection(selected)
    })

    BddTest().then('it should display each selected element', () => {
      expectSelectedItems(selected)
    })

    BddTest().and('the user removes one of the selected elements', () => {
      beforeEach(async () => {
        getLayout().vm.$emit('delete', selected[0]!.value)
        await nextTick()
      })

      BddTest().then('it should emit the selections without the removed element', () => {
        expectEmittedSelections({
          [firstType]: selected.slice(1)
        })
      })

      BddTest().then('it should remove the element from the layout items', () => {
        expectSelection(selected.slice(1))
      })
    })

    BddTest().and(`the user switches to the ${secondType}`, () => {
      beforeEach(async () => {
        await switchTo(secondType)
      })

      BddTest().then('it should only pass the selected elements of this context type to the layout', () => {
        expectSelection([])
      })

      BddTest().and('the user selects an element', () => {
        let selectedOfSecondType: AvAutocompleteOption[]

        beforeEach(async () => {
          selectedOfSecondType = await selectOptions(1)
        })

        BddTest().then('it should keep the selections of every context type', () => {
          expectEmittedSelections({
            [firstType]: selected,
            [secondType]: selectedOfSecondType
          })
        })

        BddTest().then('it should display the title and the description of the selected element', () => {
          expectSelectedItems(selectedOfSecondType)
        })
      })

      BddTest().and(`the user switches back to the ${firstType}`, () => {
        beforeEach(async () => {
          await switchTo(firstType)
        })

        BddTest().then('it should restore the selected elements', () => {
          expectSelection(selected)
        })
      })
    })
  })

  BddTest().when('the user selects every selectable element', () => {
    beforeEach(async () => {
      await mountWithResults()
      await selectOptions(Number.POSITIVE_INFINITY)
    })

    BddTest().then('it should keep every element selectable', () => {
      expectOptions(firstType)
    })
  })

  BddTest().when('the section is mounted with existing selections', () => {
    const [existingResult] = getSearchResults(firstType)
    const existingSelection: Association = {
      id: existingResult!.id,
      title: existingResult!.title
    }
    const existingOption: SelectedOption = {
      value: existingSelection.id,
      label: existingSelection.title
    }

    beforeEach(async () => {
      await mountWithResults({
        'selections': {
          [firstType]: [existingSelection]
        },
        'onUpdate:selections': (selections: AssociationSelections) => {
          wrapper.setProps({
            selections
          })
        }
      })
    })

    BddTest().then('it should pass the selected elements of the active context type to the layout', () => {
      expectSelection([existingOption])
    })

    BddTest().and('the parent resets the selections', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          selections: {}
        })
      })

      BddTest().then('it should clear the layout selection', () => {
        expectSelection([])
      })
    })

    BddTest().and('the user selects another element', () => {
      let selected: AvAutocompleteOption[]

      beforeEach(async () => {
        selected = await selectOptions(2)
      })

      BddTest().then('it should update the selections of the parent', () => {
        expect(wrapper.props('selections')).toEqual({
          [firstType]: selected.map(toExpectedAssociation)
        })
        expectSelection(selected)
      })
    })
  })

  BddTest().when('the section is mounted with a vertical layout', () => {
    beforeEach(async () => {
      await mountWithResults({
        layout: 'vertical'
      })
    })

    BddTest().then('it should use the given layout', () => {
      expect(getLayout().props('layout')).toBe('vertical')
    })
  })

  BddTest().when('the user searches the declared activities of a new trace, one of them having reached its limit of traces', () => {
    const limitReachedActivity = getSearchResults(EAssociationContextType.DECLARED_ACTIVITY).find(({ limitReached }) => limitReached)!

    beforeEach(async () => {
      await mountWithResults({
        contextType: EAssociationContextType.TRACE
      })
      await switchTo(EAssociationContextType.DECLARED_ACTIVITY)
    })

    BddTest().then('it should explain that it reached its limit rather than that it is already associated', () => {
      expect(getLayoutOptions().find(({ value }) => value === limitReachedActivity.id)).toEqual(expect.objectContaining({ disabled: true, disabledTooltip: LIMIT_REACHED_TOOLTIP }))
    })

    BddTest().and('the user selects the available declared activities', () => {
      let selected: AvAutocompleteOption[]

      beforeEach(async () => {
        selected = await selectOptions(2)
      })

      BddTest().then('it should emit the selected declared activities', () => {
        expectEmittedSelections({
          [EAssociationContextType.DECLARED_ACTIVITY]: selected
        })
      })

      BddTest().then('it should not change why the other declared activities cannot be selected', () => {
        expectOptions(EAssociationContextType.DECLARED_ACTIVITY)
      })
    })
  })

  BddTest().when('the section is mounted disabled', () => {
    beforeEach(async () => {
      mountWith({
        enabled: false
      })
      await flushPromises()
    })

    BddTest().then('it should not search anything', () => {
      const layout = getLayout()
      expect(layout.props('options')).toEqual([])
      expect(layout.props('loading')).toBe(false)
    })

    BddTest().and('the section gets enabled', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          enabled: true
        })
        await waitForSearchResults(firstType)
      })

      BddTest().then('it should search the elements of the active context type', () => {
        expectOptions(firstType)
      })
    })
  })

  BddTest().when('the section is mounted and the search is pending', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should display the layout as loading', () => {
      expect(getLayout().props('loading')).toBe(true)
    })
  })

  BddTest().when('the search fails', () => {
    beforeEach(async () => {
      server.use(searchForAssociationWithNewElementErrorHandler)
      mountWith()
      await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalled())
    })

    BddTest().then('it should display an error message', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: GENERIC_ERROR_TITLE,
        description: expect.any(String)
      })
    })

    BddTest().then('it should not pass any option to the layout', () => {
      expect(getLayoutOptions()).toEqual([])
    })
  })
})
