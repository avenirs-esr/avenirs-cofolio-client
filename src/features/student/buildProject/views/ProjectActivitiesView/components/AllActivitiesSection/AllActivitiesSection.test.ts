import type { VueWrapper } from '@vue/test-utils'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import AllActivitiesSection from '@/features/student/buildProject/views/ProjectActivitiesView/components/AllActivitiesSection/AllActivitiesSection.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { mountComponent } from 'tests/utils'

let paginationMock: ReturnType<typeof createUsePaginationMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => {
  return {
    usePagination: vi.fn(() => paginationMock)
  }
})

BddTest().given('an all activities section', () => {
  let wrapper: VueWrapper<InstanceType<typeof AllActivitiesSection>>

  const stubs = {
    AvIconText: AvIconTextStub,
    Pagination: PaginationStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      paginationMock = createUsePaginationMock()

      wrapper = mountComponent(AllActivitiesSection, { global: { stubs } })
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toContain('Toutes les activités')
    })

    BddTest().then('it should render the pagination', () => {
      expect(wrapper.findComponent(PaginationStub).exists()).toBe(true)
    })
  })
})
