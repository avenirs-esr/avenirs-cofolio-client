import type { PagedResponseDeclaredActivityViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivitiesOverview } from '@/__mocks__/fixtures/student/activities.fixtures'
import { createDeclaredActivitiesViewHandler, libraryActivitiesErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { ValorizedElementsCardContainerStub } from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.stub'
import ValorizedActivitiesContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedActivitiesContainer/ValorizedActivitiesContainer.vue'
import { ValorizedActivityItemStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedActivityItem/ValorizedActivityItem.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { vi } from 'vitest'

BddTest().given('a valorized activities container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedActivitiesContainer>>
  let requestedParams: URLSearchParams

  const stubs = {
    ValorizedElementsCardContainer: ValorizedElementsCardContainerStub,
    ValorizedActivityItem: ValorizedActivityItemStub
  }

  const createResponse = (count: number): PagedResponseDeclaredActivityViewDTO => ({
    data: mockedDeclaredActivitiesOverview.slice(0, count),
    page: { pageSize: 100, totalElements: count, totalPages: count > 0 ? 1 : 0, page: 0 }
  })

  const mountActivitiesContainer = async () => {
    wrapper = mountComponent(ValorizedActivitiesContainer, { global: { stubs } })
    await vi.waitFor(() => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('isLoading')).toBe(false)
    })
  }

  BddTest().when('the request succeeds with 3 declared activities', () => {
    const mockedResponse = createResponse(3)

    beforeEach(async () => {
      server.use(createDeclaredActivitiesViewHandler(mockedResponse, (params) => {
        requestedParams = params
      }))

      await mountActivitiesContainer()
    })

    BddTest().then('it should fetch valorized activities with a page size of 100', () => {
      expect(requestedParams.get('isValorized')).toBe('true')
      expect(requestedParams.get('pageSize')).toBe('100')
    })

    BddTest().then('it should render the title with the total elements count', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.exists()).toBe(true)
      expect(container.props('title')).toContain('(3)')
    })

    BddTest().then('it should not be loading, have no error and not be empty once fetched', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.props('isLoading')).toBe(false)
      expect(container.props('error')).toBe(null)
      expect(container.props('isEmpty')).toBe(false)
    })

    BddTest().then('it should render one ValorizedActivityItem per declared activity', () => {
      const items = wrapper.findAllComponents(ValorizedActivityItemStub)
      expect(items).toHaveLength(3)
      mockedResponse.data.forEach((activity, index) => {
        expect(items[index].props('activity')).toEqual(activity)
      })
    })

    BddTest().then('it should pass the empty state message and link to the activity library', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.props('emptyStateMessage')).toContain('activité')
      expect(container.props('seeAllLabel')).toContain('activités')
      expect(container.props('seeAllTo')).toEqual({
        name: 'student-tools-kit-activities',
        query: { tab: 'ACTIVITY_LIBRARY' }
      })
    })
  })

  BddTest().when('the request succeeds with a single declared activity', () => {
    const mockedResponse = createResponse(1)

    beforeEach(async () => {
      server.use(createDeclaredActivitiesViewHandler(mockedResponse))

      await mountActivitiesContainer()
    })

    BddTest().then('it should render a title with the total count', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toContain('(1)')
    })

    BddTest().then('it should render a single ValorizedActivityItem', () => {
      expect(wrapper.findAllComponents(ValorizedActivityItemStub)).toHaveLength(1)
    })
  })

  BddTest().when('the request succeeds with 0 declared activities', () => {
    const mockedResponse = createResponse(0)

    beforeEach(async () => {
      server.use(createDeclaredActivitiesViewHandler(mockedResponse))

      await mountActivitiesContainer()
    })

    BddTest().then('it should render no ValorizedActivityItem', () => {
      expect(wrapper.findAllComponents(ValorizedActivityItemStub)).toHaveLength(0)
    })

    BddTest().then('it should mark the container as empty', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('isEmpty')).toBe(true)
    })
  })

  BddTest().when('the request fails', () => {
    beforeEach(async () => {
      server.use(libraryActivitiesErrorHandler)

      await mountActivitiesContainer()
    })

    BddTest().then('it should forward the error to the card container', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('error')).toBeTruthy()
    })
  })
})
