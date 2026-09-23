import type { Association, AssociationSelections } from '@/features/student/associations/types/associations.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import { createMockedTraceSearchResults } from '@/__mocks__/fixtures/student/associations.fixtures'
import { searchForAssociationWithNewElementErrorHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import {
  AssociationContextTypeSelectStub
} from '@/features/student/associations/components/interactions/AssociationContextTypeSelect/AssociationContextTypeSelect.stub'
import {
  AssociationSearchFilterSelectStub
} from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.stub'
import AssociationSelectionSection, {
  type AssociationSelectionSectionProps
} from '@/features/student/associations/components/sections/AssociationSelectionSection/AssociationSelectionSection.vue'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    })
  }
})

/**
 * Layout stub also declaring the layout prop and rendering the selected items slot.
 */
const SearchAssociationLayoutStub = defineComponent({
  name: 'SearchAssociationLayout',
  props: ['modelValue', 'search', 'options', 'items', 'inputOptions', 'loading', 'layout'],
  emits: ['update:modelValue', 'update:search', 'delete'],
  template: `
    <div data-testid="search-association-layout-stub">
      <slot name="beforeSearch" />
      <div
        v-for="item in items"
        :key="item.id"
        data-testid="search-association-layout-selected-item-stub"
      >
        <slot name="selectedItem" :item="item" />
      </div>
    </div>
  `
})

function toTraceOption ({ id, title, disabled }: { id: string, title: string, disabled: boolean }): AvAutocompleteOption {
  return { value: id, label: title, disabled }
}

const unassociatedTraceOptions = createMockedTraceSearchResults(false).map(toTraceOption)

const skillOptions: AvAutocompleteOption[] = [
  { value: 'skill-search-1', label: 'Gestion de projet agile', description: 'Rome 4.0', disabled: false },
  { value: 'skill-search-2', label: 'Communication interpersonnelle', description: 'XXIᵉ onisep', disabled: false },
  { value: 'skill-search-3', label: 'Analyse de données', description: 'Rome 4.0', disabled: true }
]

const firstTrace: Association = { id: 'trace-non-associee1', title: 'Ma super trace non associée numéro 1', disabled: false }
const secondTrace: Association = { id: 'trace-non-associee2', title: 'Ma super trace non associée numéro 2', disabled: false }
const firstSkill: Association = { id: 'skill-search-1', title: 'Gestion de projet agile', description: 'Rome 4.0', disabled: false }

BddTest().given('an association selection section', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociationSelectionSection>>
  let requestedUrls: string[]

  const stubs = {
    SearchAssociationLayout: SearchAssociationLayoutStub,
    AssociationContextTypeSelect: AssociationContextTypeSelectStub,
    AssociationSearchFilterSelect: AssociationSearchFilterSelectStub
  }

  const onRequestStart = ({ request }: { request: Request }) => {
    requestedUrls.push(request.url)
  }

  const getLayout = () => wrapper.findComponent(SearchAssociationLayoutStub)
  const getTypeSelect = () => wrapper.findComponent(AssociationContextTypeSelectStub)
  const getFilterSelect = () => wrapper.findComponent(AssociationSearchFilterSelectStub)
  const getLayoutOptions = () => getLayout().props('options') as AvAutocompleteOption[]
  const getLastEmittedSelections = () => wrapper.emitted<[AssociationSelections]>('update:selections')?.at(-1)?.[0]

  async function waitForSearchResults (expectedOptions: AvAutocompleteOption[]) {
    await vi.waitFor(() => {
      expect(getLayoutOptions()).toEqual(expectedOptions)
      expect(getLayout().props('loading')).toBe(false)
    })
  }

  function mountSection (props: AssociationSelectionSectionProps & {
    'selections'?: AssociationSelections
    'onUpdate:selections'?: (selections: AssociationSelections) => void
  }) {
    wrapper = mountComponent(AssociationSelectionSection, { props, global: { stubs } })
  }

  async function selectContextType (contextType: EAssociationContextType) {
    getTypeSelect().vm.$emit('update:modelValue', contextType)
    await nextTick()
  }

  async function selectOptions (options: AvAutocompleteOption[]) {
    getLayout().vm.$emit('update:modelValue', options)
    await nextTick()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    requestedUrls = []
    server.events.on('request:start', onRequestStart)
  })

  afterEach(() => {
    server.events.removeListener('request:start', onRequestStart)
  })

  BddTest().when('the section is mounted for a new declared activity', () => {
    beforeEach(async () => {
      mountSection({ contextType: EAssociationContextType.DECLARED_ACTIVITY })
      await waitForSearchResults(unassociatedTraceOptions)
    })

    BddTest().then('it should render the section', () => {
      expect(wrapper.find('[data-testid="associate-elements-drawer-section"]').exists()).toBe(true)
    })

    BddTest().then('it should render the context type select with every associable context type, the first one being active', () => {
      expect(getTypeSelect().attributes('data-testid')).toBe('associate-elements-type-select')
      expect(getTypeSelect().props('contextTypes')).toEqual([
        EAssociationContextType.TRACE,
        EAssociationContextType.DECLARED_SKILL
      ])
      expect(getTypeSelect().props('modelValue')).toBe(EAssociationContextType.TRACE)
    })

    BddTest().then('it should render the search filter select since traces are filterable', () => {
      expect(getFilterSelect().attributes('data-testid')).toBe('associate-elements-filter-select')
      expect(getFilterSelect().props('modelValue')).toBe(AssociationSearchFilter.UNASSOCIATED)
      expect(getFilterSelect().props('contextType')).toBe(EAssociationContextType.TRACE)
      expect(getFilterSelect().props('label')).toBe('De type\u00A0:')
      expect(getFilterSelect().props('labelVisible')).toBe(false)
    })

    BddTest().then('it should only search the traces, through the new element search endpoint', () => {
      expect(requestedUrls).toHaveLength(1)
      expect(requestedUrls[0]).toContain('/me/associations/DECLARED_ACTIVITY/TRACE/search?isAssociated=false')
    })

    BddTest().then('it should pass the unassociated traces found by the search to the layout options', () => {
      expect(getLayoutOptions()).toEqual(unassociatedTraceOptions)
    })

    BddTest().then('it should use the placeholder of the selected search filter', () => {
      expect(getLayout().props('inputOptions')).toEqual({ placeholder: 'Rechercher une trace non associée...' })
    })

    BddTest().then('it should use the horizontal layout by default', () => {
      expect(getLayout().props('layout')).toBe('horizontal')
    })

    BddTest().then('it should start with an empty selection', () => {
      expect(getLayout().props('modelValue')).toEqual([])
      expect(getLayout().props('items')).toEqual([])
    })

    BddTest().and('the user searches in all the traces', () => {
      beforeEach(async () => {
        getFilterSelect().vm.$emit('update:modelValue', AssociationSearchFilter.ALL)
        await vi.waitFor(() => expect(getLayoutOptions()).toHaveLength(10))
      })

      BddTest().then('it should update the search filter', () => {
        expect(getFilterSelect().props('modelValue')).toBe(AssociationSearchFilter.ALL)
      })

      BddTest().then('it should pass the associated and unassociated traces to the layout options', () => {
        expect(getLayoutOptions()).toEqual([
          ...createMockedTraceSearchResults(true).map(toTraceOption),
          ...unassociatedTraceOptions
        ])
      })

      BddTest().then('it should use the placeholder of the selected search filter', () => {
        expect(getLayout().props('inputOptions')).toEqual({ placeholder: 'Rechercher une trace...' })
      })
    })

    BddTest().and('the user searches for a keyword', () => {
      beforeEach(async () => {
        getLayout().vm.$emit('update:search', 'numéro 2')
        await vi.waitFor(() => expect(getLayoutOptions()).toHaveLength(1))
      })

      BddTest().then('it should only pass the matching traces to the layout options', () => {
        expect(getLayout().props('search')).toBe('numéro 2')
        expect(getLayoutOptions()).toEqual([unassociatedTraceOptions[1]])
      })

      BddTest().and('the user switches to the declared skills', () => {
        beforeEach(async () => {
          await selectContextType(EAssociationContextType.DECLARED_SKILL)
          await waitForSearchResults(skillOptions)
        })

        BddTest().then('it should reset the search query', () => {
          expect(getLayout().props('search')).toBe('')
        })

        BddTest().then('it should search the declared skills without any keyword', () => {
          expect(requestedUrls.at(-1)).toContain('/me/associations/DECLARED_ACTIVITY/DECLARED_SKILL/search?page=0')
        })
      })
    })

    BddTest().and('the user switches to the declared skills', () => {
      beforeEach(async () => {
        await selectContextType(EAssociationContextType.DECLARED_SKILL)
        await waitForSearchResults(skillOptions)
      })

      BddTest().then('it should update the active context type', () => {
        expect(getTypeSelect().props('modelValue')).toBe(EAssociationContextType.DECLARED_SKILL)
      })

      BddTest().then('it should hide the search filter select since declared skills are not filterable', () => {
        expect(getFilterSelect().exists()).toBe(false)
      })

      BddTest().then('it should search the declared skills', () => {
        expect(requestedUrls).toHaveLength(2)
        expect(requestedUrls[1]).toContain('/me/associations/DECLARED_ACTIVITY/DECLARED_SKILL/search')
        expect(requestedUrls[1]).not.toContain('isAssociated')
      })

      BddTest().then('it should pass the declared skills found by the search to the layout options', () => {
        expect(getLayoutOptions()).toEqual(skillOptions)
      })

      BddTest().then('it should use the placeholder of the declared skills', () => {
        expect(getLayout().props('inputOptions')).toEqual({ placeholder: 'Rechercher une compétence...' })
      })
    })

    BddTest().and('the user selects two traces', () => {
      beforeEach(async () => {
        await selectOptions(unassociatedTraceOptions.slice(0, 2))
      })

      BddTest().then('it should emit the selections grouped by context type', () => {
        expect(getLastEmittedSelections()).toEqual({
          [EAssociationContextType.TRACE]: [firstTrace, secondTrace]
        })
      })

      BddTest().then('it should pass the selected traces to the layout', () => {
        expect(getLayout().props('items')).toEqual([firstTrace, secondTrace])
        expect(getLayout().props('modelValue')).toEqual(unassociatedTraceOptions.slice(0, 2))
      })

      BddTest().then('it should display the title of each selected trace', () => {
        const selectedItems = wrapper.findAll('[data-testid="search-association-layout-selected-item-stub"]')

        expect(selectedItems).toHaveLength(2)
        expect(selectedItems[0].text()).toBe('Ma super trace non associée numéro 1')
        expect(selectedItems[1].text()).toBe('Ma super trace non associée numéro 2')
      })

      BddTest().and('the user removes one of the selected traces', () => {
        beforeEach(async () => {
          getLayout().vm.$emit('delete', firstTrace.id)
          await nextTick()
        })

        BddTest().then('it should emit the selections without the removed trace', () => {
          expect(getLastEmittedSelections()).toEqual({
            [EAssociationContextType.TRACE]: [secondTrace]
          })
        })

        BddTest().then('it should remove the trace from the layout items', () => {
          expect(getLayout().props('items')).toEqual([secondTrace])
        })
      })

      BddTest().and('the user switches to the declared skills', () => {
        beforeEach(async () => {
          await selectContextType(EAssociationContextType.DECLARED_SKILL)
          await waitForSearchResults(skillOptions)
        })

        BddTest().then('it should only pass the selected declared skills to the layout', () => {
          expect(getLayout().props('items')).toEqual([])
          expect(getLayout().props('modelValue')).toEqual([])
        })

        BddTest().and('the user selects a declared skill', () => {
          beforeEach(async () => {
            await selectOptions([skillOptions[0]])
          })

          BddTest().then('it should keep the selections of every context type', () => {
            expect(getLastEmittedSelections()).toEqual({
              [EAssociationContextType.TRACE]: [firstTrace, secondTrace],
              [EAssociationContextType.DECLARED_SKILL]: [firstSkill]
            })
          })

          BddTest().then('it should display the title and the description of the selected declared skill', () => {
            const selectedItem = wrapper.find('[data-testid="search-association-layout-selected-item-stub"]')

            expect(selectedItem.text()).toContain('Gestion de projet agile')
            expect(selectedItem.text()).toContain('Rome 4.0')
          })
        })

        BddTest().and('the user switches back to the traces', () => {
          beforeEach(async () => {
            await selectContextType(EAssociationContextType.TRACE)
            await waitForSearchResults(unassociatedTraceOptions)
          })

          BddTest().then('it should restore the selected traces', () => {
            expect(getLayout().props('items')).toEqual([firstTrace, secondTrace])
            expect(getLayout().props('modelValue')).toEqual(unassociatedTraceOptions.slice(0, 2))
          })
        })
      })
    })
  })

  BddTest().when('the section is mounted with existing selections', () => {
    beforeEach(async () => {
      mountSection({
        'contextType': EAssociationContextType.DECLARED_ACTIVITY,
        'selections': { [EAssociationContextType.TRACE]: [firstTrace] },
        'onUpdate:selections': selections => wrapper.setProps({ selections })
      })
      await waitForSearchResults(unassociatedTraceOptions)
    })

    BddTest().then('it should pass the selected elements of the active context type to the layout', () => {
      expect(getLayout().props('items')).toEqual([firstTrace])
      expect(getLayout().props('modelValue')).toEqual([unassociatedTraceOptions[0]])
    })

    BddTest().and('the parent resets the selections', () => {
      beforeEach(async () => {
        await wrapper.setProps({ selections: {} })
      })

      BddTest().then('it should clear the layout selection', () => {
        expect(getLayout().props('items')).toEqual([])
        expect(getLayout().props('modelValue')).toEqual([])
      })
    })

    BddTest().and('the user selects another trace', () => {
      beforeEach(async () => {
        await selectOptions(unassociatedTraceOptions.slice(0, 2))
      })

      BddTest().then('it should update the selections of the parent', () => {
        expect(wrapper.props('selections')).toEqual({
          [EAssociationContextType.TRACE]: [firstTrace, secondTrace]
        })
        expect(getLayout().props('items')).toEqual([firstTrace, secondTrace])
      })
    })
  })

  BddTest().when('the section is mounted with restricted context types and a vertical layout', () => {
    beforeEach(async () => {
      mountSection({
        contextType: EAssociationContextType.TRACE,
        associatedContextTypes: [EAssociationContextType.DECLARED_SKILL],
        layout: 'vertical'
      })
      await waitForSearchResults(skillOptions)
    })

    BddTest().then('it should only propose the given context types', () => {
      expect(getTypeSelect().props('contextTypes')).toEqual([EAssociationContextType.DECLARED_SKILL])
      expect(getTypeSelect().props('modelValue')).toBe(EAssociationContextType.DECLARED_SKILL)
    })

    BddTest().then('it should not render the search filter select', () => {
      expect(getFilterSelect().exists()).toBe(false)
    })

    BddTest().then('it should use the given layout', () => {
      expect(getLayout().props('layout')).toBe('vertical')
    })

    BddTest().then('it should search the declared skills of a new trace', () => {
      expect(requestedUrls).toHaveLength(1)
      expect(requestedUrls[0]).toContain('/me/associations/TRACE/DECLARED_SKILL/search')
    })
  })

  BddTest().when('the section is mounted for a new trace', () => {
    beforeEach(async () => {
      mountSection({ contextType: EAssociationContextType.TRACE })
      await vi.waitFor(() => expect(getLayoutOptions()).toHaveLength(3))
    })

    BddTest().then('it should propose every context type associable with a trace', () => {
      expect(getTypeSelect().props('contextTypes')).toEqual([
        EAssociationContextType.DECLARED_ACTIVITY,
        EAssociationContextType.DECLARED_SKILL,
        EAssociationContextType.DECLARED_EXPERIENCE,
        EAssociationContextType.DECLARED_PROGRAM
      ])
      expect(getTypeSelect().props('modelValue')).toBe(EAssociationContextType.DECLARED_ACTIVITY)
    })

    BddTest().then('it should pass the declared activities found by the search, with their translated thematic', () => {
      expect(getLayoutOptions()).toEqual([
        { value: 'activity-search-1', label: 'Définir ses valeurs', description: 'Me connaître', disabled: false },
        { value: 'activity-search-2', label: 'Explorer ses pistes d\'orientation', description: 'Explorer mes futurs', disabled: false },
        { value: 'activity-search-3', label: 'Construire son projet professionnel', description: 'Explorer mes futurs', disabled: true }
      ])
    })

    BddTest().then('it should use the placeholder of the declared activities', () => {
      expect(getLayout().props('inputOptions')).toEqual({ placeholder: 'Rechercher une activité...' })
    })
  })

  BddTest().when('the section is mounted for a new trace in demo mode', () => {
    beforeEach(async () => {
      vi.stubGlobal('__DEMO_MODE__', true)
      mountSection({ contextType: EAssociationContextType.TRACE })
      await vi.waitFor(() => expect(getLayoutOptions()).toHaveLength(3))
    })

    afterEach(() => {
      vi.stubGlobal('__DEMO_MODE__', false)
    })

    BddTest().then('it should not propose the context types unavailable in demo mode', () => {
      expect(getTypeSelect().props('contextTypes')).toEqual([
        EAssociationContextType.DECLARED_ACTIVITY,
        EAssociationContextType.DECLARED_SKILL,
        EAssociationContextType.DECLARED_PROGRAM
      ])
    })
  })

  BddTest().when('the section is mounted disabled', () => {
    beforeEach(async () => {
      mountSection({ contextType: EAssociationContextType.DECLARED_ACTIVITY, enabled: false })
      await flushPromises()
    })

    BddTest().then('it should not search anything', () => {
      expect(requestedUrls).toEqual([])
      expect(getLayoutOptions()).toEqual([])
      expect(getLayout().props('loading')).toBe(false)
    })

    BddTest().and('the section gets enabled', () => {
      beforeEach(async () => {
        await wrapper.setProps({ enabled: true })
        await waitForSearchResults(unassociatedTraceOptions)
      })

      BddTest().then('it should search the elements of the active context type', () => {
        expect(requestedUrls).toHaveLength(1)
        expect(getLayoutOptions()).toEqual(unassociatedTraceOptions)
      })
    })
  })

  BddTest().when('the section is mounted and the search is pending', () => {
    beforeEach(() => {
      mountSection({ contextType: EAssociationContextType.DECLARED_ACTIVITY })
    })

    afterEach(async () => {
      await flushPromises()
    })

    BddTest().then('it should display the layout as loading', () => {
      expect(getLayout().props('loading')).toBe(true)
    })
  })

  BddTest().when('the search fails', () => {
    beforeEach(async () => {
      server.use(searchForAssociationWithNewElementErrorHandler)
      mountSection({ contextType: EAssociationContextType.DECLARED_ACTIVITY })
      await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalled())
    })

    BddTest().then('it should display an error message', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
        description: expect.any(String)
      })
    })

    BddTest().then('it should not pass any option to the layout', () => {
      expect(getLayoutOptions()).toEqual([])
    })
  })
})
