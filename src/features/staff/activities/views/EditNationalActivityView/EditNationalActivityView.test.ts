import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { updateActivityErrorHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ROUTES } from '@/common/constants'
import { ActivityContentTabStub } from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityContentTab/ActivityContentTab.stub'
import EditNationalActivityView from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.vue'
import { type EditNationalActivityViewContext, editNationalActivityViewContextKey } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { type ExposedComponentInstance, mountComponent } from 'tests/utils'
import { vi } from 'vitest'

const mockMode = ref('edit')

vi.mock('@vueuse/router', () => ({
  useRouteQuery: vi.fn((key: string, defaultValue: string) => {
    if (key === 'mode') {
      return mockMode
    }
    return ref(defaultValue)
  })
}))

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    })),
  }
})

function getContext (wrapper: VueWrapper<InstanceType<typeof EditNationalActivityView>>): EditNationalActivityViewContext {
  const internalInstance = wrapper.vm as unknown as ExposedComponentInstance
  return internalInstance.$.provides[editNationalActivityViewContextKey] as EditNationalActivityViewContext
}

BddTest().given('a national activity view', () => {
  let wrapper: VueWrapper<InstanceType<typeof EditNationalActivityView>>

  const stubs = {
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    ActivityContentTab: ActivityContentTabStub,
  }

  const mountView = () => mountComponent(EditNationalActivityView, {
    props: { id: mockedActivityContent.id },
    global: { stubs },
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the view is mounted in add mode', () => {
    beforeEach(() => {
      mockMode.value = 'add'
      wrapper = mountView()
    })

    BddTest().then('it should render PageTitle with add props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe('Créer mon activité')
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Bibliothèque des activités', to: ROUTES.STAFF.ACTIVITIES },
        { text: 'Créer mon activité' }
      ])
      expect(pageTitle.props('back')).toBe(ROUTES.STAFF.ACTIVITIES)
    })
  })

  BddTest().when('the view is mounted in edit mode', () => {
    beforeEach(() => {
      mockMode.value = 'edit'
      wrapper = mountView()
    })

    BddTest().then('it should render PageTitle with edit props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe('Modifier l\'activité')
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Bibliothèque des activités', to: ROUTES.STAFF.ACTIVITIES },
        { text: 'Modifier l\'activité' }
      ])
      expect(pageTitle.props('back')).toBe(ROUTES.STAFF.ACTIVITIES)
    })
  })

  BddTest().when('the activity is loaded and save is triggered', () => {
    beforeEach(() => {
      mockMode.value = 'edit'
      wrapper = mountView()
    })

    BddTest().and('the update API succeeds', () => {
      beforeEach(() => {
        getContext(wrapper).save()
      })

      BddTest().then('it should call addSuccessMessage', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().then('it should call addSuccessMessage with the correct message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith('Activité enregistrée avec succès')
        })
      })
    })

    BddTest().and('the update API returns an error', () => {
      beforeEach(() => {
        server.use(updateActivityErrorHandler)
        getContext(wrapper).save()
      })

      BddTest().then('it should call addErrorMessage', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().then('it should call addErrorMessage with the correct title', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith(
            expect.objectContaining({
              title: 'Une erreur est survenue lors de l\'enregistrement de l\'activité',
            })
          )
        })
      })
    })
  })
})
