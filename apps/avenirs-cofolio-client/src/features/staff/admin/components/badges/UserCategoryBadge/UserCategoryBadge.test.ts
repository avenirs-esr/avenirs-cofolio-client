import type { VueWrapper } from '@vue/test-utils/dist/src'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ICONS } from '@avenirs-esr/shared'
import { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'
import UserCategoryBadge from '@/features/staff/admin/components/badges/UserCategoryBadge/UserCategoryBadge.vue'

BddTest().given('a user category badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserCategoryBadge>>

  const mountWith = (category: EUserCategory) => wrapper = mount(UserCategoryBadge, {
    props: { category },
    global: {
      stubs: { AvBadge: AvBadgeStub },

    },
  })

  const STAFF_LABEL = 'Enseignant(e)'
  const STUDENT_LABEL = 'Apprenant(e)'

  const getBadge = () => wrapper.findComponent(AvBadgeStub)

  BddTest().when('the component is mounted with STAFF category', () => {
    beforeEach(() => {
      mountWith(EUserCategory.STAFF)
    })

    BddTest().then('it should pass the staff icon, colors and label to the badge', () => {
      expect(getBadge().props('icon')).toBe(ICONS.STAFF)
      expect(getBadge().props('label')).toBe(STAFF_LABEL)
      expect(getBadge().props('color')).toBe('var(--light-foreground-critical)')
      expect(getBadge().props('backgroundColor')).toBe('var(--light-background-critical)')
    })
  })

  BddTest().when('the component is mounted with STUDENT category', () => {
    beforeEach(() => {
      mountWith(EUserCategory.STUDENT)
    })

    BddTest().then('it should pass the student icon, colors and label to the badge', () => {
      expect(getBadge().props('icon')).toBe(ICONS.STUDENT)
      expect(getBadge().props('label')).toBe(STUDENT_LABEL)
      expect(getBadge().props('color')).toBe('var(--light-foreground-primary3)')
      expect(getBadge().props('backgroundColor')).toBe('var(--light-background-primary3)')
    })
  })
})
