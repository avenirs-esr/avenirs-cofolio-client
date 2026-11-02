import type { BaseApiException } from '@avenirs-esr/shared'
import type { VueWrapper } from '@vue/test-utils'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { EUniverse } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { ICONS } from '@/common/constants'
import { UserDetailsTableStub } from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserDetailsTable/UserDetailsTable.stub'
import UserDetailsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserDetailsSection/UserDetailsSection.vue'

BddTest().given('a user details section', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserDetailsSection>>

  const stubs = {
    AvIconText: AvIconTextStub,
    QuerySuspense: QuerySuspenseStub,
    UserDetailsTable: UserDetailsTableStub,
  }

  const mountWith = async (options: {
    userId?: string
    isLoading?: boolean
    error?: BaseApiException | null
  } = {}) => {
    const user: ExternalUserDetailDTO = {
      ...mockExternalUserDetail,
      id: options.userId ?? mockExternalUserDetail.id,
    }

    wrapper = mountComponent(UserDetailsSection, {
      props: {
        user,
        isLoading: options.isLoading,
        error: options.error,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getAvIconText = () => wrapper.findComponent(AvIconTextStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getUserDetailsTable = () => wrapper.findComponent(UserDetailsTableStub)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the section is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should display its title and icon', () => {
      expect(getAvIconText().exists()).toBe(true)
      expect(getAvIconText().props('text')).toBe('Informations générales')
      expect(getAvIconText().props('icon')).toBe(ICONS.USER)
      expect(getAvIconText().props('iconColor')).toBe('var(--text2)')
      expect(getAvIconText().props('typographyClass')).toBe('n4')
    })

    BddTest().then('it should pass the loading state and error to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBeNull()
    })

    BddTest().then('it should pass the user to the details table', () => {
      expect(getUserDetailsTable().exists()).toBe(true)
      expect(getUserDetailsTable().props('user')).toEqual(mockExternalUserDetail)
    })

    BddTest().then('it should pass both universes to the details table', () => {
      expect(getUserDetailsTable().props('universes')).toEqual([
        EUniverse.STAFF,
        EUniverse.STUDENT,
      ])
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

  BddTest().when('the user has only staff authorizations', () => {
    beforeEach(async () => {
      await mountWith({ userId: 'STAFF_ONLY_ID' })
    })

    BddTest().then('it should pass only the STAFF universe to the details table', () => {
      expect(getUserDetailsTable().props('universes')).toEqual([EUniverse.STAFF])
    })
  })

  BddTest().when('the user has only student authorizations', () => {
    beforeEach(async () => {
      await mountWith({ userId: 'STUDENT_ONLY_ID' })
    })

    BddTest().then('it should pass only the STUDENT universe to the details table', () => {
      expect(getUserDetailsTable().props('universes')).toEqual([EUniverse.STUDENT])
    })
  })

  BddTest().when('the user has no authorizations', () => {
    beforeEach(async () => {
      await mountWith({ userId: 'INVALID_USER_ID' })
    })

    BddTest().then('it should not render the details table', () => {
      expect(getUserDetailsTable().exists()).toBe(false)
    })
  })

  BddTest().when('the user has no id', () => {
    beforeEach(async () => {
      await mountWith({ userId: '' })
    })

    BddTest().then('it should pass an empty list of universes to the details table', () => {
      expect(getUserDetailsTable().props('universes')).toEqual([])
    })
  })
})
