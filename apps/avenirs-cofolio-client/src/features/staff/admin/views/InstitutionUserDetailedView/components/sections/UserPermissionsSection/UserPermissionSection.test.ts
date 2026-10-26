import type { VueWrapper } from '@vue/test-utils'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { ICONS } from '@/common/constants'
import UserPermissionsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserPermissionsSection/UserPermissionsSection.vue'

BddTest().given('a user permissions section', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserPermissionsSection>>

  const mountWith = async (options: {
    user?: ExternalUserDetailDTO
    isLoading?: boolean
    error?: BaseApiException | null
  } = {}) => {
    wrapper = mountComponent(UserPermissionsSection, {
      props: {
        user: options.user ?? mockExternalUserDetail,
        isLoading: options.isLoading,
        error: options.error,
      },
      global: {
        stubs: {
          AvIconText: AvIconTextStub,
          QuerySuspense: QuerySuspenseStub,
        },
      },
    })
  }

  const getAvIconText = () => wrapper.findComponent(AvIconTextStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)

  BddTest().when('the section is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should display its title and icon', () => {
      expect(getAvIconText().exists()).toBe(true)
      expect(getAvIconText().props('text')).toBe('Rôles et permissions')
      expect(getAvIconText().props('icon')).toBe(ICONS.PERMISSIONS)
    })

    BddTest().then('it should pass the loading state and error to QuerySuspense', () => {
      expect(getQuerySuspense().exists()).toBe(true)
      expect(getQuerySuspense().props('isLoading')).toBeUndefined()
      expect(getQuerySuspense().props('error')).toBeNull()
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
})
