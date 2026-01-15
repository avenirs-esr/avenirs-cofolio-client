import type { VueWrapper } from '@vue/test-utils'
import { declaredExperiencesQueryEmptyHandler, declaredExperiencesQueryErrorHandler } from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { DeclaredExperienceCardStub } from '@/features/student/personalCareer/components/cards/DeclaredExperienceCard/DeclaredExperienceCard.stub'
import DeclaredExperiencesTab from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperiencesTab/DeclaredExperiencesTab.vue'
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

vi.mock('@/features/student/personalCareer/stores/personalCareer.store', () => ({
  usePersonalCareerStore: vi.fn(() => ({
    declaredExperiencesCurrentPage: ref(0),
    declaredExperiencesPageSizeSelected: ref(PageSizes.FOUR)
  }))
}))

BddTest().given('a declared experiences tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperiencesTab>>

  const stubs = {
    DeclaredExperienceCard: DeclaredExperienceCardStub,
    Pagination: PaginationStub,
    Loader: LoaderStub,
    AvIconText: AvIconTextStub
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    wrapper = mountComponent(DeclaredExperiencesTab, {
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

    BddTest().then('it should render the pagination component', () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.exists()).toBe(true)
    })
  })

  BddTest().when('declared experiences data is loaded', () => {
    beforeEach(async () => {
      await vi.waitFor(() => {
        const cards = wrapper.findAllComponents({ name: 'DeclaredExperienceCard' })
        expect(cards.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should render declared experience cards', () => {
      const cards = wrapper.findAllComponents({ name: 'DeclaredExperienceCard' })
      expect(cards.length).toBeGreaterThan(0)
    })

    BddTest().then('it should render cards with layout and spacing classes', () => {
      const cards = wrapper.findAllComponents({ name: 'DeclaredExperienceCard' })
      const firstCard = cards[0]
      expect(firstCard.classes()).toContain('av-col')
      expect(firstCard.classes()).toContain('av-gap-lg')
      expect(firstCard.classes()).toContain('av-py-md')
    })

    BddTest().then('it should not display the loader', () => {
      const loaderSpinner = wrapper.find('[data-testid="loader-stub"]')
      expect(loaderSpinner.exists()).toBe(false)
    })
  })

  BddTest().when('there are no declared experiences', () => {
    beforeEach(async () => {
      server.use(declaredExperiencesQueryEmptyHandler)
      wrapper = mountComponent(DeclaredExperiencesTab, {
        global: { stubs }
      })
      await vi.waitFor(() => {
        const emptyState = wrapper.find('.av-row.av-justify-center.av-my-md')
        expect(emptyState.exists()).toBe(true)
      })
    })

    BddTest().then('it should display the empty state message', () => {
      const emptyState = wrapper.find('.av-row.av-justify-center.av-my-md')
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.find('.s2-regular').exists()).toBe(true)
    })

    BddTest().then('it should not render declared experience cards', () => {
      const cards = wrapper.findAllComponents({ name: 'DeclaredExperienceCard' })
      expect(cards).toHaveLength(0)
    })

    BddTest().then('it should not display the loader', () => {
      const loaderSpinner = wrapper.find('[data-testid="loader-stub"]')
      expect(loaderSpinner.exists()).toBe(false)
    })

    BddTest().then('it should render the pagination component', () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.exists()).toBe(true)
    })
  })

  BddTest().when('the query fails with an error', () => {
    beforeEach(async () => {
      server.use(declaredExperiencesQueryErrorHandler)
      wrapper = mountComponent(DeclaredExperiencesTab, {
        global: { stubs }
      })
      await vi.waitFor(() => {
        const loaderSpinner = wrapper.find('[data-testid="loader-stub"]')
        expect(loaderSpinner.exists()).toBe(false)
      })
    })

    BddTest().then('it should not render declared experience cards', () => {
      const cards = wrapper.findAllComponents({ name: 'DeclaredExperienceCard' })
      expect(cards).toHaveLength(0)
    })

    BddTest().then('it should not display the loader after error', () => {
      const loaderSpinner = wrapper.find('[data-testid="loader-stub"]')
      expect(loaderSpinner.exists()).toBe(false)
    })

    BddTest().then('it should not display the empty state', () => {
      const emptyState = wrapper.find('.av-row.av-justify-center.av-my-md')
      expect(emptyState.exists()).toBe(false)
    })
  })
})
