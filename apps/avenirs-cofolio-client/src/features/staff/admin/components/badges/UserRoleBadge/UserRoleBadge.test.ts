import type { VueWrapper } from '@vue/test-utils'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { ERole } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import UserRoleBadge from '@/features/staff/admin/components/badges/UserRoleBadge/UserRoleBadge.vue'

BddTest().given('a user role badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserRoleBadge>>

  const mountWith = (role: ERole) => {
    wrapper = mount(UserRoleBadge, {
      props: { role },
      global: {
        stubs: {
          AvBadge: AvBadgeStub,
        },
      },
    })
  }

  const getBadge = () => wrapper.findComponent(AvBadgeStub)

  BddTest().when('the component is mounted with an ADMIN role', () => {
    beforeEach(() => {
      mountWith(ERole.ROLE_ADMIN)
    })

    BddTest().then('it should display the translated role label', () => {
      expect(getBadge().props('label')).toBe('Administrateur(rice) établissement')
    })

    BddTest().then('it should display the admin icon', () => {
      expect(getBadge().props('icon')).toBe(ICONS.ADMIN)
    })

    BddTest().then('it should apply the error colors', () => {
      expect(getBadge().props('backgroundColor')).toBe('var(--light-background-error)')
      expect(getBadge().props('color')).toBe('var(--light-foreground-error)')
    })
  })

  BddTest().when('the component is mounted with a STAFF role', () => {
    beforeEach(() => {
      mountWith(ERole.ROLE_STAFF)
    })

    BddTest().then('it should display the translated role label', () => {
      expect(getBadge().props('label')).toBe('Personnel')
    })

    BddTest().then('it should display the staff icon', () => {
      expect(getBadge().props('icon')).toBe(ICONS.STAFF)
    })

    BddTest().then('it should apply the info colors', () => {
      expect(getBadge().props('backgroundColor')).toBe('var(--light-background-info)')
      expect(getBadge().props('color')).toBe('var(--light-foreground-info)')
    })
  })

  BddTest().when('the component is mounted with a STUDENT role', () => {
    beforeEach(() => {
      mountWith(ERole.ROLE_STUDENT)
    })

    BddTest().then('it should display the translated role label', () => {
      expect(getBadge().props('label')).toBe('Étudiant')
    })

    BddTest().then('it should display the student icon', () => {
      expect(getBadge().props('icon')).toBe(ICONS.STUDENT)
    })

    BddTest().then('it should apply the success colors', () => {
      expect(getBadge().props('backgroundColor')).toBe('var(--light-background-success)')
      expect(getBadge().props('color')).toBe('var(--light-foreground-success)')
    })
  })

  BddTest().when('the component is mounted with a COMMON role', () => {
    beforeEach(() => {
      mountWith(ERole.ROLE_USER_BASE)
    })

    BddTest().then('it should display the translated role label', () => {
      expect(getBadge().props('label')).toBe('Utilisateur(rice) de base')
    })

    BddTest().then('it should display the user icon', () => {
      expect(getBadge().props('icon')).toBe(ICONS.USER)
    })

    BddTest().then('it should apply the neutral colors', () => {
      expect(getBadge().props('backgroundColor')).toBe('var(--light-background-neutral)')
      expect(getBadge().props('color')).toBe('var(--light-foreground-neutral)')
    })
  })

  BddTest().when('the badge is rendered', () => {
    beforeEach(() => {
      mountWith(ERole.ROLE_ADMIN)
    })

    BddTest().then('it should expose the user role badge test identifier', () => {
      expect(wrapper.find('[data-testid="user-role-badge"]').exists()).toBe(true)
    })
  })
})
