import { activityNavigationQueryError } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { EActivityThematic } from '@/api/avenir-esr'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import ActivitiesPreviousNextNavigation from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesPreviousNextNavigation/ActivitiesPreviousNextNavigation.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentProjectActivitiesCatalogMock = vi.fn()

vi.mock('@/common/composables', () => {
  return {
    useNavigation: () => ({
      navigateToStudentProjectActivitiesCatalog: navigateToStudentProjectActivitiesCatalogMock,
    }),
  }
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    onBeforeRouteLeave: vi.fn(),
    useRoute: () => ({
      params: {
        get id () { return '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1' },
        get thematic () { return EActivityThematic.SELF_KNOWLEDGE }
      }
    })
  }
})

BddTest().given('an activities previous/next navigation component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesPreviousNextNavigation>>

  const stubs = {
    AvButton: AvButtonStub,
    Loader: LoaderStub
  }

  BddTest().when('the component is mounted with no activities', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      server.use(activityNavigationQueryError)

      wrapper = mountComponent(ActivitiesPreviousNextNavigation, { global: { stubs } })
    })

    BddTest().then('it should not render any AvButton components', async () => {
      await flushPromises()

      const buttons = wrapper.findAllComponents(AvButtonStub)
      expect(buttons.length).toBe(0)
    })
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mountComponent(ActivitiesPreviousNextNavigation, { global: { stubs } })
    })

    BddTest().then('it should render two AvButton components', async () => {
      await flushPromises()

      const buttons = wrapper.findAllComponents(AvButtonStub)
      expect(buttons.length).toBe(2)
    })

    BddTest().and('the user clicks the previous button', () => {
      beforeEach(async () => {
        await flushPromises()
        const previousButton = wrapper.find('[data-testid="previous-activity-button"]')
        await previousButton.trigger('click')
        await flushPromises()
      })

      BddTest().then('it should navigate to the catalog', () => {
        expect(navigateToStudentProjectActivitiesCatalogMock).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('the user clicks the next button', () => {
      beforeEach(async () => {
        await flushPromises()
        const nextButton = wrapper.find('[data-testid="next-activity-button"]')
        await nextButton.trigger('click')
        await flushPromises()
      })

      BddTest().then('it should navigate to the catalog', () => {
        expect(navigateToStudentProjectActivitiesCatalogMock).toHaveBeenCalledTimes(1)
      })
    })
  })
})
