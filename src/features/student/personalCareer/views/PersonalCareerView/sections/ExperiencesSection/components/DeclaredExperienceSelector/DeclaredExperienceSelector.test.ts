import { CompactCardSelectorStub } from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.stub'
import DeclaredExperienceSelector, { type DeclaredExperienceSelectorProps } from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperienceSelector/DeclaredExperienceSelector.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a declared experience selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceSelector>>

  const stubs = {
    AvIcon: AvIconStub,
    CompactCardSelector: CompactCardSelectorStub
  }

  BddTest().when('the component is mounted with no declared experiences', () => {
    const props: DeclaredExperienceSelectorProps = {
      declaredExperiences: []
    }

    beforeEach(() => {
      wrapper = mount(DeclaredExperienceSelector, { props, global: { stubs } })
    })

    BddTest().then('it should render no experiences', () => {
      const cards = wrapper.findAll('[data-testid="compact-card-selector"]')
      expect(cards).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with declared experiences', () => {
    const props: DeclaredExperienceSelectorProps = {
      declaredExperiences: [
        { label: 'Experience 1', value: 'experience-1' },
        { label: 'Experience 2', value: 'experience-2' }
      ]
    }

    beforeEach(() => {
      wrapper = mount(DeclaredExperienceSelector, { props, global: { stubs } })
    })

    BddTest().then('it should render the declared experiences', () => {
      const cards = wrapper.findAll('[data-testid="compact-card-selector"]')
      expect(cards).toHaveLength(2)
      expect(cards[0].text()).toContain(props.declaredExperiences[0].label)
      expect(cards[1].text()).toContain(props.declaredExperiences[1].label)
    })

    BddTest().and('a experience card is clicked', () => {
      beforeEach(async () => {
        const toggle = wrapper.findAll('a[role="button"]')[0]
        await toggle.trigger('click')
      })

      BddTest().then('it should emit the select event with the correct experience id', () => {
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['experience-1'])
      })

      BddTest().and('the same experience card is clicked again', () => {
        beforeEach(async () => {
          const toggle = wrapper.findAll('a[role="button"]')[0]
          await toggle.trigger('click')
        })

        BddTest().then('it should emit the deselect event with the correct experience id', () => {
          expect(wrapper.emitted('update:modelValue')?.[1][0]).toEqual([])
        })
      })
    })

    BddTest().and('a experience card receives the keydown event for Enter key', () => {
      beforeEach(async () => {
        const toggle = wrapper.findAll('a[role="button"]')[0]
        await toggle.trigger('keydown.enter')
      })

      BddTest().then('it should emit the select event with the correct experience id', () => {
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['experience-1'])
      })
    })

    BddTest().and('a experience card receives the keydown event for Space key', () => {
      beforeEach(async () => {
        const toggle = wrapper.findAll('a[role="button"]')[0]
        await toggle.trigger('keydown.space')
      })

      BddTest().then('it should emit the select event with the correct experience id', () => {
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['experience-1'])
      })
    })
  })
})
