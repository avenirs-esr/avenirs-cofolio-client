import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockExternalUser } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { mockGroup } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { DetailedPageTitleStub } from '@/common/components/navigation/DetailedPageTitle/DetailedPageTitle.stub'
import { staffAdminGroupRoute } from '@/features/staff/admin/routes'
import InstitutionUserDetailedView from '@/features/staff/admin/views/InstitutionUserDetailedView/InstitutionUserDetailedView.vue'

const route = reactive<{ name: string }>({
  name: 'staff-home',
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => route,
  }
})

BddTest().given('an institution user detailed view', () => {
  let wrapper: VueWrapper<InstanceType<typeof InstitutionUserDetailedView>>

  const stubs = {
    DetailedPageTitle: DetailedPageTitleStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const mountWith = async (userId: string, groupId?: string) => {
    wrapper = mountComponent(InstitutionUserDetailedView, {
      props: { userId, groupId },
      global: { stubs },
    })

    await flushPromises()
  }

  const getPageTitle = () => wrapper.findComponent(DetailedPageTitleStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)

  beforeEach(() => {
    vi.clearAllMocks()
    route.name = 'staff-home'
  })

  BddTest().when('the user exists outside the groups route', () => {
    beforeEach(async () => {
      await mountWith(mockExternalUser.externalId!)
    })

    BddTest().then('it should display the user full name as the page title', () => {
      expect(getPageTitle().props('title')).toBe('Alice Dupont')
    })

    BddTest().then('it should display only the user name in the trailing links', () => {
      expect(getPageTitle().props('trailingLinks')).toEqual([
        { text: 'Alice Dupont' },
      ])
    })

    BddTest().then('it should pass the query error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBeNull()
    })
  })

  BddTest().when('the user exists on the groups route with a group id', () => {
    beforeEach(async () => {
      route.name = String(staffAdminGroupRoute.name)
      await mountWith(mockExternalUser.externalId!, mockGroup.id)
    })

    BddTest().then('it should display the user full name as the page title', () => {
      expect(getPageTitle().props('title')).toBe('Alice Dupont')
    })

    BddTest().then('it should display the group and user names in the trailing links', () => {
      expect(getPageTitle().props('trailingLinks')).toEqual([
        {
          text: mockGroup.name,
          to: {
            name: staffAdminGroupRoute.name,
            params: { id: mockGroup.id },
          },
        },
        { text: 'Alice Dupont' },
      ])
    })

    BddTest().then('it should pass the query error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBeNull()
    })
  })

  BddTest().when('the user exists on the groups route without a group id', () => {
    beforeEach(async () => {
      route.name = String(staffAdminGroupRoute.name)
      await mountWith(mockExternalUser.externalId!)
    })

    BddTest().then('it should display only the user name in the trailing links', () => {
      expect(getPageTitle().props('trailingLinks')).toEqual([
        { text: 'Alice Dupont' },
      ])
    })
  })

  BddTest().when('the user does not exist', () => {
    beforeEach(async () => {
      await mountWith('INVALID_USER_ID')
    })

    BddTest().then('it should display an empty page title', () => {
      expect(getPageTitle().props('title')).toBe('')
    })

    BddTest().then('it should display an empty trailing link', () => {
      expect(getPageTitle().props('trailingLinks')).toEqual([
        { text: '' },
      ])
    })

    BddTest().then('it should pass the query error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBeTruthy()
    })
  })
})
