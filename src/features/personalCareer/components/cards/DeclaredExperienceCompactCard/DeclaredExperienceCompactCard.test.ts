import type { VueWrapper } from '@vue/test-utils'
import { FloatingIconCardStub } from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import DeclaredExperienceCompactCard, {
  type DeclaredExperienceCompactCardProps
} from '@/features/personalCareer/components/cards/DeclaredExperienceCompactCard/DeclaredExperienceCompactCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experience compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceCompactCard>>

  const stubs = {
    FloatingIconCard: FloatingIconCardStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    const props: DeclaredExperienceCompactCardProps = {
      experience: { id: 'experience-1', title: 'Expérience sans thématique' }
    }

    let floatingCard: VueWrapper<InstanceType<typeof FloatingIconCardStub>>

    beforeEach(() => {
      wrapper = mount(DeclaredExperienceCompactCard, {
        props,
        global: { stubs }
      })
      floatingCard = wrapper.findComponent({ name: 'FloatingIconCard' }) as VueWrapper<InstanceType<typeof FloatingIconCardStub>>
    })

    BddTest().then('it should render the floating icon card', () => {
      expect(floatingCard.exists()).toBe(true)
    })

    BddTest().then('it should pass the experience title to the card', () => {
      expect(floatingCard.props('title')).toBe(props.experience.title)
    })

    BddTest().then('it should use the neutral background color', () => {
      expect(floatingCard.props('color')).toBe('var(--light-background-neutral)')
    })

    BddTest().then('it should use the text1 title color', () => {
      expect(floatingCard.props('titleColor')).toBe('var(--text1)')
    })

    BddTest().then('it should use the correct height', () => {
      expect(floatingCard.props('height')).toBe('7.5rem')
    })

    BddTest().then('it should use the correct border color', () => {
      expect(floatingCard.props('borderColor')).toBe('var(--other-border-skill-card)')
    })
  })
})
