import type { VueWrapper } from '@vue/test-utils'
import { declaredProgramsQueryEmptyHandler, declaredProgramsQueryErrorHandler } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { DeclaredProgramCardStub } from '@/features/personalCareer/components/cards/DeclaredProgramCard/DeclaredProgramCard.stub'
import { AddDeclaredProgramDrawerStub } from '@/features/personalCareer/components/overlays/AddDeclaredProgramDrawer/AddDeclaredProgramDrawer.stub'
import { DeclaredProgramsMoreActionsDropdownStub } from '@/features/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeclaredProgramsMoreActionsDropdown/DeclaredProgramsMoreActionsDropdown.stub'
import DeclaredProgramsTab from '@/features/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeclaredProgramsTab/DeclaredProgramsTab.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockDisplayAddDeclaredProgramDrawer = vi.fn()
const mockOnUpdateCurrentPage = vi.fn()
const mockOnUpdatePageSize = vi.fn()

vi.mock('@/common/composables/use-pagination/use-pagination', () => ({
  usePagination: vi.fn(() => ({
    currentPage: ref(0),
    pageSizeSelected: ref(PageSizes.FOUR),
    onUpdateCurrentPage: mockOnUpdateCurrentPage,
    onUpdatePageSize: mockOnUpdatePageSize
  }))
}))

vi.mock('@/common/composables/use-base-api-exception-toast/use-base-api-exception-toast', () => ({
  useBaseApiExceptionToast: vi.fn()
}))

vi.mock('@/features/personalCareer/stores/personalCareer.store', () => ({
  usePersonalCareerStore: vi.fn(() => ({
    displayAddDeclaredProgramDrawer: mockDisplayAddDeclaredProgramDrawer,
    declaredProgramsCurrentPage: ref(0),
    declaredProgramsPageSizeSelected: ref(PageSizes.FOUR)
  }))
}))

BddTest().given('a declared programs tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramsTab>>

  const stubs = {
    DeclaredProgramsMoreActionsDropdown: DeclaredProgramsMoreActionsDropdownStub,
    AddDeclaredProgramDrawer: AddDeclaredProgramDrawerStub,
    DeclaredProgramCard: DeclaredProgramCardStub,
    Pagination: PaginationStub,
    Loader: LoaderStub,
    AvIconText: AvIconTextStub,
    QuerySuspense: QuerySuspenseStub
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    wrapper = mountComponent(DeclaredProgramsTab, {
      global: { stubs }
    })
    await vi.waitFor(() => {
      expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should have the correct layout classes', () => {
      const container = wrapper.find('.av-col.av-gap-md')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render the AvIconText component', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.exists()).toBe(true)
    })

    BddTest().then('it should render the more actions dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'DeclaredProgramsMoreActionsDropdown' })
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should have the dropdown in a right-aligned row', () => {
      const row = wrapper.find('.av-row.av-justify-end')
      expect(row.exists()).toBe(true)
      expect(row.findComponent({ name: 'DeclaredProgramsMoreActionsDropdown' }).exists()).toBe(true)
    })

    BddTest().then('it should render the pagination component', () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.exists()).toBe(true)
    })

    BddTest().then('it should render the add declared program drawer', () => {
      const drawer = wrapper.findComponent({ name: 'AddDeclaredProgramDrawer' })
      expect(drawer.exists()).toBe(true)
    })
  })

  BddTest().when('declared programs data is loaded', () => {
    beforeEach(async () => {
      await vi.waitFor(() => {
        const cards = wrapper.findAllComponents({ name: 'DeclaredProgramCard' })
        expect(cards.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should render declared program cards', () => {
      const cards = wrapper.findAllComponents({ name: 'DeclaredProgramCard' })
      expect(cards.length).toBeGreaterThan(0)
    })

    BddTest().then('it should render cards with layout and spacing classes', () => {
      const cardsLayout = wrapper.find('[data-testid="cards-layout"]')
      expect(cardsLayout.classes()).toContain('av-col')
      expect(cardsLayout.classes()).toContain('av-gap-lg')
    })

    BddTest().then('it should not display the loader', () => {
      const loaderSpinner = wrapper.find('[data-testid="loader-stub"]')
      expect(loaderSpinner.exists()).toBe(false)
    })
  })

  BddTest().when('there are no declared programs', () => {
    beforeEach(async () => {
      server.use(declaredProgramsQueryEmptyHandler)
      wrapper = mountComponent(DeclaredProgramsTab, {
        global: { stubs }
      })
      await vi.waitFor(() => {
        const emptyState = wrapper.find('[data-testid="query-suspense-empty"]')
        expect(emptyState.exists()).toBe(true)
      })
    })

    BddTest().then('it should display the empty state message', () => {
      const emptyState = wrapper.find('[data-testid="query-suspense-empty"]')
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.text().length).toBeGreaterThan(0)
    })

    BddTest().then('it should not render declared program cards', () => {
      const cards = wrapper.findAllComponents({ name: 'DeclaredProgramCard' })
      expect(cards).toHaveLength(0)
    })

    BddTest().then('it should not display the loader', () => {
      const loaderSpinner = wrapper.find('[data-testid="loader-stub"]')
      expect(loaderSpinner.exists()).toBe(false)
    })

    BddTest().then('it should not render the pagination component', () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.exists()).toBe(false)
    })
  })

  BddTest().when('the query fails with an error', () => {
    beforeEach(async () => {
      server.use(declaredProgramsQueryErrorHandler)
      wrapper = mountComponent(DeclaredProgramsTab, {
        global: { stubs }
      })
      await vi.waitFor(() => {
        const loaderSpinner = wrapper.find('[data-testid="loader-stub"]')
        expect(loaderSpinner.exists()).toBe(false)
      })
    })

    BddTest().then('it should not render declared program cards', () => {
      const cards = wrapper.findAllComponents({ name: 'DeclaredProgramCard' })
      expect(cards).toHaveLength(0)
    })

    BddTest().then('it should not display the loader after error', () => {
      const loaderSpinner = wrapper.find('[data-testid="loader-stub"]')
      expect(loaderSpinner.exists()).toBe(false)
    })

    BddTest().then('it should not display the empty state', () => {
      const emptyState = wrapper.find('[data-testid="query-suspense-empty"]')
      expect(emptyState.exists()).toBe(false)
    })
  })

  BddTest().when('the add action is triggered from the dropdown', () => {
    beforeEach(() => {
      const dropdown = wrapper.findComponent({ name: 'DeclaredProgramsMoreActionsDropdown' })
      dropdown.vm.$emit('addSelected')
    })

    BddTest().then('it should call displayAddDeclaredProgramDrawer', () => {
      expect(mockDisplayAddDeclaredProgramDrawer).toHaveBeenCalledOnce()
    })
  })
})
