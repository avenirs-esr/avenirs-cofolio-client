import type { BaseApiException } from '@avenirs-esr/shared'
import type { VueWrapper } from '@vue/test-utils'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { ICONS } from '@/common/constants'
import { UserGroupsTableStub } from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserGroupsTable/UserGroupsTable.stub'
import UserGroupsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserGroupsSection/UserGroupsSection.vue'

BddTest().given('a user groups section', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserGroupsSection>>

  const mountWith = async (options: {
    user?: ExternalUserDetailDTO
    isLoading?: boolean
    error?: BaseApiException | null
  } = {}) => {
    wrapper = mountComponent(UserGroupsSection, {
      props: {
        user: options.user ?? mockExternalUserDetail,
        isLoading: options.isLoading,
        error: options.error,
      },
      global: {
        stubs: {
          AvIconText: AvIconTextStub,
          QuerySuspense: QuerySuspenseStub,
          UserGroupsTable: UserGroupsTableStub,
        },
      },
    })

    await flushPromises()
  }

  const getAvIconText = () => wrapper.findComponent(AvIconTextStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getUserGroupsTable = () => wrapper.findComponent(UserGroupsTableStub)

  BddTest().when('the section is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should display its title and icon', () => {
      expect(getAvIconText().exists()).toBe(true)
      expect(getAvIconText().props('text')).toBe('Groupes')
      expect(getAvIconText().props('icon')).toBe(ICONS.GROUPS)
    })

    BddTest().then('it should pass the loading state and error to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBeUndefined()
      expect(getQuerySuspense().props('error')).toBeNull()
    })

    BddTest().then('it should not consider the section empty when the user has groups', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })

    BddTest().then('it should pass the empty state message to QuerySuspense', () => {
      expect(getQuerySuspense().props('emptyStateMessage')).toBeTruthy()
    })

    BddTest().then('it should pass the user to the groups table', () => {
      expect(getUserGroupsTable().exists()).toBe(true)
      expect(getUserGroupsTable().props('user')).toEqual(mockExternalUserDetail)
    })
  })

  BddTest().when('the section receives loading and error props', () => {
    const error = { message: 'Request failed' } as BaseApiException

    beforeEach(async () => {
      await mountWith({
        isLoading: true,
        error,
      })
    })

    BddTest().then('it should pass the loading state and error to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
      expect(getQuerySuspense().props('error')).toStrictEqual(error)
    })
  })

  BddTest().when('the user has no groups outside the PROGRAM type', () => {
    beforeEach(async () => {
      await mountWith({
        user: {
          ...mockExternalUserDetail,
          groups: [],
        },
      })
    })

    BddTest().then('it should consider the section empty', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
    })

    BddTest().then('it should not display the groups table', () => {
      expect(getUserGroupsTable().exists()).toBe(false)
    })
  })
})
