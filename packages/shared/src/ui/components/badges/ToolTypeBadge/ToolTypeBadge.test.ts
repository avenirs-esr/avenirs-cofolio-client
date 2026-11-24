import type { VueWrapper } from '@vue/test-utils'
import { EToolType } from '#shared/api/avenir-esr/index'
import { ICONS } from '#shared/constants/icons'
import ToolTypeBadge from '#shared/ui/components/badges/ToolTypeBadge/ToolTypeBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a tool type badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolTypeBadge>>

  const mountWith = (type: EToolType) => wrapper = mount(ToolTypeBadge, {
    props: { type },
    global: { stubs: { AvBadge: AvBadgeStub } }
  })

  const NATIONAL_LABEL = 'National'
  const REGIONAL_LABEL = 'Régional'
  const LOCAL_LABEL = 'Établissement'

  const getBadge = () => wrapper.findComponent(AvBadgeStub)

  BddTest().when('the component is mounted with NATIONAL type', () => {
    beforeEach(() => {
      mountWith(EToolType.NATIONAL)
    })

    BddTest().then('it should display the translated national label', () => {
      expect(getBadge().props('label')).toBe(NATIONAL_LABEL)
    })

    BddTest().then('it should display the national icon', () => {
      expect(getBadge().props('icon')).toBe(ICONS.NATIONAL)
    })

    BddTest().then('it should apply the national colors', () => {
      expect(getBadge().props('backgroundColor')).toBe('var(--light-background-primary1)')
      expect(getBadge().props('color')).toBe('var(--light-foreground-primary1)')
    })
  })

  BddTest().when('the component is mounted with REGIONAL type', () => {
    beforeEach(() => {
      mountWith(EToolType.REGIONAL)
    })

    BddTest().then('it should display the translated regional label', () => {
      expect(getBadge().props('label')).toBe(REGIONAL_LABEL)
    })

    BddTest().then('it should display the regional icon', () => {
      expect(getBadge().props('icon')).toBe(ICONS.REGIONAL)
    })

    BddTest().then('it should apply the regional colors', () => {
      expect(getBadge().props('backgroundColor')).toBe('var(--light-background-primary2)')
      expect(getBadge().props('color')).toBe('var(--light-foreground-primary2)')
    })
  })

  BddTest().when('the component is mounted with LOCAL type', () => {
    beforeEach(() => {
      mountWith(EToolType.LOCAL)
    })

    BddTest().then('it should display the translated local label', () => {
      expect(getBadge().props('label')).toBe(LOCAL_LABEL)
    })

    BddTest().then('it should display the local icon', () => {
      expect(getBadge().props('icon')).toBe(ICONS.LOCAL)
    })

    BddTest().then('it should apply the local colors', () => {
      expect(getBadge().props('backgroundColor')).toBe('var(--light-background-primary3)')
      expect(getBadge().props('color')).toBe('var(--light-foreground-primary3)')
    })
  })
})
