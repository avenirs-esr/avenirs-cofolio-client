import type { VueWrapper } from '@vue/test-utils'
import { type DeclaredSkillCategoryDTO, EExternalSkillCategoryType, EExternalSkillType } from '@/api/avenir-esr'
import DeclaredSkillRefCard from '@/features/student/declaredSkills/components/cards/DeclaredSkillRefCard/DeclaredSkillRefCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const AvCardStub = {
  name: 'AvCard',
  props: ['borderColor'],
  template: `<div class="av-card"><slot /></div>`,
}

const AvIconTextStub = {
  name: 'AvIconText',
  props: ['icon', 'iconColor', 'text', 'textColor', 'inline'],
  template: `<div class="av-icon-text"><span class="text">{{ text }}</span></div>`,
}

BddTest().given('a DeclaredSkillRefCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredSkillRefCard>>

  const makeSegments = (n = 2): DeclaredSkillCategoryDTO[] => {
    const base: DeclaredSkillCategoryDTO[] = [
      { type: EExternalSkillCategoryType.MACRO_SKILL, libelle: 'Langues' },
      { type: EExternalSkillCategoryType.DOMAIN, libelle: 'Anglais' },
    ]
    if (n <= 0) {
      return []
    }
    if (n === 1) {
      return [base[0]]
    }
    return base
  }

  const mountWith = (opts: { type?: EExternalSkillType, segmentsCount?: number } = {}) => {
    const type: EExternalSkillType = opts.type ?? EExternalSkillType.ROME4
    const pathSegments = makeSegments(opts.segmentsCount ?? 2)

    wrapper = mountComponent(DeclaredSkillRefCard, {
      props: { type, pathSegments },
      global: {
        stubs: {
          AvCard: AvCardStub,
          AvIcon: AvIconStub,
          AvBadge: AvBadgeStub,
          AvIconText: AvIconTextStub,
        },
      },
      useI18n: true,
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('rendered with 2 path segments', () => {
    beforeEach(() => {
      mountWith({ segmentsCount: 2 })
    })

    BddTest().then('it should render the container and card blocks', () => {
      expect(wrapper.find('.ref--container').exists()).toBe(true)
      expect(wrapper.find('.av-card').exists()).toBe(true)
      expect(wrapper.find('.ref--content').exists()).toBe(true)
      expect(wrapper.find('.ref--type').exists()).toBe(true)
    })

    BddTest().then('it should render a circle icon and a type badge', () => {
      const icons = wrapper.findAllComponents(AvIconStub)
      expect(icons.length).toBeGreaterThan(0)
      const circle = icons.find(i => i.props('name') === MDI_ICONS.CIRCLE)
      expect(circle).toBeTruthy()

      const badges = wrapper.findAllComponents(AvBadgeStub)
      expect(badges.length).toBeGreaterThan(0)
    })

    BddTest().then('it should render one AvIconText for the first segment and a final badge for the last segment', () => {
      const iconTexts = wrapper.findAll('.ref--item .av-icon-text')
      expect(iconTexts.length).toBe(1)
      expect(iconTexts[0].find('.text').text()).toContain('Langues')

      const lastSegment = wrapper.find('.ref--last-segment')
      expect(lastSegment.exists()).toBe(true)

      const lastBadge = lastSegment.findComponent(AvBadgeStub)
      expect(lastBadge.exists()).toBe(true)
      expect(lastBadge.props('label')).toContain('Anglais')
    })

    BddTest().then('it should use the arrow icon for both the icon-text and the last segment', () => {
      const iconText = wrapper.findComponent(AvIconTextStub)
      expect(iconText.exists()).toBe(true)
      expect(iconText.props('icon')).toBe(MDI_ICONS.ARROW_RIGHT_BOTTOM)

      const arrows = wrapper.findAllComponents(AvIconStub)
      const lastArrow = arrows.find(i => i.props('name') === MDI_ICONS.ARROW_RIGHT_BOTTOM)
      expect(lastArrow).toBeTruthy()
    })
  })

  BddTest().when('rendered with a single path segment', () => {
    beforeEach(() => {
      mountWith({ segmentsCount: 1 })
    })

    BddTest().then('it should render only the last-segment block (no AvIconText)', () => {
      const iconTexts = wrapper.findAll('.ref--item .av-icon-text')
      expect(iconTexts.length).toBe(0)

      const lastSegment = wrapper.find('.ref--last-segment')
      expect(lastSegment.exists()).toBe(true)

      const lastBadge = lastSegment.findComponent(AvBadgeStub)
      expect(lastBadge.exists()).toBe(true)
      expect(lastBadge.props('label')).toContain('Langues')
    })
  })

  BddTest().when('rendered with zero path segments', () => {
    beforeEach(() => {
      mountWith({ segmentsCount: 0 })
    })

    BddTest().then('it should render only the type line without any path items', () => {
      expect(wrapper.findAll('.ref--item').length).toBe(0)
      expect(wrapper.find('.ref--type').exists()).toBe(true)

      const typeBadge = wrapper.findComponent(AvBadgeStub)
      expect(typeBadge.exists()).toBe(true)
    })
  })
})
