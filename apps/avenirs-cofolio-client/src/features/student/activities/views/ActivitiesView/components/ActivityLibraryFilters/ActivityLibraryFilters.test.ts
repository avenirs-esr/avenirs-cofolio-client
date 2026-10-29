import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { EActivityThematic, EDeclaredActivityStatus, ESortField, ESortOrder } from '@/api/avenir-esr'
import { ActivityThematicSelectStub } from '@/common/activities/inputs/ActivityThematicSelect/ActivityThematicSelect.stub'
import { DeclaredActivityStatusSelectStub } from '@/common/activities/inputs/DeclaredActivityStatusSelect/DeclaredActivityStatusSelect.stub'
import { SearchEntityInputStub } from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.stub'
import { SortSelectStub } from '@/common/components/interaction/selects/SortSelect/SortSelect.stub'
import { formatSortValue } from '@/common/utils/http/http-params'
import ActivityLibraryFilters from '@/features/student/activities/views/ActivitiesView/components/ActivityLibraryFilters/ActivityLibraryFilters.vue'

const FILTER_LABEL = 'Filtrer les activités'
const RESET_LABEL = 'Réinitialiser les filtres'
const SEARCH_ENTITY_NAME = 'une activité'
const SEARCH_ENTITY_PLACEHOLDER = 'l\'intitulé'

const MOBILE_OPEN_BUTTON_TEST_ID = 'activity-library-filters-mobile-open-button'
const RESET_BUTTON_TEST_ID = 'activity-library-filters-reset-button'

const DEFAULT_SORT = {
  sortField: ESortField.DATE,
  sortOrder: ESortOrder.DESC,
}

const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    })
  }
})

vi.mock('lodash-es', () => ({
  debounce: (fn: unknown) => fn
}))

BddTest().given('an activity library filters component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityLibraryFilters>>

  const stubs = {
    ActivityThematicSelect: ActivityThematicSelectStub,
    AvButton: AvButtonStub,
    AvModal: AvModalStub,
    DeclaredActivityStatusSelect: DeclaredActivityStatusSelectStub,
    SearchEntityInput: SearchEntityInputStub,
    SortSelect: SortSelectStub,
  }

  const mountComponent = () => {
    wrapper = mount(ActivityLibraryFilters, { global: { stubs } })
  }

  const getSearchInput = () => wrapper.findComponent(SearchEntityInputStub)
  const getThematicSelect = () => wrapper.findComponent(ActivityThematicSelectStub)
  const getStatusSelect = () => wrapper.findComponent(DeclaredActivityStatusSelectStub)
  const getSortSelect = () => wrapper.findComponent(SortSelectStub)
  const getModal = () => wrapper.findComponent(AvModalStub)

  const findButton = (testId: string) => wrapper.findAllComponents(AvButtonStub).find(button => button.attributes('data-testid') === testId)
  const getLastEmittedFilters = () => wrapper.emitted('update:filters')?.at(-1)

  const setKeyword = async (keyword: string) => {
    getSearchInput().vm.$emit('update:modelValue', keyword)
    await nextTick()
  }

  const setThematics = async (thematics: EActivityThematic[]) => {
    getThematicSelect().vm.$emit('update:modelValue', thematics)
    await nextTick()
  }

  const setStatuses = async (statuses: EDeclaredActivityStatus[]) => {
    getStatusSelect().vm.$emit('update:modelValue', statuses)
    await nextTick()
  }

  const setSort = async (sortField: ESortField, sortOrder: ESortOrder) => {
    getSortSelect().vm.$emit('update:selectedItem', { itemId: formatSortValue(sortField, sortOrder) })
    await nextTick()
  }

  beforeEach(() => {
    mockIsMobile.value = false
  })

  BddTest().when('the component is mounted on desktop', () => {
    beforeEach(() => {
      mountComponent()
    })

    BddTest().then('it should configure the search input', () => {
      const searchInput = getSearchInput()
      expect(searchInput.props('entityName')).toBe(SEARCH_ENTITY_NAME)
      expect(searchInput.props('entityPlaceholder')).toBe(SEARCH_ENTITY_PLACEHOLDER)
    })

    BddTest().then('it should display the thematic and status select labels', () => {
      expect(getThematicSelect().props('labelVisible')).toBe(true)
      expect(getStatusSelect().props('labelVisible')).toBe(true)
    })

    BddTest().then('it should allow selecting several thematics', () => {
      expect(getThematicSelect().props('multiple')).toBe(true)
    })

    BddTest().then('it should only offer the realization statuses', () => {
      const statusesSelect = getStatusSelect()
      const filtrableStatuses = Object.values(EDeclaredActivityStatus)
        .filter(status => status !== EDeclaredActivityStatus.CONSULTED)

      expect(statusesSelect.props('statuses')).toEqual(filtrableStatuses)
    })

    BddTest().then('it should sort from the most recent by default', () => {
      expect(getSortSelect().props('selectedItem')).toEqual({
        itemId: formatSortValue(ESortField.DATE, ESortOrder.DESC),
      })
    })

    BddTest().then('it should display the reset button', () => {
      expect(findButton(RESET_BUTTON_TEST_ID)?.props('label')).toBe(RESET_LABEL)
    })

    BddTest().then('it should display the filters without the open button nor the modal', () => {
      expect(findButton(MOBILE_OPEN_BUTTON_TEST_ID)).toBeUndefined()
      expect(getModal().exists()).toBe(false)
    })

    BddTest().then('it should not emit filters', () => {
      expect(wrapper.emitted('update:filters')).toBeUndefined()
    })
  })

  BddTest().when('a keyword is typed', () => {
    beforeEach(async () => {
      mountComponent()
      await setKeyword('maths')
    })

    BddTest().then('it should emit the filters with the keyword', () => {
      expect(getLastEmittedFilters()).toEqual([{
        keyword: 'maths',
        ...DEFAULT_SORT
      }])
    })
  })

  BddTest().when('several thematics are selected', () => {
    beforeEach(async () => {
      mountComponent()
      await setThematics([EActivityThematic.SELF_KNOWLEDGE, EActivityThematic.FUTURE_PLANS])
    })

    BddTest().then('it should emit the filters with the selected thematics', () => {
      expect(getLastEmittedFilters()).toEqual([{
        thematics: [EActivityThematic.SELF_KNOWLEDGE, EActivityThematic.FUTURE_PLANS],
        ...DEFAULT_SORT
      }])
    })
  })

  BddTest().when('several statuses are selected, including the submitted for assessment', () => {
    beforeEach(async () => {
      mountComponent()
      await setStatuses([EDeclaredActivityStatus.IN_PROGRESS, EDeclaredActivityStatus.SUBMITTED_FOR_ASSESSMENT])
    })

    BddTest().then('it should emit the consulted status along with the submitted for assessment', () => {
      expect(getLastEmittedFilters()).toEqual([{
        statuses: [EDeclaredActivityStatus.IN_PROGRESS, EDeclaredActivityStatus.SUBMITTED_FOR_ASSESSMENT, EDeclaredActivityStatus.CONSULTED],
        ...DEFAULT_SORT
      }])
    })
  })

  BddTest().when('the sort is changed', () => {
    beforeEach(async () => {
      mountComponent()
      await setSort(ESortField.NAME, ESortOrder.ASC)
    })

    BddTest().then('it should emit the filters with the selected sort', () => {
      expect(getLastEmittedFilters()).toEqual([{
        sortField: ESortField.NAME,
        sortOrder: ESortOrder.ASC
      }])
    })
  })

  BddTest().when('filters and sort are applied', () => {
    beforeEach(async () => {
      mountComponent()
      await setKeyword('maths')
      await setThematics([EActivityThematic.SELF_KNOWLEDGE])
      await setStatuses([EDeclaredActivityStatus.IN_PROGRESS])
      await setSort(ESortField.NAME, ESortOrder.ASC)
    })

    BddTest().and('the reset button is clicked', () => {
      beforeEach(async () => {
        await findButton(RESET_BUTTON_TEST_ID)?.trigger('click')
      })

      BddTest().then('it should clear the search and the selections', () => {
        expect(getSearchInput().props('modelValue')).toBe('')
        expect(getThematicSelect().props('modelValue')).toEqual([])
        expect(getStatusSelect().props('modelValue')).toEqual([])
      })

      BddTest().then('it should emit the filters with the current sort only', () => {
        expect(getLastEmittedFilters()).toEqual([{
          sortField: ESortField.NAME,
          sortOrder: ESortOrder.ASC
        }])
      })
    })
  })

  BddTest().when('the component is mounted on mobile', () => {
    beforeEach(() => {
      mockIsMobile.value = true
      mountComponent()
    })

    BddTest().then('it should display the open button', () => {
      expect(findButton(MOBILE_OPEN_BUTTON_TEST_ID)?.props('label')).toBe(FILTER_LABEL)
    })

    BddTest().then('it should display the filters in a closed modal', () => {
      expect(getModal().props('opened')).toBe(false)
    })

    BddTest().and('the open button is clicked', () => {
      beforeEach(async () => {
        await findButton(MOBILE_OPEN_BUTTON_TEST_ID)?.trigger('click')
      })

      BddTest().then('it should open the modal', () => {
        expect(getModal().props('opened')).toBe(true)
      })

      BddTest().and('the modal is closed', () => {
        beforeEach(async () => {
          getModal().vm.$emit('close')
          await nextTick()
        })

        BddTest().then('it should close the modal', () => {
          expect(getModal().props('opened')).toBe(false)
        })
      })
    })
  })
})
