import type { VueWrapper } from '@vue/test-utils'
import { EExternalSkillType } from '@/api/avenir-esr'
import DeclaredSkillCompactCard, {
  type DeclaredSkillCompactCardProps
} from '@/features/student/declaredSkills/components/cards/DeclaredSkillCompactCard/DeclaredSkillCompactCard.vue'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a declared skill compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredSkillCompactCard>>

  const stubs = {
    FloatingIconCard: FloatingIconCardStub,
    AvBadge: AvBadgeStub
  }

  BddTest().when('the component is mounted with declared skill without type', () => {
    const props: DeclaredSkillCompactCardProps = {
      declaredSkill: { id: 'skill-1', title: 'Communication' }
    }

    let floatingCard: VueWrapper<InstanceType<typeof FloatingIconCardStub>>

    beforeEach(() => {
      wrapper = mount(DeclaredSkillCompactCard, {
        props,
        global: { stubs }
      })
      floatingCard = wrapper.findComponent({ name: 'FloatingIconCard' }) as VueWrapper<InstanceType<typeof FloatingIconCardStub>>
    })

    BddTest().then('it should render the floating icon card', () => {
      expect(floatingCard.exists()).toBe(true)
    })

    BddTest().then('it should pass the declared skill title to the card', () => {
      expect(floatingCard.props('title')).toBe(props.declaredSkill.title)
    })

    BddTest().then('it should use the neutral background color', () => {
      expect(floatingCard.props('color')).toBe('var(--dark-background-primary1)')
    })

    BddTest().then('it should use the text1 title color', () => {
      expect(floatingCard.props('titleColor')).toBe('var(--card)')
    })

    BddTest().then('it should use the correct border color', () => {
      expect(floatingCard.props('borderColor')).toBe('var(--other-border-skill-card)')
    })

    BddTest().then('it should pass the correct layout props to the card', () => {
      expect(floatingCard.props('headerRows')).toBe(2)
      expect(floatingCard.props('height')).toBe('7.5rem')
      expect(floatingCard.props('customTitleHeight')).toBe('4rem')
      expect(floatingCard.props('titleTypographyClasses')).toBe('caption-regular')
    })

    BddTest().then('it should not render the type badge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })
      expect(badge.exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with declared skill with type', () => {
    const props: DeclaredSkillCompactCardProps = {
      declaredSkill: {
        id: 'skill-2',
        title: 'Gestion de projet',
        type: EExternalSkillType.ROME4
      }
    }

    let badge: VueWrapper<InstanceType<typeof AvBadgeStub>>
    let floatingCard: VueWrapper<InstanceType<typeof FloatingIconCardStub>>

    beforeEach(() => {
      wrapper = mount(DeclaredSkillCompactCard, {
        props,
        global: { stubs }
      })
      badge = wrapper.findComponent({ name: 'AvBadge' }) as VueWrapper<InstanceType<typeof AvBadgeStub>>
      floatingCard = wrapper.findComponent({ name: 'FloatingIconCard' }) as VueWrapper<InstanceType<typeof FloatingIconCardStub>>
    })

    BddTest().then('it should render the floating icon card', () => {
      expect(floatingCard.exists()).toBe(true)
    })

    BddTest().then('it should render the type badge', () => {
      expect(badge.exists()).toBe(true)
    })

    BddTest().then('it should pass the translated label to the badge', () => {
      expect(badge.props('label')).toBe(
        'Rome 4.0'
      )
    })

    BddTest().then('it should pass the correct badge colors', () => {
      expect(badge.props('color')).toBe('var(--text1)')
      expect(badge.props('borderColor')).toBe('var(--other-border-skill-card)')
      expect(badge.props('backgroundColor')).toBe('var(--surface-background)')
    })

    BddTest().then('it should pass display props to the badge', () => {
      expect(badge.props('small')).toBe(true)
      expect(badge.props('ellipsis')).toBe(true)
    })
  })
})
