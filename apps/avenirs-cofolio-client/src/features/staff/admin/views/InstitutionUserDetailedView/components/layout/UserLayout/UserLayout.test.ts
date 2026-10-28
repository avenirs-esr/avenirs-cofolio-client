import type { BaseApiException } from '@avenirs-esr/shared'
import type { VueWrapper } from '@vue/test-utils'
import type { SectionNavigationItem } from '@/common/components/layout/SectionNavigationLayout/SectionNavigationLayout.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { SectionNavigationLayoutStub } from '@/common/components/layout/SectionNavigationLayout/SectionNavigationLayout.stub'
import { ICONS } from '@/common/constants'
import UserLayout from '@/features/staff/admin/views/InstitutionUserDetailedView/components/layout/UserLayout/UserLayout.vue'
import UserDetailsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserDetailsSection/UserDetailsSection.vue'
import UserGroupsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserGroupsSection/UserGroupsSection.vue'
import UserPermissionsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserPermissionsSection/UserPermissionsSection.vue'
import UserProgramsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserProgramsSection/UserProgramsSection.vue'
import { UserSections } from '@/features/staff/admin/views/InstitutionUserDetailedView/InstitutionUserDetailedView.types'

const { routeMock, replaceMock } = vi.hoisted(() => ({
  routeMock: {
    name: '',
    fullPath: '',
    query: {} as Record<string, string>,
    matched: [],
  },
  replaceMock: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => routeMock,
  useRouter: () => ({
    push: vi.fn(),
    replace: replaceMock,
  }),
}))

BddTest().given('a user layout component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserLayout>>

  const stubs = {
    SectionNavigationLayout: SectionNavigationLayoutStub,
  }

  const mountWith = async (props: {
    isLoading?: boolean
    error?: BaseApiException | null
  } = {}) => {
    wrapper = mountComponent(UserLayout, {
      props: {
        user: mockExternalUserDetail,
        ...props,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getSectionNavigationLayout = () => wrapper.findComponent(SectionNavigationLayoutStub)

  beforeEach(() => {
    routeMock.name = 'staff-admin-user'
    routeMock.fullPath = '/staff/admin/users/user-1'
    routeMock.query = {}
    replaceMock.mockReset()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the section navigation layout', () => {
      expect(getSectionNavigationLayout().exists()).toBe(true)
    })

    BddTest().then('it should pass the default section', () => {
      expect(getSectionNavigationLayout().props('defaultSection')).toBe(UserSections.DETAILS)
    })

    BddTest().then('it should pass the select placeholder', () => {
      expect(getSectionNavigationLayout().props('selectPlaceholder')).toBe('Accéder à')
    })

    BddTest().then('it should pass the expected navigation items', () => {
      const items = getSectionNavigationLayout().props('items') as SectionNavigationItem[]

      expect(items).toEqual([
        {
          id: UserSections.DETAILS,
          label: 'Détails',
          icon: ICONS.USER,
        },
        {
          id: UserSections.PROGRAMS,
          label: 'Formations',
          icon: ICONS.PROGRAMS,
        },
        {
          id: UserSections.GROUPS,
          label: 'Groupes',
          icon: ICONS.GROUPS,
        },
        {
          id: UserSections.PERMISSIONS,
          label: 'Permissions',
          icon: ICONS.PERMISSIONS,
        },
      ])
    })

    BddTest().then('it should pass the expected components by section', () => {
      const componentBySection = getSectionNavigationLayout().props(
        'componentBySection',
      ) as Record<string, unknown>

      expect(componentBySection[UserSections.DETAILS]).toBe(UserDetailsSection)
      expect(componentBySection[UserSections.PROGRAMS]).toBe(UserProgramsSection)
      expect(componentBySection[UserSections.GROUPS]).toBe(UserGroupsSection)
      expect(componentBySection[UserSections.PERMISSIONS]).toBe(UserPermissionsSection)
    })

    BddTest().then('it should pass the user to every section', () => {
      const propsBySection = getSectionNavigationLayout().props('propsBySection')

      expect(propsBySection).toEqual({
        [UserSections.DETAILS]: {
          user: mockExternalUserDetail,
          isLoading: false,
          error: undefined,
        },
        [UserSections.PROGRAMS]: {
          user: mockExternalUserDetail,
          isLoading: false,
          error: undefined,
        },
        [UserSections.GROUPS]: {
          user: mockExternalUserDetail,
          isLoading: false,
          error: undefined,
        },
        [UserSections.PERMISSIONS]: {
          user: mockExternalUserDetail,
          isLoading: false,
          error: undefined,
        },
      })
    })

    BddTest().then('it should configure the side navigation width', () => {
      expect(getSectionNavigationLayout().props('sideNavigationWidth')).toBe('fit-content')
    })
  })

  BddTest().when('the component receives loading and error props', () => {
    const error = { message: 'Request failed' } as BaseApiException

    beforeEach(async () => {
      await mountWith({
        isLoading: true,
        error,
      })
    })

    BddTest().then('it should pass loading and error to every section', () => {
      const propsBySection = getSectionNavigationLayout().props('propsBySection')

      expect(propsBySection).toEqual({
        [UserSections.DETAILS]: {
          user: mockExternalUserDetail,
          isLoading: true,
          error,
        },
        [UserSections.PROGRAMS]: {
          user: mockExternalUserDetail,
          isLoading: true,
          error,
        },
        [UserSections.GROUPS]: {
          user: mockExternalUserDetail,
          isLoading: true,
          error,
        },
        [UserSections.PERMISSIONS]: {
          user: mockExternalUserDetail,
          isLoading: true,
          error,
        },
      })
    })
  })

  BddTest().when('a section label is selected', () => {
    beforeEach(async () => {
      await mountWith()

      getSectionNavigationLayout().vm.$emit('selectedItemLabel', 'Programmes')
    })

    BddTest().then('it should emit the selected section label', () => {
      expect(wrapper.emitted('selectedSection')).toEqual([
        ['Programmes'],
      ])
    })
  })

  BddTest().when('a section is selected from navigation', () => {
    beforeEach(async () => {
      await mountWith()

      getSectionNavigationLayout().vm.$emit('selectedItem', {
        itemId: UserSections.GROUPS,
      })
    })

    BddTest().then('it should navigate using the selected section query param', () => {
      expect(replaceMock).toHaveBeenCalledWith({
        query: {
          section: UserSections.GROUPS,
        },
      })
    })
  })

  BddTest().when('the section query param targets programs', () => {
    beforeEach(async () => {
      routeMock.query = {
        section: UserSections.PROGRAMS,
      }

      await mountWith()
    })

    BddTest().then('it should use programs as the default section', () => {
      expect(getSectionNavigationLayout().props('defaultSection')).toBe(
        UserSections.PROGRAMS,
      )
    })
  })
})
