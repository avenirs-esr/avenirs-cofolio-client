import type { VueWrapper } from '@vue/test-utils'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { EUniverse } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import { UserDetailsTableStub } from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserDetailsTable/UserDetailsTable.stub'
import UserDetailsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserDetailsSection/UserDetailsSection.vue'

BddTest().given('a user details section', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserDetailsSection>>

  const mountWith = async (userId = mockExternalUserDetail.id) => {
    const user: ExternalUserDetailDTO = {
      ...mockExternalUserDetail,
      id: userId,
    }

    wrapper = mountComponent(UserDetailsSection, {
      props: { user },
      global: {
        stubs: {
          AvIconText: AvIconTextStub,
          UserDetailsTable: UserDetailsTableStub,
        },
      },
    })

    await flushPromises()
  }

  const getAvIconText = () => wrapper.findComponent(AvIconTextStub)
  const getUserDetailsTable = () => wrapper.findComponent(UserDetailsTableStub)

  BddTest().when('the section is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should display its title and icon', () => {
      expect(getAvIconText().exists()).toBe(true)
      expect(getAvIconText().props('text')).toBe('Informations générales')
      expect(getAvIconText().props('icon')).toBe(ICONS.USER)
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

  BddTest().when('the user has only staff authorizations', () => {
    beforeEach(async () => {
      await mountWith('STAFF_ONLY_ID')
    })

    BddTest().then('it should pass only the STAFF universe to the details table', () => {
      expect(getUserDetailsTable().props('universes')).toEqual([EUniverse.STAFF])
    })
  })

  BddTest().when('the user has only student authorizations', () => {
    beforeEach(async () => {
      await mountWith('STUDENT_ONLY_ID')
    })

    BddTest().then('it should pass only the STUDENT universe to the details table', () => {
      expect(getUserDetailsTable().props('universes')).toEqual([EUniverse.STUDENT])
    })
  })
})
