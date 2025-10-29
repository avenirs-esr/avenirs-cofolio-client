import type { VueWrapper } from '@vue/test-utils'
import { AdditionalSkillDateDetails, type AdditionalSkillDateDetailsProps } from '@/features/student/components/additionalSkills'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useDateUtils: () => ({
      formatTranslatedDateTime: (d: string) => `<${new Date(d).toISOString()}>`,
    }),
  }
})

BddTest().given('an AdditionalSkillDateDetails component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdditionalSkillDateDetails>>

  const AvIconTextStub = {
    name: 'AvIconText',
    props: ['icon', 'iconColor', 'text', 'textColor', 'inline'],
    template: `
      <div class="av-icon-text-stub">
        <span class="icon">{{ icon }}</span>
        <span class="text">{{ text }}</span>
      </div>
    `,
  }

  const mountWith = (props: AdditionalSkillDateDetailsProps) => {
    wrapper = mountComponent(AdditionalSkillDateDetails, {
      props,
      global: { stubs: { AvIconText: AvIconTextStub } },
      useI18n: true,
    })
  }

  const CREATED = '2025-01-10T09:30:00.000Z'
  const UPDATED = '2025-02-15T15:45:12.345Z'
  const CREATED_FMT = `<${new Date(CREATED).toISOString()}>`
  const UPDATED_FMT = `<${new Date(UPDATED).toISOString()}>`

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('both createdAt and updatedAt are provided', () => {
    beforeEach(() => {
      mountWith({ createdAt: CREATED, updatedAt: UPDATED })
    })

    BddTest().then('it should render two AvIconText stubs in order', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items).toHaveLength(2)

      expect(items[0].props('icon')).toBe(RI_ICONS.LOADER_LINE)
      expect(items[0].find('.text').text()).toContain(CREATED_FMT)

      expect(items[1].props('icon')).toBe(MDI_ICONS.PENCIL_OUTLINE)
      expect(items[1].find('.text').text()).toContain(UPDATED_FMT)
    })
  })

  BddTest().when('only createdAt is provided', () => {
    beforeEach(() => {
      mountWith({ createdAt: CREATED, updatedAt: undefined })
    })

    BddTest().then('it should render a single AvIconText for createdAt', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items).toHaveLength(1)
      expect(items[0].props('icon')).toBe(RI_ICONS.LOADER_LINE)
      expect(items[0].find('.text').text()).toContain(CREATED_FMT)
    })
  })

  BddTest().when('only updatedAt is provided', () => {
    beforeEach(() => {
      mountWith({ createdAt: undefined, updatedAt: UPDATED })
    })

    BddTest().then('it should render a single AvIconText for updatedAt', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items).toHaveLength(1)
      expect(items[0].props('icon')).toBe(MDI_ICONS.PENCIL_OUTLINE)
      expect(items[0].find('.text').text()).toContain(UPDATED_FMT)
    })
  })

  BddTest().when('no dates are provided', () => {
    beforeEach(() => {
      mountWith({ createdAt: undefined, updatedAt: undefined })
    })

    BddTest().then('it should render no AvIconText', () => {
      const items = wrapper.findAllComponents({ name: 'AvIconText' })
      expect(items).toHaveLength(0)
      expect(wrapper.find('.date-details').exists()).toBe(true)
    })
  })
})
