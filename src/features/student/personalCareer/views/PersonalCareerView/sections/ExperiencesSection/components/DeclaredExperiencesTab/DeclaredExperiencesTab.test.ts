import type { VueWrapper } from '@vue/test-utils'
import { declaredExperiencesQueryEmptyHandler, declaredExperiencesQueryErrorHandler } from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { EExperienceType } from '@/api/avenir-esr'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { DeclaredExperienceCardStub } from '@/features/student/personalCareer/components/cards/DeclaredExperienceCard/DeclaredExperienceCard.stub'
import { AddDeclaredExperienceDrawerStub } from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/AddDeclaredExperienceDrawer.stub'
import { DeclaredExperiencesMoreActionsDropdownStub } from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperiencesMoreActionsDropdown/DeclaredExperiencesMoreActionsDropdown.stub'
import DeclaredExperiencesTab from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperiencesTab/DeclaredExperiencesTab.vue'
import { ExperienceTypeMultiselectStub } from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/ExperienceTypeMultiselect/ExperienceTypeMultiselect.stub'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

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

const mockDisplayAddDeclaredExperienceDrawer = vi.fn()

vi.mock('@/features/student/personalCareer/stores/personalCareer.store', () => ({
  usePersonalCareerStore: vi.fn(() => ({
    declaredExperiencesCurrentPage: ref(0),
    declaredExperiencesPageSizeSelected: ref(PageSizes.FOUR),
    displayAddDeclaredExperienceDrawer: mockDisplayAddDeclaredExperienceDrawer
  }))
}))

BddTest().given('a declared experiences tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperiencesTab>>

  const stubs = {
    DeclaredExperienceCard: DeclaredExperienceCardStub,
    Pagination: PaginationStub,
    Loader: LoaderStub,
    AddDeclaredExperienceDrawer: AddDeclaredExperienceDrawerStub,
    DeclaredExperiencesMoreActionsDropdown: DeclaredExperiencesMoreActionsDropdownStub,
    AvIconText: AvIconTextStub,
    QuerySuspense: QuerySuspenseStub,
    ExperienceTypeMultiselect: ExperienceTypeMultiselectStub
  }

  const getPagination = () => wrapper.findComponent(PaginationStub)
  const getAvIconText = () => wrapper.findComponent(AvIconTextStub)
  const getDeclaredExperiencesMoreActionsDropdown = () =>
    wrapper.findComponent(DeclaredExperiencesMoreActionsDropdownStub)
  const getExperienceTypeMultiselect = () => wrapper.findComponent(ExperienceTypeMultiselectStub)
  const getDeclaredExperienceCards = () => wrapper.findAllComponents(DeclaredExperienceCardStub)
  const getQuerySuspenseEmpty = () => wrapper.findComponent(QuerySuspenseStub)
    .find('[data-testid="query-suspense-empty"]')
  const getLoader = () => wrapper.findComponent(LoaderStub)

  beforeEach(async () => {
    vi.clearAllMocks()
    wrapper = mountComponent(DeclaredExperiencesTab, {
      global: { stubs }
    })
    await vi.waitFor(() => {
      expect(getPagination().exists()).toBe(true)
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
      expect(getAvIconText().exists()).toBe(true)
    })

    BddTest().then('it should render the pagination component', () => {
      expect(getPagination().exists()).toBe(true)
    })

    BddTest().then('it should render the more actions dropdown', () => {
      expect(getDeclaredExperiencesMoreActionsDropdown().exists()).toBe(true)
    })

    BddTest().then('it should render the experience type multiselect component', () => {
      expect(getExperienceTypeMultiselect().exists()).toBe(true)
    })
  })

  BddTest().when('declared experiences data is loaded', () => {
    beforeEach(async () => {
      await vi.waitFor(() => {
        const cards = getDeclaredExperienceCards()
        expect(cards.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should render declared experience cards', () => {
      expect(getDeclaredExperienceCards().length).toBeGreaterThan(0)
    })

    BddTest().then('it should render cards with layout and spacing classes', () => {
      const cardsLayout = wrapper.find('[data-testid="cards-layout"]')
      expect(cardsLayout.classes()).toContain('av-col')
      expect(cardsLayout.classes()).toContain('av-gap-lg')
    })

    BddTest().then('it should not display the loader', () => {
      expect(getLoader().exists()).toBe(false)
    })

    const multiselectScenario = [
      { value: EExperienceType.PROFESSIONAL, label: 'Expérience professionnelle' },
      { value: EExperienceType.PERSONAL, label: 'Expérience personnelle' },
      { value: EExperienceType.VOLUNTEER, label: 'Engagement et/ou bénévolat' }
    ]

    multiselectScenario.forEach(({ value, label }) => {
      BddTest().and(`the user selects the ${label} experience type`, () => {
        beforeEach(async () => {
          const multiselect = getExperienceTypeMultiselect()
          multiselect.vm.$emit('update:modelValue', [{ value, label }])

          await vi.waitFor(() => {
            const cards = getDeclaredExperienceCards()
            expect(cards.length).toBeGreaterThan(0)
            expect(cards.every(card =>
              card.props('declaredExperience').experienceType === value)).toBe(true)
          })
        })

        BddTest().then('it should filter declared experience cards based on the selected experience type', () => {
          const cards = getDeclaredExperienceCards()
          expect(cards.length).toBeGreaterThan(0)
          expect(cards.every(card => card.props('declaredExperience').experienceType === value)).toBe(true)
        })
      })
    })
  })

  BddTest().when('the add action is triggered', () => {
    beforeEach(async () => {
      const dropdown = getDeclaredExperiencesMoreActionsDropdown()
      await dropdown.find('[data-testid="add"]').trigger('click')
    })

    BddTest().then('it should call the displayAddDeclaredExperienceDrawer action', () => {
      expect(mockDisplayAddDeclaredExperienceDrawer).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('there are no declared experiences', () => {
    beforeEach(async () => {
      server.use(declaredExperiencesQueryEmptyHandler)
      wrapper = mountComponent(DeclaredExperiencesTab, {
        global: { stubs }
      })
      await vi.waitFor(() => {
        const emptyState = getQuerySuspenseEmpty()
        expect(emptyState.exists()).toBe(true)
      })
    })

    BddTest().then('it should display the empty state message', () => {
      const emptyState = getQuerySuspenseEmpty()
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.text().length).toBeGreaterThan(0)
    })

    BddTest().then('it should not render declared experience cards', () => {
      expect(getDeclaredExperienceCards()).toHaveLength(0)
    })

    BddTest().then('it should not display the loader', () => {
      expect(getLoader().exists()).toBe(false)
    })

    BddTest().then('it should not render the pagination component', () => {
      expect(getPagination().exists()).toBe(false)
    })
  })

  BddTest().when('the query fails with an error', () => {
    beforeEach(async () => {
      server.use(declaredExperiencesQueryErrorHandler)
      wrapper = mountComponent(DeclaredExperiencesTab, {
        global: { stubs }
      })
      await vi.waitFor(() => {
        expect(getLoader().exists()).toBe(false)
      })
    })

    BddTest().then('it should not render declared experience cards', () => {
      expect(getDeclaredExperienceCards()).toHaveLength(0)
    })

    BddTest().then('it should not display the loader after error', () => {
      expect(getLoader().exists()).toBe(false)
    })

    BddTest().then('it should not display the empty state', () => {
      expect(getQuerySuspenseEmpty().exists()).toBe(false)
    })
  })
})
